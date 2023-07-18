<?php

namespace App\Http\Middleware;

use App\Services\CreditBallanceService;
use App\Services\CreditTransactionService;
use App\Services\TeamService;
use App\Services\TeamUserService;
use App\Services\PropertyService;
use App\Services\StripeService;
use App\Services\UserService;
use App\Services\PropertyHistoryService;
use App\Services\MailTemplateService;
use Closure;

class CheckCreditBalance
{
    protected $creditBallanceService;
    protected $creditTransactionService;
    protected $teamUserService;
    protected $teamService;
    protected $userService;
    protected $stripeService;
    protected $propertyHistoryService;
    protected $mailTemplateService;

    public function __construct(
        CreditBallanceService $creditBallanceService,
        CreditTransactionService $creditTransactionService,
        TeamUserService $teamUserService,
        TeamService $teamService,
        PropertyService $propertyService,
        UserService $userService,
        StripeService $stripeService,
        PropertyHistoryService $propertyHistoryService,
        MailTemplateService $mailTemplateService
    )
    {
        $this->creditBallanceService = $creditBallanceService;
        $this->creditTransactionService = $creditTransactionService;
        $this->teamUserService = $teamUserService;
        $this->propertyService = $propertyService;
        $this->userService = $userService;
        $this->stripeService = $stripeService;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->teamService = $teamService;
        $this->mailTemplateService = $mailTemplateService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        $userId = $user['id'];
        $role = $user['role'];
        $ownerUserId = null;

        $actions = array(
            array(
                'controller'        => 'SmsCampaign',
                'methods'           => array(
                    array(
                        'method'            => 'start',
                        'transaction_type'  => config('services.credit_transaction_type.send_sms'),
                        'description'       => 'SMS Campaign Started'
                    ),
                    array(
                        'method'            => 'bulkStart',
                        'transaction_type'  => config('services.credit_transaction_type.send_sms'),
                        'description'       => 'SMS Campaign Started',
                    ),
                    array(
                        'method'            => 'sendSms',
                        'transaction_type'  => config('services.credit_transaction_type.send_sms'),
                        'description'       => 'Send SMS',
                    )
                )
            ),
            array(
                'controller'    => 'MailCampaign',
                'methods'       => array(
                    array(
                        'method'            => 'start',
                        'transaction_type'  => config('services.credit_transaction_type.send_mail'),
                        'description'       => 'Start Mail Campaign',
                    ),
                    array(
                        'method'            => 'bulkStart',
                        'transaction_type'  => config('services.credit_transaction_type.send_mail'),
                        'description'       => 'Start Mail Campaign',
                    )
                )
            ),
            array(
                'controller'    => 'SkipTracing',
                'methods'       => array(
                    array(
                        'method'            => 'fetchSkipTracing',
                        'transaction_type'  => config('services.credit_transaction_type.skip_tracing'),
                        'description'       => 'Skip Tracing'
                    ),
                    array(
                        'method'            => 'bulkSkipTracing',
                        'transaction_type'  => config('services.credit_transaction_type.skip_tracing'),
                        'description'       => 'Skip Tracing'
                    ),
                    array(
                        'method'            => 'allSkipTracing',
                        'transaction_type'  => config('services.credit_transaction_type.skip_tracing'),
                        'description'       => 'Skip Tracing'
                    )
                )
            ),
            array(
                'controller'    => 'Twilio',
                'methods'       => array(
                    array(
                        'method'            => 'purchasePhoneNumber',
                        'transaction_type'  => config('services.credit_transaction_type.purchase_phone'),
                        'description'       => 'Purchase PhoneNumber'
                    )
                )
            )
        );

        $freeSkipTracingCount = 0;
        $skipTracedCount = 0;
        $actionName = class_basename($request->route()->getActionname());
        foreach($actions as $action) {
            $controller = $action['controller'];
            $methods = $action['methods'];
            foreach($methods as $method) {
                if ($actionName === $controller . 'Controller@' . $method['method']) {
                    $transactionType = $method['transaction_type'];

                    if ($actionName === 'SmsCampaignController@start') {
                        $propertyIds = $request->get('property_ids');
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, $propertyIds, null, null, $user);
                    } else if ($actionName === 'MailCampaignController@start') {
                        $propertyIds = $request->get('property_ids');
                        $templateId = $request->get('template_id');
                        $mailTemplate = $this->mailTemplateService->read($templateId);
                        $type = $mailTemplate['is_postcard'];
                        if (!$type) {
                            $transactionType = config('services.credit_transaction_type.send_letter');
                        }
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, $propertyIds, null, null, $user);
                    } else if ($actionName === 'SkipTracingController@fetchSkipTracing') {
                        $propertyId = $request->route('propertyId');
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, array($propertyId), null, null, $user);
                    }  else if ($actionName === 'SkipTracingController@bulkSkipTracing') {
                        $filter = $request->get('filter');
                        $propertyIds = $request->get('properties');
                        $excludedPropertyIds = $request->get('excluded_property_ids') ?? null;
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, $propertyIds, $filter, $excludedPropertyIds, $user);
                        $teamId = $this->teamService->getTeamId($user);
                        if ($user['role'] === 'owner') {
                            // $freeSkipTracingCount = $this->creditBallanceService->getFreeSkipTracingCount($user);
                        } else {
                            $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
                        }

                        $freeSkipTracingCount = $this->creditBallanceService->getFreeSkipTracingCount($user);
                        $skipTracedCount = $this->creditBallanceService->getSkipTracedCount($teamId);
                    } else if ($actionName === 'SkipTracingController@allSkipTracing') {
                        $user = $request->user();
                        $filter = $request->get('filter');
                        $excludedPropertyIds = $request->get('excluded_property_ids') ?? null;
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, null, $filter, $excludedPropertyIds, $user);
                    } else if($actionName === 'SmsCampaignController@bulkStart') {
                        $filter = $request->get('filter');
                        $excludedPropertyIds = $request->get('excluded_property_ids') ?? null;
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, null, $filter, $excludedPropertyIds, $user);
                    } else if($actionName === 'MailCampaignController@bulkStart') {
                        $templateId = $request->get('template_id');
                        $mailTemplate = $this->mailTemplateService->read($templateId);
                        $type = $mailTemplate['is_postcard'];
                        if (!$type) {
                            $transactionType = config('services.credit_transaction_type.send_letter');
                        }
                        $filter = $request->get('filter');
                        $excludedPropertyIds = $request->get('excluded_property_ids') ?? null;
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, null, $filter, $excludedPropertyIds, $user);
                    } else {
                        $creditCount = $this->creditBallanceService->getRequiredCreditCount($transactionType, null, null, null, $user);
                    }

                    // Check Credit Balance
                    $balance = false;
                    if ($creditCount === 0) {
                        $balance = true;
                    } else {
                        if ($role === 'owner') {
                            $balance = $this->creditBallanceService->checkBallance($userId, $creditCount);
                        } else if ($role === 'admin' || $role === 'member') {
                            $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
                            $balance = $this->creditBallanceService->checkBallance($ownerUserId, $creditCount);
                        }
                    }

                    if (!$balance) {
                        return response()->json([
                            'status'            => 421,
                            'credit_count'      => $creditCount,
                            'transaction_type'  => $transactionType,
                            'message'           => __('error.credit.balance'),
                        ], 421);
                    }

                    // next request
                    $response = $next($request);
                    $status = $response->status();

                    if ($status === 200) { // Add Transaction
                        $result = json_decode($response->content(), true);
                        $referenceId = null;
                        if ($actionName === 'SmsCampaignController@start') {
                            // $referenceId = $result['data']['id'];
                        } else if ($actionName === 'SmsCampaignController@sendSms') {
                            $referenceId = $result['data']['id'];
                        } else if ($actionName === 'SkipTracingController@fetchSkipTracing') {
                            $count = $result['data']['count'];
                            if ($count) {
                                $referenceId = $result['data']['property_id'];
                            }
                        } else if ($actionName === 'SkipTracingController@bulkSkipTracing') {
                            $propertyIds = $request->get('properties');
                            if ($propertyIds) {
                                $fetchedCount = $result['data']['fetched_count'];
                                if ($fetchedCount > 0) {
                                    $propertyCountToAdd = $fetchedCount;
                                    $referenceId = $userId;
                                    if ($freeSkipTracingCount >= $skipTracedCount) {
                                        $propertyCountToAdd = $fetchedCount - ($freeSkipTracingCount - $skipTracedCount);
                                    }
                                    $creditCount = $this->creditBallanceService->getSkipTracingPrice($propertyCountToAdd, $user);
                                }
                            }
                        } else if ($actionName === 'SkipTracingController@allSkipTracing') {
                            // $referenceId = 'all, ' . $userId;
                        } else if ($actionName === 'MailCampaignController@start') {
                            // $referenceId = $result['data']['id'];
                        } else if($actionName === 'SmsCampaignController@bulkStart') {
                            // $referenceId = $result['data']['id'];
                        } else if($actionName === 'MailCampaignController@bulkStart') {
                            // $referenceId = $result['data']['id'];
                        } else if($actionName === 'TwilioController@purchasePhoneNumber') {
                            $referenceId = $userId;
                        }

                        if ($referenceId) {
                            if ($ownerUserId) {
                                $this->creditTransactionService->addTransactionByTransactionType($ownerUserId, $transactionType, $creditCount, $referenceId, $userId, $method['description']);
                            } else {
                                $this->creditTransactionService->addTransactionByTransactionType($userId, $transactionType, $creditCount, $referenceId, $userId, $method['description']);
                            }
                        }
                    }

                    return $response;
                }
            }
        }

        return $next($request);
    }
}
