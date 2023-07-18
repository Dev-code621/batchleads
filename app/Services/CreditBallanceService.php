<?php

namespace App\Services;

use App\Repositories\CreditBallanceRepository;
use App\Repositories\CreditTransactionTypeRepository;
use App\Services\PropertyPhoneService;
use App\Services\PropertyService;
use App\Services\TeamService;
use App\Services\StripeService;
use App\Services\TeamUserService;
use App\Services\UserService;
use App\Services\PropertyHistoryService;

/**
 * Class CreditBallanceService
 *
 * @package App\Http\Services
 */
class CreditBallanceService extends BaseService
{
    protected $repository;
    protected $creditTransactionTypeRepository;
    protected $propertyPhoneService;
    protected $propertyService;
    protected $teamService;
    protected $stripeService;
    protected $propertyHistoryService;
    protected $teamUserService;
    protected $userService;

    /**
     * CreditBallanceService constructor.
     *
     * @param CreditBallanceRepository     $repository
     */
    public function __construct(
        CreditBallanceRepository $repository,
        CreditTransactionTypeRepository $creditTransactionTypeRepository,
        PropertyPhoneService $propertyPhoneService,
        PropertyService $propertyService,
        TeamService $teamService,
        StripeService $stripeService,
        PropertyHistoryService $propertyHistoryService,
        TeamUserService $teamUserService,
        UserService $userService
    )
    {
        $this->repository = $repository;
        $this->creditTransactionTypeRepository = $creditTransactionTypeRepository;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyService = $propertyService;
        $this->teamService = $teamService;
        $this->stripeService = $stripeService;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->teamUserService = $teamUserService;
        $this->userService = $userService;
    }

    public function getBallanceByUserId($userId)
    {
        return $this->repository->findBy('user_id', $userId);
    }

    public function increaseBallance($userId, $amount)
    {
        return $this->repository->increaseBallance($userId, $amount);
    }

    public function decreaseBallance($userId, $amount)
    {
        return $this->repository->decreaseBallance($userId, $amount);
    }

    public function checkBallance($userId, $amount)
    {
        return $this->repository->checkBallance($userId, $amount);
    }

    public function checkBallanceByTransactionType($userId, $transactionType, $count=1)
    {
        $transactionTypes = $this->creditTransactionTypeRepository->findBy('transaction_type', $transactionType);
        if (count($transactionTypes) === 0) {
            return false;
        }

        $amount = $transactionTypes[0]['credit_amount'] * $count;

        return $this->checkBallance($userId, $amount);
    }

    public function decreaseBallanceByTransactionType($userId, $transactionType, $count=1)
    {
        $transactionTypes = $this->creditTransactionTypeRepository->findBy('transaction_type', $transactionType);
        if (count($transactionTypes) === 0) {
            return false;
        }

        $amount = $transactionTypes[0]['credit_amount'] * $count;

        return $this->decreaseBallance($userId, $amount);
    }

    public function getRequiredCreditCount(
        $type,
        $propertyIds = null,
        $filter = null,
        $excludedPropertyIds = null,
        $user = null
    )
    {
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
        $prices = array(
            'send_sms' => array(
                config('services.plans.basic.name')             => 2,
                config('services.plans.basic_new.name')         => 2,
                config('services.plans.basic_yearly.name')      => 2,
                config('services.plans.standard.name')          => 2,
                config('services.plans.standard_yearly.name')   => 2,
                config('services.plans.standard_new.name')      => 2,
                config('services.plans.premium.name')           => 1,
                config('services.plans.premium_new.name')       => 1,
                config('services.plans.premium_yearly.name')    => 1
            ),
            'send_mail' => array(
                config('services.plans.basic.name')             => 16,
                config('services.plans.basic_new.name')         => 16,
                config('services.plans.basic_yearly.name')      => 16,
                config('services.plans.standard.name')          => 15,
                config('services.plans.standard_new.name')      => 15,
                config('services.plans.standard_yearly.name')   => 15,
                config('services.plans.premium.name')           => 14,
                config('services.plans.premium_new.name')       => 14,
                config('services.plans.premium_yearly.name')    => 14
            ),
            'send_letter' => array(
                config('services.plans.basic.name')             => 18,
                config('services.plans.basic_new.name')         => 18,
                config('services.plans.basic_yearly.name')      => 18,
                config('services.plans.standard.name')          => 17,
                config('services.plans.standard_new.name')      => 17,
                config('services.plans.standard_yearly.name')   => 17,
                config('services.plans.premium.name')           => 16,
                config('services.plans.premium_new.name')       => 16,
                config('services.plans.premium_yearly.name')    => 16
            ),
            'skip_tracing' => array(
                config('services.plans.basic.name')             => 5,
                config('services.plans.basic_new.name')         => 5,
                config('services.plans.basic_yearly.name')      => 5,
                config('services.plans.standard.name')          => 5,
                config('services.plans.standard_new.name')      => 5,
                config('services.plans.standard_yearly.name')   => 5,
                config('services.plans.premium.name')           => 4,
                config('services.plans.premium_new.name')       => 4,
                config('services.plans.premium_yearly.name')    => 4
            ),
            'purchase_phone' => array(
                config('services.plans.basic.name')             => 30,
                config('services.plans.basic_new.name')         => 30,
                config('services.plans.basic_yearly.name')      => 30,
                config('services.plans.standard.name')          => 30,
                config('services.plans.standard_new.name')      => 30,
                config('services.plans.standard_yearly.name')   => 30,
                config('services.plans.premium.name')           => 30,
                config('services.plans.premium_new.name')       => 30,
                config('services.plans.premium_yearly.name')    => 30
            )
        );

        $unitPrice = $prices[$type][$subscribedPlanName];

        if ($propertyIds && count($propertyIds)) {
            if ($type === config('services.credit_transaction_type.skip_tracing')) {
                $propertyCount = 0;
                foreach ($propertyIds as $propertyId) {
                    $property = $this->propertyService->read($propertyId);
                    if (!$property['skip_tracing_date']) {
                        $propertyCount++;
                    }
                }
            } else if ($type === config('services.credit_transaction_type.send_sms')) {
                $propertyCount = 0;
                foreach ($propertyIds as $propertyId) {
                    $phoneNumberCount = $this->propertyPhoneService->getCountByPropertyId($propertyId);
                    if ($phoneNumberCount > 3) {
                        $phoneNumberCount = 3;
                    }
                    $propertyCount += $phoneNumberCount;
                }
            } else if ($type === config('services.credit_transaction_type.send_mail')) {
                $propertyCount = count($propertyIds);
            } else if ($type === config('services.credit_transaction_type.send_letter')) {
                $propertyCount = count($propertyIds);
            }
        } else if ($filter) {
            // get Properties
            $search = $filter['search'] ?? '';
            $folderId = $filter['folder_id'] ?? null;
            $drivingRouteId = $filter['driving_route_id'] ?? null;
            $lat = $filter['lat'] ?? null;
            $lon = $filter['lon'] ?? null;
            $status = $filter['status'] ?? null;
            $stateId = $filter['state_id'] ?? null;
            $teamId = $this->teamService->getTeamId($user);
            $skipTraced = $filter['skip_traced'] ?? null;
            if ($type === config('services.credit_transaction_type.skip_tracing')) {
                $skipTraced = $filter['skip_traced'] ?? 'N';
            }
            $userId = $filter['user_id'] ?? null;
            $ownerOccupied = $filter['owner_occupied'] ?? null;
            $createdAt = $filter['created_at'] ?? null;
            $tags = $filter['tags'] ?? null;

            $propertyCount = 0;
            $page = 1;
            do {
                $properties = $this->propertyService->search(array(
                    'search'            => $search,
                    'userId'            => $userId,
                    'team_id'           => $teamId,
                    'folder_id'         => $folderId,
                    'driving_route_id'  => $drivingRouteId,
                    'status'            => $status,
                    'state_id'          => $stateId,
                    'lat'               => $lat,
                    'lon'               => $lon,
                    'skip_traced'       => $skipTraced,
                    'owner_occupied'    => $ownerOccupied,
                    'is_all'            => 1,
                    'page'              => $page,
                    'per_page'          => 100,
                    'created_at'        => $createdAt,
                    'tags'              => $tags
                ));
                $propertyIds = [];
                foreach ($properties as $property) {
                    $propertyIds []= $property['id'];
                }

                if ($excludedPropertyIds) {
                    $propertyIds = array_diff($propertyIds, $excludedPropertyIds);
                }
                if ($type === config('services.credit_transaction_type.send_sms')) {
                    foreach ($propertyIds as $propertyId) {
                        $phoneNumberCount = $this->propertyPhoneService->getCountByPropertyId($propertyId);
                        if ($phoneNumberCount > 3) {
                            $phoneNumberCount = 3;
                        }

                        $propertyCount += $phoneNumberCount;
                    }
                } else {
                    $propertyCount += count($propertyIds);
                }
                $page++;
            } while (count($properties));
        } else {
            $propertyCount = 1;
        }

        $requiredCreditCount = 0;
        if ($type === config('services.credit_transaction_type.skip_tracing')) {
            $skipTracedCount = 0;
            $freeSkipTracingCount = 10;
            $teamId = $this->teamService->getTeamId($user);
            $skipTracedCount = $this->getSkipTracedCount($teamId);

            $freeSkipTracingCount = $this->getFreeSkipTracingCount($user);

            $count = $skipTracedCount + $propertyCount;

            if ($count <= $freeSkipTracingCount) {
                $requiredCreditCount = 0;
            } else if ($skipTracedCount <= $freeSkipTracingCount) {
                $requiredCreditCount = $unitPrice * ($propertyCount - ($freeSkipTracingCount - $skipTracedCount));
            } else {
                $requiredCreditCount = $propertyCount * $unitPrice;
            }
        } else {
            $requiredCreditCount = $propertyCount * $unitPrice;
        }

        return $requiredCreditCount;
    }

    public function getSkipTracingPrice($skipTracedCount, $user)
    {
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
        $prices = array(
            config('services.plans.basic.name')             => 5,
            config('services.plans.basic_new.name')         => 5,
            config('services.plans.basic_yearly.name')      => 5,
            config('services.plans.standard.name')          => 5,
            config('services.plans.standard_new.name')      => 5,
            config('services.plans.standard_yearly.name')   => 5,
            config('services.plans.premium.name')           => 4,
            config('services.plans.premium_new.name')       => 4,
            config('services.plans.premium_yearly.name')    => 4
        );

        $unitPrice = $prices[$subscribedPlanName];

        return $unitPrice * $skipTracedCount;
    }

    public function getFreeSkipTracingCount($user)
    {
        $freeSkipTracingCount = 0;
        $ownerUser = $this->userService->getOwnerUser($user);
        if ($ownerUser) {
            $freeSkipTracingCount = 10;
            $discountInfo = $this->stripeService->getUserDiscountInfo($user);
            if ($discountInfo) {
                $freeSkipTracingCount = 50;
                if ($discountInfo['coupon']['id'] === 'SQUADUP' || $discountInfo['coupon']['id'] === 'SQUAD') {
                    $freeSkipTracingCount = 100;
                }
            }
        }

        return $freeSkipTracingCount;
    }

    public function getSkipTracedCount($teamId)
    {
        $count = $this->teamService->getSkipTracingCountByTeamId($teamId);

        return $count;
    }
}
