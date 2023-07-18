<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SmsCampaignService;
use App\Services\SmsCampaignTemplateDetailService;
use App\Services\TwilioService;
use App\Services\UserService;
use App\Services\SkipTracingService;
use App\Services\PropertyService;
use App\Services\PropertyPhoneService;
use App\Services\SmsCampaignPropertyService;
use App\Services\SmsMasterService;
use App\Services\SmsDetailService;
use App\Services\PropertyHistoryService;
use App\Http\Requests\SmsCampaignStartRequest;
use App\Http\Requests\SmsCampaignBulkStartRequest;
use App\Http\Requests\SmsCampaignCancelRequest;
use App\Http\Requests\SmsSendRequest;
use App\Http\Requests\GetSmsMessageBoxRequest;
use App\Http\Requests\GetSmsMessagesRequest;
use App\Http\Requests\SetSmsMessagesReadRequest;
use App\Http\Requests\DefaultReadRequest;
use App\Http\Helpers\PhoneNumberHelper;
use App\Http\Requests\DefaultDeleteRequest;
use App\Services\CreditBallanceService;
use App\Services\CreditTransactionService;
use App\Services\SentMessageCountService;
use App\Services\TeamUserService;
use ArrayHelpers\Arr;

class SmsCampaignController extends Controller
{
    protected $baseService;
    protected $smsCampaignTemplateDetailService;
    protected $userService;
    protected $skipTracingService;
    protected $propertyPhoneService;
    protected $propertyService;
    protected $smsCampaignPropertyService;
    protected $smsMasterService;
    protected $smsDetailService;
    protected $twilioService;
    protected $propertyHistoryService;
    protected $creditBalanceService;
    protected $creditTransactionService;
    protected $teamUserService;
    protected $sentMessageCountService;

    /**
     * constructor.
     *
     * @param SmsCampaignService $service
     */
    public function __construct(
        SmsCampaignService $service,
        SmsCampaignTemplateDetailService $smsCampaignTemplateDetailService,
        UserService $userService,
        SkipTracingService $skipTracingService,
        PropertyPhoneService $propertyPhoneService,
        PropertyService $propertyService,
        SmsCampaignPropertyService $smsCampaignPropertyService,
        SmsMasterService $smsMasterService,
        SmsDetailService $smsDetailService,
        TwilioService $twilioService,
        PropertyHistoryService $propertyHistoryService,
        CreditBallanceService $creditBalanceService,
        CreditTransactionService $creditTransactionService,
        TeamUserService $teamUserService,
        SentMessageCountService $sentMessageCountService
    )
    {
        $this->baseService = $service;
        $this->smsCampaignTemplateDetailService = $smsCampaignTemplateDetailService;
        $this->userService = $userService;
        $this->skipTracingService = $skipTracingService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyService = $propertyService;
        $this->smsCampaignPropertyService = $smsCampaignPropertyService;
        $this->smsMasterService = $smsMasterService;
        $this->smsDetailService = $smsDetailService;
        $this->twilioService = $twilioService;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->creditBalanceService = $creditBalanceService;
        $this->creditTransactionService = $creditTransactionService;
        $this->teamUserService = $teamUserService;
        $this->sentMessageCountService = $sentMessageCountService;
    }

    // Send SMS
    protected function sendMessage($sender, $receiver, $message)
    {
        $result = $this->twilioService->sendCopilotSms($sender, $receiver, $message);
        return $result;
    }

    protected function skipTracing($user, $teamId, $propertyIds)
    {
        // Check Credit Ballance
        $role = $user['role'];
        $userId = $user['id'];
        $transactionType = config('services.credit_transaction_type.skip_tracing');
        $creditCount = $this->creditBalanceService->getRequiredCreditCount($transactionType, $propertyIds, null, null, $user);
        $balance = false;
        if ($creditCount === 0) {
            $balance = true;
        } else {
            if ($role === 'owner') {
                $balance = $this->creditBalanceService->checkBallance($userId, $creditCount);
            } else if ($role === 'admin' || $role === 'member') {
                $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
                $balance = $this->creditBalanceService->checkBallance($ownerUserId, $creditCount);
            }
        }

        if (!$balance) {
            return false;
        }

        $userId = $user['id'];
        // skip tracing
        $properties = [];
        foreach ($propertyIds as $propertyId) {
            $property = $this->propertyService->read($propertyId);
            if (!$property['skip_tracing_date']) {
                $properties []= $property;
            }
        }
        if (count($properties)) {
            $result = $this->skipTracingService->skipTracing($properties, $teamId, $userId);
            // Check Credit balance
            $freeSkipTracingCount = 0;
            $skipTracedCount = 0;
            $ownerUserId = null;
            $fetchedCount = $result['count'];
            if ($fetchedCount > 0) {
                $skipTracedCount = $this->creditBalanceService->getSkipTracedCount($teamId);
                $propertyCountToAdd = $fetchedCount;
                $referenceId = $userId;
                if ($user['role'] === 'owner') {
                    // $freeSkipTracingCount = $this->creditBalanceService->getFreeSkipTracingCount($user);
                } else {
                    $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
                }
                $freeSkipTracingCount = $this->creditBalanceService->getFreeSkipTracingCount($user);
                if ($freeSkipTracingCount >= $skipTracedCount) {
                    $propertyCountToAdd = $fetchedCount - ($freeSkipTracingCount - $skipTracedCount);
                }
                $creditCount = $this->creditBalanceService->getSkipTracingPrice($propertyCountToAdd, $user);
                if ($ownerUserId) {
                    $this->creditTransactionService->addTransactionByTransactionType(
                        $ownerUserId,
                        config('services.credit_transaction_type.skip_tracing'),
                        $creditCount,
                        $referenceId,
                        $userId,
                        'Skip Tracing'
                    );
                } else {
                    $this->creditTransactionService->addTransactionByTransactionType(
                        $userId,
                        config('services.credit_transaction_type.skip_tracing'),
                        $creditCount,
                        $referenceId,
                        $userId,
                        'Skip Tracing'
                    );
                }
            }
        }

        return true;
    }

    protected function createCampaign($user, $teamId, $propertyIds, $campaignId, $skipTracing = true)
    {
        $userId = $user['id'];
        if ($skipTracing) {
            $skipTracingResult = $this->skipTracing($user, $teamId, $propertyIds);
            if (!$skipTracingResult) {
                return 421;
            }
        }
        foreach ($propertyIds as $propertyId) {
            $propertyId = trim($propertyId, " \t\n\r");
            $propertyId = intval($propertyId);

            $this->smsCampaignPropertyService->create(
                array(
                    'sms_campaign_id'   => $campaignId,
                    'property_id'       => $propertyId
                )
            );

            //Register to SmsMasters Table
            $receivers = $this->propertyPhoneService->findAllByPropertyId($propertyId);
            foreach($receivers as $receiver) {
                if ($receiver['phone_number']) {
                    $phoneNumber = $receiver['phone_number'];
                    $phoneNumber = PhoneNumberHelper::format($phoneNumber);
                    $masters = $this->smsMasterService->findWhere(array(
                        'user_id'       => $userId,
                        'phone_number'  => $phoneNumber
                    ));
                    if (count($masters) === 0 ) {
                        $this->smsMasterService->create(array(
                            'user_id'       => $userId,
                            'phone_number'  => $phoneNumber
                        ));
                    }
                }
            }

            if (count($receivers)) {
                // update Property Status
                $this->propertyService->update(
                    $propertyId,
                    array('status' => 'Currently Marketing')
                );
            }
        }

        $campaignInfo = $this->baseService->read($campaignId, []);
        if ($campaignInfo) {
            $this->sendDirectMessage($campaignInfo['id']);
        }

        return $campaignInfo;
    }

    // Campaign Start
    public function start(SmsCampaignStartRequest $request)
    {
        $data = $request->validated();
        $skipTracing = Arr::get($data, 'skiptracing', false);
        $user = $request->user();
        $teamId = $this->getTeamId($user);

        $propertyIds = $request->get('property_ids');

        $sender = $user['twilio_messaging_service_id'];
        if (!$sender) {
            return $this->responseWithError(__('error.sms.phonenumber'));
        }

        $campaign = parent::add($request);
        $content = $campaign->getContent();
        $array = json_decode($content, true);
        $campaignId = $array['data']['id'];

        $campaignInfo = $this->createCampaign($user, $teamId, $propertyIds, $campaignId, $skipTracing);

        if ($campaignInfo === 421) {
            return response()->json([
                'status'            => 421,
                'message'           => __('error.credit.balance'),
            ], 421);
        }

        return $campaignInfo
            ? $this->responseWithSuccess($campaignInfo)
            : $this->responseWithError(__('error.sms.campaign.start.fail'));
    }

    public function bulkStart(SmsCampaignBulkStartRequest $request)
    {
        $user = $request->user();

        $sender = $user['twilio_messaging_service_id'];
        if (!$sender) {
            return $this->responseWithError(__('error.sms.phonenumber'));
        }

        $data = $request->validated();
        $skipTracing = Arr::get($data, 'skiptracing', false);
        $filter = $data['filter'];

        // get Properties
        $search = $filter['search'] ?? '';
        $folderId = $filter['folder_id'] ?? null;
        $drivingRouteId = $filter['driving_route_id'] ?? null;
        $lat = $filter['lat'] ?? null;
        $lon = $filter['lon'] ?? null;
        $status = $filter['status'] ?? null;
        $stateId = $filter['state_id'] ?? null;
        $teamId = $this->getTeamId($user);
        $skipTraced = $filter['skip_traced'] ?? null;
        $userId = $filter['user_id'] ?? null;
        $ownerOccupied = $filter['owner_occupied'] ?? null;

        $excludedPropertyIds = $data['excluded_property_ids'] ?? null;

        $properties = $this->propertyService->search(array(
            'search'                => $search,
            'userId'                => $userId,
            'team_id'               => $teamId,
            'folder_id'             => $folderId,
            'driving_route_id'      => $drivingRouteId,
            'status'                => $status,
            'state_id'              => $stateId,
            'lat'                   => $lat,
            'lon'                   => $lon,
            'skip_traced'           => $skipTraced,
            'owner_occupied'        => $ownerOccupied,
            'is_all'                => 1,
            'id_only'               => 1,
            'excluded_property_ids' => $excludedPropertyIds
        ));
        $propertyIds = [];
        foreach ($properties as $property) {
            $propertyIds []= $property['id'];
        }

        $campaign = parent::add($request);
        $content = $campaign->getContent();
        $array = json_decode($content, true);
        $campaignId = $array['data']['id'];

        $userId = $user['id'];
        $campaignInfo = $this->createCampaign($user, $teamId, $propertyIds, $campaignId, $skipTracing);

        if ($campaignInfo === 421) {
            return response()->json([
                'status'            => 421,
                'message'           => __('error.credit.balance'),
            ], 421);
        }

        return $campaignInfo
            ? $this->responseWithSuccess($campaignInfo)
            : $this->responseWithError(__('error.sms.campaign.start.fail'));
    }

    // Send SMS
    public function sendSms(SmsSendRequest $request)
    {
        $user = $request->user();

        $userId = $user['id'];

        $message = $request['message'];
        $sender = $user['twilio_messaging_service_id'];
        $receiver = $request['receiver'];
        // Check message send limit
        $messageLimit = 0;
        $phoneNumbers = $this->twilioService->getPurchasedPhoneNumbers($sender);
        if ($phoneNumbers) {
            $messageLimit = 50 * count($phoneNumbers);
        }
        $sentCount = $this->sentMessageCountService->getSentMessageCount($userId);
        if ($messageLimit <= $sentCount) {
            return response()->json([
                'message' => __('error.sms.send.limit')
            ], 423);
        }
        $this->sentMessageCountService->increaseSentMessageCount($userId);
        //
        $response = $this->sendMessage($sender, $receiver, $message);
        if (!$response) {
            return response()->json([
                'message' => __('error.sms.send.fail')
            ], 422);
        }

        $receiver = PhoneNumberHelper::format($receiver);

        $masters = $this->smsMasterService->findWhere(array(
            'phone_number' => $receiver,
            'user_id'      => $userId
        ));

        $detail = '';
        foreach($masters as $master) {
            $this->smsMasterService->update($master['id'], array('latest_message' => $message));
            $detail = $this->smsDetailService->create(array(
                'sender'        => $sender,
                'receiver'      => $receiver,
                'message'       => $message,
                'sms_master_id' => $master['id']
            ));
        }

        return $detail
            ? $this->responseWithSuccess($detail)
            : $this->responseWithError(__('error.sms.send.fail'));
    }

    // Cancel Campaign
    public function cancelCampaign(SmsCampaignCancelRequest $request, $campaignId)
    {
        $user = $request->user();
        $campaigns = $this->baseService->findWhere(
            array(
                'id'        => $campaignId,
                'user_id'   => $user['id'],
                'finished'  => 0
            )
        );

        if (count($campaigns) === 0) {
            return $this->responseWithError('Can not find the campaign to cancel', 404);
        }

        $result = $this->baseService->update($campaignId, array(
            'finished'  => 2
        ));

        $result = $this->baseService->read($campaignId);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.sms.campaign.cancel.fail'));
    }

    public function getSmsMaster(DefaultReadRequest $request, $id)
    {
        $data = $this->smsMasterService->read($id);
        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.read.fail'));
    }

    public function getMessageBox(GetSmsMessageBoxRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'updated_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';

        $result = $this->smsMasterService->search(array(
            'per_page'  =>  $pageSize,
            'order_by'  =>  $orderBy,
            'order'     =>  $order,
            'search'    =>  $search,
            'user_id'   =>  $user['id'],
            'page'      =>  $page
        ));

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.sms.messagebox.fail'));
    }

    public function getMessagesByMasterId(GetSmsMessagesRequest $request, $masterId, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';

        $result = $this->smsDetailService->search(array(
            'per_page'              =>  $pageSize,
            'order_by'              =>  $orderBy,
            'order'                 =>  $order,
            'search'                =>  $search,
            'sms_master_id'         =>  $masterId,
            'messaging_service_id'  => $user['twilio_messaging_service_id'],
            'page'                  =>  $page
        ));

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.sms.messages.fail'));
    }

    public function setMessagesRead(SetSmsMessagesReadRequest $request, $masterId)
    {
        $result = $this->smsMasterService->resetBadge($masterId);
        if (!$result) {
            $this->responseWithError(__('error.sms.reset.badge.fail'), 423);
        }

        $details = $this->smsDetailService->findWhere(array(
            'sms_master_id' => $masterId
        ));
        foreach($details as $detail) {
            $result = $this->smsDetailService->update($detail['id'], array('is_unread' => 0));
        }

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.sms.reset.badge.fail'));
    }

    public function getTotalBadge(Request $request)
    {
        $user = $request->user();
        $userId = $user['id'];

        $result = $this->smsMasterService->getTotalBadge($userId);

        return $this->responseWithSuccess(array('badge' => $result));
    }

    public function deleteSmsMaster(DefaultDeleteRequest $request, $id)
    {
        $data = $this->smsMasterService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }

    protected function sendDirectMessage($campaignId)
    {
        $this->baseService->proceedCampaign($campaignId, 0);
    }
}
