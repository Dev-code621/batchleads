<?php
namespace App\Http\Controllers;

use App\Http\Helpers\PhoneNumberHelper;
use Illuminate\Http\Request;
use App\Services\TwilioService;
use App\Services\UserService;
use App\Services\SmsMasterService;
use App\Services\SmsDetailService;
use App\Services\OneSignalService;
use App\Services\TeamUserService;
use App\Services\StripeService;
use App\Services\CreditTransactionService;
use App\Services\PropertyPhoneService;
use App\Services\PropertyService;
use App\Services\SmsMessageReceivedPhoneNumberService;
use App\Services\SmsCampaignService;
use App\Http\Requests\SearchAvailablePhoneNumbersRequest;
use App\Http\Requests\CreateIncomingPhoneNumberRequest;
use App\Http\Requests\AddPhoneNumberToServiceRequest;
use App\Http\Requests\TwilioCopilotSmsSendRequest;
use App\Http\Requests\TwilioSmsSendRequest;
use App\Http\Requests\PurchasePhoneNumberRequest;
use App\Http\Requests\ReleasePhoneNumberRequest;
use Twilio\TwiML\MessagingResponse;

/**
 * Class TwilioController
 *
 * @package App\Http\Controllers
 */
class TwilioController
{
    protected $twilioService;
    protected $userService;
    protected $smsMasterService;
    protected $smsDetailService;
    protected $oneSignalService;
    protected $teamUserService;
    protected $stripeService;
    protected $creditTransactionService;
    protected $propertyPhoneService;
    protected $propertyService;
    protected $smsMessageReceivedPhoneNumberService;
    protected $smsCampaignService;

    /**
     * TwilioController constructor.
     *
     * @param TwilioService $twilioService
     */
    public function __construct(
        TwilioService $twilioService,
        UserService $userService,
        SmsMasterService $smsMasterService,
        SmsDetailService $smsDetailService,
        OneSignalService $oneSignalService,
        TeamUserService $teamUserService,
        StripeService $stripeService,
        CreditTransactionService $creditTransactionService,
        PropertyPhoneService $propertyPhoneService,
        PropertyService $propertyService,
        SmsMessageReceivedPhoneNumberService $smsMessageReceivedPhoneNumberService,
        SmsCampaignService $smsCampaignService
    )
    {
        $this->twilioService = $twilioService;
        $this->userService = $userService;
        $this->smsMasterService = $smsMasterService;
        $this->smsDetailService = $smsDetailService;
        $this->oneSignalService = $oneSignalService;
        $this->teamUserService = $teamUserService;
        $this->stripeService = $stripeService;
        $this->creditTransactionService = $creditTransactionService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyService = $propertyService;
        $this->smsMessageReceivedPhoneNumberService = $smsMessageReceivedPhoneNumberService;
        $this->smsCampaignService = $smsCampaignService;
    }

    public function createMessagingService(Request $request)
    {
        $user = $request->user();

        $messagingServiceName = $user->email;

        $messagingServiceId = $this->twilioService->createMessagingService($messagingServiceName);

        if ($messagingServiceId) {
            $data['user_id'] = $user->id;
            $data['twilio_messaging_service_id'] = $messagingServiceId;
            $result = $this->userService->updateUserInfo($data);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.twilio.user.update.fail'));
        }

        return $this->responseWithError(__('error.twilio.messagingservice.create.fail'));
    }

    public function searchAvailablePhoneNumbers(SearchAvailablePhoneNumbersRequest $request)
    {
        $data = $request->validated();
        $count = $data['count'] ?? 1;
        $areaCode = $data['area_code'] ?? null;
        $result = $this->twilioService->searchAvailablePhoneNumbers($count, $areaCode);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.twilio.phonenumber.search.fail'));
    }

    public function createIncomingPhoneNumber(CreateIncomingPhoneNumberRequest $request)
    {
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];
        $result = $this->twilioService->createIncomingPhoneNumberResource($phoneNumber);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.twilio.phonenumber.incoming.create.fail'));
    }

    public function addPhoneNumberToService(AddPhoneNumberToServiceRequest $request)
    {
        $data = $request->validated();
        $phoneNumberSid = $data['phone_number_sid'];
        $user = $request->user();

        if ($user->twilio_messaging_service_id) {
            $messagingServiceId = $user->twilio_messaging_service_id;
            $result = $this->twilioService->addPhoneNumberToService($messagingServiceId, $phoneNumberSid);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.twilio.phonenumber.add.fail'));
        }

        return $this->responseWithError(__('error.twilio.messagingservice.create.needed'), 423);
    }

    public function sendCopilotSms(TwilioCopilotSmsSendRequest $request)
    {
        $user = $request->user();

        if ($user->twilio_messaging_service_id) {
            $messagingServiceId = $user->twilio_messaging_service_id;
            $data = $request->validated();
            $receiver = $data['receiver'];
            $message = $data['message'];

            $result = $this->twilioService->sendCopilotSms($messagingServiceId, $receiver, $message);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.twilio.sms.send.fail'));
        }

        return $this->responseWithError(__('error.twilio.messagingservice.create.needed'), 423);
    }

    public function sendSms(TwilioSmsSendRequest $request)
    {
        $user = $request->user();

        if ($user->twilio_messaging_service_id) {
            $data = $request->validated();
            $sender = $data['sender'];
            $receiver = $data['receiver'];
            $message = $data['message'];

            $result = $this->twilioService->sendSms($sender, $receiver, $message);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.twilio.sms.send.fail'));
        }

        return $this->responseWithError(__('error.twilio.messagingservice.create.needed'), 423);
    }

    // Receive SMS webhook
    public function receive(Request $request)
    {
        $sender = $request->get('From');
        $receiver = $request->get('MessagingServiceSid');
        $message = $request->get('Body');

        $user = $this->userService->findUserByMessagingServiceId($receiver);

        if ($user) {
            $userId = $user['id'];
            $masters = $this->smsMasterService->findWhere(array(
                'phone_number' => $sender,
                'user_id'      => $userId
            ));
            if (!count($masters)) {
                $this->smsMasterService->create(
                    array(
                        'phone_number'      => $sender,
                        'user_id'           => $userId,
                        'badge_number'      => 0
                    )
                );
                $masters = $this->smsMasterService->findWhere(array(
                    'phone_number' => $sender,
                    'user_id'      => $userId
                ));
            }
            foreach($masters as $master) {
                $this->smsMasterService->update($master['id'], array('latest_message' => $message));
                $this->smsMasterService->increaseBadge($master['id']);
                $smsDetail = $this->smsDetailService->create(array(
                    'sender'        => $sender,
                    'receiver'      => $receiver,
                    'message'       => $message,
                    'sms_master_id' => $master['id']
                ));
                $this->oneSignalService->sendSmsNotification(
                    array(
                        'title'                         => $sender,
                        'message'                       => $message,
                        'twilio_messaging_service_id'   => $receiver,
                        'master_id'                     => $master['id'],
                        'sms_detail'                    => $smsDetail,
                    )
                );
            }

            $this->addMessageReceiveTransaction($user, $receiver);

            $campaigns = $this->smsCampaignService->getCampaignsByPhoneNumberAndUserId(PhoneNumberHelper::formatToSimple($sender), $userId);
            foreach ($campaigns as $campaign) {
                $this->smsMessageReceivedPhoneNumberService->create(
                    array(
                        'sms_campaign_id'   => $campaign['id'],
                        'phone_number'      => PhoneNumberHelper::formatToSimple($sender)
                    )
                );
            }
        }

        $response = new MessagingResponse();
        // $response->message("Message Received and Notification Sent");
        return $response;
    }

    public function purchasePhoneNumber(PurchasePhoneNumberRequest $request)
    {
        $user = $request->user();
        $messagingServiceId = $user->twilio_messaging_service_id;
        if (!$messagingServiceId) { // if not registered messaging service ID
            $messagingServiceName = $user->email;
            $messagingServiceId = $this->twilioService->createMessagingService($messagingServiceName);

            if ($messagingServiceId) {
                $data['user_id'] = $user->id;
                $data['twilio_messaging_service_id'] = $messagingServiceId;
                $result = $this->userService->updateUserInfo($data);

                if (!$result) {
                    return $this->responseWithError(__('error.twilio.user.update.fail'), 423);
                }
            } else {
                return $this->responseWithError(__('error.twilio.messagingservice.create.fail'), 424);
            }
        }

        // Create Incoming PhoneNumber
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];
        $phoneNumberSid = $this->twilioService->createIncomingPhoneNumberResource($phoneNumber);

        if (!$phoneNumberSid) {
            return $this->responseWithError(__('error.twilio.phonenumber.incoming.create.fail'), 425);
        }

        // Add PhoneNumber to MessagingService
        $result = $this->twilioService->addPhoneNumberToService($messagingServiceId, $phoneNumberSid);

        return $result
            ? $this->responseWithSuccess($messagingServiceId)
            : $this->responseWithError(__('error.twilio.phonenumber.add.fail'));
    }

    public function getPurchasedPhoneNumbers(Request $request)
    {
        $user = $request->user();
        $messagingServiceId = $user['twilio_messaging_service_id'];

        if ($messagingServiceId) {
            $result = [];
            $numbers = $this->twilioService->getPurchasedPhoneNumbers($messagingServiceId);
            if ($numbers) {
                foreach ($numbers as $number) {
                    $result []= $number['phone_number'];
                }
            }

            return count($result)
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.twilio.phonenumber.list.fail'), 404);
        }

        return $this->responseWithError(__('error.twilio.phonenumber.list.fail'));
    }

    public function releasePhoneNumber(ReleasePhoneNumberRequest $request)
    {
        $user = $request->user();
        $messagingServiceId = $user['twilio_messaging_service_id'];
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];

        if ($messagingServiceId) {
            $phoneNumbers = $this->twilioService->getPurchasedPhoneNumbers($messagingServiceId);
            if ($phoneNumbers) {
                foreach ($phoneNumbers as $number) {
                    if ($number['phone_number'] === '+' . $phoneNumber) {
                        $sid = $number['sid'];
                        $this->twilioService->deletePhoneNumber($messagingServiceId, $sid);
                    }
                }
            }
        }

        return $this->responseWithError(__('error.twilio.phonenumber.list.fail'));
    }

    public function responseWithError($message="fail", $status=422)
    {
        return response()->json([
            'status'  => $status,
            'message' => $message,
        ], $status);
    }

    public function responseWithSuccess($data, $message="success", $status=200)
    {
        $response = array(
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        );

        return response()->json($response, 200);
    }

    protected function addMessageReceiveTransaction($user, $receiver)
    {
        $role = $user['role'];
        $userId = $user['id'];
        $ownerUserId = null;
        $price = 2;
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
        if (
            $subscribedPlanName === config('services.plans.premium.name')
            || $subscribedPlanName === config('services.plans.premium_new.name')
            || $subscribedPlanName === config('services.plans.premium_yearly.name')
        ) {
            $price = 1;
        }

        if ($role === 'owner') {
        } else if ($role === 'admin' || $role === 'member') {
            $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
        }

        $transactionType = config('services.credit_transaction_type.send_sms');
        if ($ownerUserId) {
            $this->creditTransactionService->addTransactionByTransactionType($ownerUserId, $transactionType, $price, $receiver, $userId, 'Receive SMS');
        } else {
            $this->creditTransactionService->addTransactionByTransactionType($userId, $transactionType, $price, $receiver, $userId, 'Receive SMS');
        }
    }
}
