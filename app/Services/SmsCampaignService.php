<?php

namespace App\Services;

use Carbon\Carbon;
use GuzzleHttp\Client;
use App\Repositories\SmsCampaignRepository;
use App\Http\Helpers\PhoneNumberHelper;
use App\Mail\InsufficientCredits;
use App\Models\ZapierSubscribe;
use Mail;

/**
 * Class SmsCampaignService
 *
 * @package App\Http\Services
 */
class SmsCampaignService extends BaseService
{
    protected $repository;
    protected $smsCampaignTemplateDetailService;
    protected $userService;
    protected $smsMasterService;
    protected $smsCampaignPropertyService;
    protected $propertyPhoneService;
    protected $propertyService;
    protected $smsDetailService;
    protected $propertyHistoryService;
    protected $twilioService;
    protected $smsMessageReceivedPhoneNumberService;
    protected $stripeService;
    protected $teamUserService;
    protected $creditTransactionService;
    protected $creditBalanceService;

    /**
     * SmsCampaignService constructor.
     *
     * @param repository
     */
    public function __construct(
        SmsCampaignRepository $repository,
        SmsCampaignTemplateDetailService $smsCampaignTemplateDetailService,
        UserService $userService,
        SmsMasterService $smsMasterService,
        SmsCampaignPropertyService $smsCampaignPropertyService,
        PropertyPhoneService $propertyPhoneService,
        PropertyService $propertyService,
        SmsDetailService $smsDetailService,
        PropertyHistoryService $propertyHistoryService,
        TwilioService $twilioService,
        SmsMessageReceivedPhoneNumberService $smsMessageReceivedPhoneNumberService,
        StripeService $stripeService,
        TeamUserService $teamUserService,
        CreditTransactionService $creditTransactionService,
        CreditBallanceService $creditBalanceService
    )
    {
        $this->repository = $repository;
        $this->smsCampaignTemplateDetailService = $smsCampaignTemplateDetailService;
        $this->userService = $userService;
        $this->smsMasterService = $smsMasterService;
        $this->smsCampaignPropertyService = $smsCampaignPropertyService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyService = $propertyService;
        $this->smsDetailService = $smsDetailService;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->twilioService = $twilioService;
        $this->smsMessageReceivedPhoneNumberService = $smsMessageReceivedPhoneNumberService;
        $this->stripeService = $stripeService;
        $this->teamUserService = $teamUserService;
        $this->creditTransactionService = $creditTransactionService;
        $this->creditBalanceService = $creditBalanceService;
    }

    public function read($id, array $relationships = array('smsCampaignProperties'))
    {
        return $this->repository->find($id, $relationships);
    }

    public function getCampaigns(array $params)
    {
        $campaigns = $this->repository->getCampaigns($params);
        return $campaigns;
    }

    public function getCampaignsByTemplateMasterId($templateId)
    {
        return $this->repository->getCampaignsByTemplateMasterId($templateId);
    }

    public function findNotCancelledCountByPropertyId($propertyId)
    {
        return $this->repository->findNotCancelledCountByPropertyId($propertyId);
    }

    public function getCampaignsByPhoneNumberAndUserId($phoneNumber, $userId)
    {
        return $this->repository->getCampaignsByPhoneNumberAndUserId($phoneNumber, $userId);
    }

    public function proceedCampaign($campaignId, $currentDay)
    {
        $balance = false;
        $sentMessageCount = 0;
        $campaign = $this->read($campaignId);
        $templateMasterId = $campaign['sms_campaign_template_master_id'];
        $detail = $this->smsCampaignTemplateDetailService->getCampaignTemplateDetail(array(
            'day' => $currentDay,
            'template_master_id' => $templateMasterId
        ));
        $userId = $campaign['user_id'];
        $user = $this->userService->findUserById($userId);
        $balance = $this->checkCredits($user, $campaign);
        $sender = $user['twilio_messaging_service_id'];
        if (count($detail) > 0 && $sender && $balance) {
            // Get Receivers
            $propertyIds = $this->smsCampaignPropertyService->findAllByCampaignId($campaign['id']);

            foreach ($propertyIds as $propertyId) {
                $contactedAlready = false;
                $propertyId_ = $propertyId['property_id'];
                $receivers = $this->propertyPhoneService->findAllByPropertyId($propertyId_);
                if(count($receivers) > 0) {
                    // Get property
                    $property = $this->propertyService->read($propertyId_);
                    if ($property) {
                        // Get Message To Send
                        $sendMessage = $detail[0]['content'];
                        $owner = $property['Owner1FirstName'] . ' ' . $property['Owner1LastName'];
                        $ownerFirstName = $property['Owner1FirstName'] ?? $property['Owner1LastName'];
                        $propertyAddress = $property['address1'];
                        $myName = $user['name'];
                        $sendMessage = str_ireplace('%Owner Name%', $owner, $sendMessage);
                        $sendMessage = str_ireplace('%First Name%', $ownerFirstName, $sendMessage);
                        $sendMessage = str_ireplace('%My Name%', $myName, $sendMessage);
                        $sendMessage = str_ireplace('%Property Address%', $propertyAddress, $sendMessage);

                        // Send Message to receivers
                        foreach ($receivers as $receiver) {
                            if ($receiver['phone_number']) {
                                $phoneNumber = $receiver['phone_number'];
                                $count = 0;
                                if ($currentDay) {
                                    $count = $this->smsMessageReceivedPhoneNumberService->findWhereCount(
                                        array(
                                            'phone_number'      => $phoneNumber,
                                            'sms_campaign_id'   => $campaignId
                                        )
                                    );
                                }
                                if (!$count) {
                                    $response = $this->sendMessage($sender, $phoneNumber, $sendMessage);
                                    if ($response) {
                                        $sentMessageCount++;
                                        $phoneNumber = PhoneNumberHelper::format($phoneNumber);
                                        $masters = $this->smsMasterService->findWhere(array(
                                            'phone_number'  => $phoneNumber,
                                            'user_id'       => $userId
                                        ));
                                        if (!count($masters)) {
                                            $this->smsMasterService->create(
                                                array(
                                                    'phone_number'      => $phoneNumber,
                                                    'user_id'           => $userId,
                                                    'badge_number'      => 0
                                                )
                                            );
                                            $masters = $this->smsMasterService->findWhere(array(
                                                'phone_number' => $phoneNumber,
                                                'user_id'      => $userId
                                            ));
                                        }
                                        foreach ($masters as $master) {
                                            $this->smsMasterService->update($master['id'], array('latest_message' => $sendMessage));
                                            $this->smsDetailService->create(array(
                                                'sender'        => $sender,
                                                'receiver'      => $phoneNumber,
                                                'message'       => $sendMessage,
                                                'sms_master_id' => $master['id'],
                                                'is_unread'     => 0
                                            ));
                                        }
                                        if (!$contactedAlready) {
                                            $data = array(
                                                'user_id'       => $userId,
                                                'description'   => 'sent sms.',
                                                'type'          => 'sms',
                                                'property_id'   => $propertyId_
                                            );
                                            $this->propertyHistoryService->create($data);
                                        }
                                        $contactedAlready = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if ($balance) {
            // Update Campaign current day
            $this->update($campaign['id'], array(
                'current_day' => $currentDay + 1
            ));
            // Set Campaign Finished if no further day
            $detail = $this->smsCampaignTemplateDetailService->checkFurtherDay(array(
                'day' => $currentDay + 1,
                'template_master_id' => $templateMasterId
            ));
            if (!$detail) {
                $this->update($campaign['id'], array(
                    'finished' => 1
                ));

                $this->zapierTrigger($campaign, 'Finished');
            }
        }

        // Add Transaction
        if ($sentMessageCount) {
            $this->addTransaction($campaign['user_id'], $campaign['id'], $sentMessageCount);
        }
    }

    protected function sendMessage($sender, $receiver, $message)
    {
        $result = $this->twilioService->sendCopilotSms($sender, $receiver, $message);
        return $result;
    }

    protected function addTransaction($userId, $campaignId, $count)
    {
        if ($count) {
            $user = $this->userService->findUserById($userId);
            $role = $user['role'];
            $userId = $user['id'];
            $ownerUserId = null;

            $prices = array(
                config('services.plans.basic.name')             => 2,
                config('services.plans.basic_new.name')         => 2,
                config('services.plans.basic_yearly.name')      => 2,
                config('services.plans.standard.name')          => 2,
                config('services.plans.standard_yearly.name')   => 2,
                config('services.plans.standard_new.name')      => 2,
                config('services.plans.premium.name')           => 1,
                config('services.plans.premium_new.name')       => 1,
                config('services.plans.premium_yearly.name')    => 1
            );
            $price = 2;
            $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
            if ($subscribedPlanName) {
                $price = $prices[$subscribedPlanName];
            }

            if ($role === 'owner') {
            } else if ($role === 'admin' || $role === 'member') {
                $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
            }

            $transactionType = config('services.credit_transaction_type.send_sms');
            if ($ownerUserId) {
                $this->creditTransactionService->addTransactionByTransactionType($ownerUserId, $transactionType, $price * $count, $campaignId, $userId, 'SMS Campaign Sent');
            } else {
                $this->creditTransactionService->addTransactionByTransactionType($userId, $transactionType, $price * $count, $campaignId, $userId, 'SMS Campaign Sent');
            }
        }
    }

    protected function checkCredits($user, $campaign)
    {
        $transactionType = config('services.credit_transaction_type.send_sms');
        $userId = $user['id'];
        $role = $user['role'];

        $propertyIds = [];
        $properties = $this->smsCampaignPropertyService->findAllByCampaignId($campaign['id']);
        foreach ($properties as $property) {
            $propertyIds []= $property['property_id'];
        }
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
            $this->update($campaign['id'], array(
                'finished'  => 2
            ));

            $this->zapierTrigger($campaign, 'Cancelled');

            Mail::to($user->email)->send(new InsufficientCredits($user, 'SMS Campaign', $creditCount));
        }

        return $balance;
    }

    protected function zapierTrigger($campaign, $reason)
    {
        $subscribes = ZapierSubscribe::where('user_id', $campaign['user_id']);
        $subscribes = $subscribes->where('type', 'sms_campaign_finished')->get();
        $data = array(
            'start_date'        => $campaign['start_date'],
            'end_date'          => Carbon::now()->toDateTimeString(),
            'reason'            => $reason,
            'campaign_name'     => $campaign['title'],
            'total_properties'  => $campaign['property_count']
        );
        $client = new Client();
        $headers = [
            'Content-Type'  => 'application/json'
        ];
        foreach ($subscribes as $subscribe) {
            try {
                $client->request('POST', $subscribe['hookUrl'], [
                    'headers'   => $headers,
                    'json'      => $data
                ]);
            } catch (\Exception $ex) {
            }
        }
    }
}
