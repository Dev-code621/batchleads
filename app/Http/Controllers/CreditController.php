<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChargeCreditRequest;
use App\Http\Requests\DefaultIndexRequest;
use App\Http\Requests\CheckBalanceRequest;
use App\Services\CreditTransactionService;
use App\Services\CreditPackageService;
use App\Services\StripeService;
use App\Services\UserService;
use App\Services\CreditBallanceService;
use App\Services\PropertyService;
use App\Services\PropertyPhoneService;
use App\Services\PropertyEmailService;
use App\Services\TeamUserService;
use Illuminate\Http\Request;

class CreditController extends Controller
{
    protected $creditTransactionService;
    protected $creditPackageService;
    protected $stripeService;
    protected $userService;
    protected $creditBalanceService;
    protected $propertyService;
    protected $propertyPhoneService;
    protected $propertyEmailService;
    protected $teamUserService;

    public function __construct(
        CreditTransactionService $creditTransactionService,
        CreditPackageService $creditPackageService,
        StripeService $stripeService,
        UserService $userService,
        CreditBallanceService $creditBalanceService,
        PropertyPhoneService $propertyPhoneService,
        PropertyEmailService $propertyEmailService,
        PropertyService $propertyService,
        TeamUserService $teamUserService
    )
    {
        $this->creditTransactionService = $creditTransactionService;
        $this->creditPackageService = $creditPackageService;
        $this->stripeService = $stripeService;
        $this->userService = $userService;
        $this->creditBalanceService = $creditBalanceService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyEmailService = $propertyEmailService;
        $this->propertyService = $propertyService;
        $this->teamUserService = $teamUserService;
    }

    public function chargeCredit(ChargeCreditRequest $request)
    {
        $data = $request->validated();
        $packageId = $data['package_id'];
        $package = $this->creditPackageService->read($packageId) ?? null;

        if ($package) {
            $user = $request->user();
            $role = $user['role'];
            $userId = null;
            $customerId = null;
            $ownerUser = null;
            if ($role === 'owner') {
                $userId = $user['id'];
                $customerId = $user['stripe_id'];
            } else if ($role === 'admin') {
                $userId = $this->teamUserService->getOwnerUserId($user['id']);
                $ownerUser = $this->userService->findUserById($userId);
                $customerId = $ownerUser['stripe_id'];
            }
            $amount = $package->price;

            if ($customerId) {
                $result = $this->stripeService->charge(
                    array(
                        'customer_id'   => $customerId,
                        'amount'        => (float)$amount
                    )
                );
            } else {
                return $this->responseWithError(__('error.subscribe.needed'), 423);
            }

            if ($result) {
                $transactionType = config('services.credit_transaction_type.charge');
                $referenceUserId = $userId;
                if ($ownerUser) {
                    $referenceUserId = $ownerUser['id'];
                }
                $data = $this->creditTransactionService->addTransaction($userId, $transactionType, $package->credit_amount, $customerId, $referenceUserId, true, 'Charge Credit');
                if ($ownerUser) {
                    $ownerUser->updateStripeCustomer(
                        array(
                            'metadata'  => array(
                                'fundsAdded'    => true
                            )
                        )
                    );
                } else {
                    $user->updateStripeCustomer(
                        array(
                            'metadata'  => array(
                                'fundsAdded'    => true
                            )
                        )
                    );
                }

                return $data
                    ? $this->responseWithSuccess($data)
                    : $this->responseWithError(__('error.subscribe.charge.fail'));
            }
            return $this->responseWithError(__('error.subscribe.charge.fail'), 424);
        }
        return $this->responseWithError(__('error.subscribe.package.fail'));
    }

    public function getTransactionHistory(DefaultIndexRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';

        $userId = $user['id'];
        if ($user['role'] !== 'owner') {
            $userId = $this->teamUserService->getOwnerUserId($user['id']);
        }

        $data = $this->creditTransactionService->search(array(
            'per_page'  =>  $pageSize,
            'order_by'  =>  $orderBy,
            'order'     =>  $order,
            'search'    =>  $search,
            'userId'    =>  $userId,
            'page'      =>  $page
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function checkBalance(CheckBalanceRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $role = $user['role'];
        $data = $request->validated();
        $type = $data['type'];

        $propertyIds = array_key_exists('property_ids', $data) ? $data['property_ids'] : null;
        $filter = array_key_exists('filter', $data) ? $data['filter'] : null;
        $excludedPropertyIds = array_key_exists('excluded_property_ids', $data) ? $data['excluded_property_ids'] : null;

        $currentCreditCount = 0;
        $balance = false;
        $requiredCreditCount = $this->creditBalanceService->getRequiredCreditCount($type, $propertyIds, $filter, $excludedPropertyIds, $user);
        if ($role === 'owner') {
            $currentCreditCount = $this->creditBalanceService->getBallanceByUserId($userId);
            $balance = false;
            if ($requiredCreditCount === 0) {
                $balance = true;
            } else {
                $balance = $this->creditBalanceService->checkBallance($userId, $requiredCreditCount);
            }
        } else {
            $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
            if ($ownerUserId === 0) {
                return $this->responseWithError(__('error.user.team.notfound'));
            }

            $currentCreditCount = $this->creditBalanceService->getBallanceByUserId($ownerUserId);
            $balance = false;
            if ($requiredCreditCount === 0) {
                $balance = true;
            } else {
                $balance = $this->creditBalanceService->checkBallance($ownerUserId, $requiredCreditCount);
            }
        }

        return $this->responseWithSuccess(
            array(
                'current_credit_count'  => $currentCreditCount && count($currentCreditCount) ? $currentCreditCount[0]['ballance'] : 0,
                'required_credit_count' => $requiredCreditCount,
                'balance'               => $balance
            )
        );
    }

    public function getUpcomingInvoice(Request $request)
    {
        $user = $request->user();

        $ownerUser = $this->userService->getOwnerUser($user);
        if ($ownerUser) {
            $customerId = $ownerUser['stripe_id'];
        }

        if ($customerId) {
            $invoice = $this->stripeService->getUpcomingInvoice($customerId);
            return $this->responseWithSuccess($invoice);
        }

        return $this->responseWithError(__('error.subscribe.needed'), 423);
    }
}
