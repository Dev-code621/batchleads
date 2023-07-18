<?php

namespace App\Services;

use App\Repositories\CreditTransactionRepository;
use App\Repositories\CreditBallanceRepository;
// use App\Repositories\CreditTransactionTypeRepository;
use App\Services\UserService;
use App\Services\TeamService;
use App\Services\AutoRechargeSettingService;
use App\Services\StripeService;
use App\Services\CreditPackageService;

/**
 * Class CreditTransactionService
 *
 * @package App\Http\Services
 */
class CreditTransactionService extends BaseService
{
    protected $creditBallanceRepository;
    protected $creditTransactionTypeRepository;

    /**
     * CreditTransactionHistoryService constructor.
     *
     * @param CreditTransactionRepository     $repository
     */
    public function __construct(
        CreditTransactionRepository $repository,
        CreditBallanceRepository $creditBallanceRepository,
        // CreditTransactionTypeRepository $creditTransactionTypeRepository,
        UserService $userService,
        TeamService $teamService,
        AutoRechargeSettingService $autoRechargeSettingService,
        StripeService $stripeService,
        CreditPackageService $creditPackageService
    )
    {
        $this->repository = $repository;
        $this->creditBallanceRepository = $creditBallanceRepository;
        // $this->creditTransactionTypeRepository = $creditTransactionTypeRepository;
        $this->userService = $userService;
        $this->teamService = $teamService;
        $this->autoRechargeSettingService = $autoRechargeSettingService;
        $this->stripeService = $stripeService;
        $this->creditPackageService = $creditPackageService;
    }

    public function addTransaction($userId, $transactionType, $creditAmount, $referenceId, $referenceUserId, $isCharge=false, $other='')
    {
        if ($isCharge) {
            $this->creditBallanceRepository->increaseBallance($userId, $creditAmount);
        } else {
            $this->creditBallanceRepository->decreaseBallance($userId, $creditAmount);
            $creditAmount = -1 * $creditAmount;
        }
        $creditBallanceAfters = $this->creditBallanceRepository->getBallanceByUserId($userId);

        $data = null;
        if (count($creditBallanceAfters)) {
            $data = $this->create(
                array(
                    'user_id'                               => $userId,
                    'credit_transaction_type'               => $transactionType,
                    'credit_amount'                         => $creditAmount,
                    'reference_id'                          => $referenceId,
                    'credit_ballance_after_transaction'     => $creditBallanceAfters[0]['ballance'],
                    'reference_user_id'                     => $referenceUserId,
                    'other'                                 => $other
                )
            );
            if ($transactionType !== config('services.credit_transaction_type.charge')) {
                // Auto Recharge
                $creditBalance = $creditBallanceAfters[0]['ballance'];
                $user = $this->userService->findUserById($userId);
                $teamId = $this->teamService->getTeamId($user);
                $autoRechargeSettings = $this->autoRechargeSettingService->getAutoRechargeSettingByTeamId($teamId);
                if (count($autoRechargeSettings)) {
                    $autoRechargeSetting = $autoRechargeSettings[0];
                    $status = $autoRechargeSetting['status'];
                    $threshold = $autoRechargeSetting['threshold'];
                    $creditPackageId = $autoRechargeSetting['credit_package_id'];
                    if ($status) {
                        if ($creditBalance < $threshold) {
                            $package = $this->creditPackageService->read($creditPackageId) ?? null;
                            if ($package) {
                                $amount = $package->price;
                                $customerId = $user['stripe_id'];
                                $result = $this->stripeService->charge(
                                    array(
                                        'customer_id'   => $customerId,
                                        'amount'        => (float)$amount
                                    )
                                );
                                if ($result) {
                                    $transactionType = config('services.credit_transaction_type.charge');
                                    $data = $this->addTransaction($userId, $transactionType, $package->credit_amount, $customerId, $userId, true, 'Charge Credit');
                                    $user->updateStripeCustomer(
                                        array(
                                            'metadata'  => array(
                                                'fundsAdded'    => true
                                            )
                                        )
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }

        return $data;
    }

    public function addTransactionByTransactionType($userId, $transactionType, $count, $referenceId, $referenceUserId, $other='')
    {
        return $this->addTransaction($userId, $transactionType, $count, $referenceId, $referenceUserId, false, $other);
    }
}
