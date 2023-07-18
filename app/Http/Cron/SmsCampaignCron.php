<?php

namespace App\Http\Cron;

use App\Http\Helpers\PhoneNumberHelper;

use App\Models\SmsCampaign;
use App\Repositories\SmsCampaignRepository;
use App\Services\SmsCampaignService;

use App\Models\SmsCampaignTemplateDetail;
use App\Repositories\SmsCampaignTemplateDetailRepository;
use App\Services\SmsCampaignTemplateDetailService;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\UserService;
use App\Services\TwilioService;
use App\Models\SmsCampaignProperty;
use App\Repositories\SmsCampaignPropertyRepository;
use App\Services\SmsCampaignPropertyService;
use App\Models\PropertyPhone;
use App\Repositories\PropertyPhoneRepository;
use App\Services\PropertyPhoneService;
use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Services\PropertyService;
use App\Models\SmsMaster;
use App\Repositories\SmsMasterRepository;
use App\Services\SmsMasterService;
use App\Models\SmsDetail;
use App\Repositories\SmsDetailRepository;
use App\Services\SmsDetailService;
use App\Models\PropertyHistory;
use App\Repositories\PropertyHistoryRepository;
use App\Services\PropertyHistoryService;
use App\Models\Team;
use App\Repositories\TeamRepository;
use App\Services\TeamService;
use App\Models\AddOn;
use App\Models\AutoRechargeSetting;
use App\Models\CreditBallance;
use App\Models\CreditPackage;
use App\Models\CreditTransaction;
use App\Models\CreditTransactionType;
use App\Repositories\AddOnRepository;
use App\Services\AddOnService;
use App\Models\SmsMessageReceivedPhoneNumber;
use App\Models\TeamInvitation;
use App\Models\TeamUser;
use App\Repositories\AutoRechargeSettingRepository;
use App\Repositories\CreditBallanceRepository;
use App\Repositories\CreditPackageRepository;
use App\Repositories\CreditTransactionRepository;
use App\Repositories\CreditTransactionTypeRepository;
use App\Repositories\SmsMessageReceivedPhoneNumberRepository;
use App\Repositories\TeamInvitationRepository;
use App\Repositories\TeamUserRepository;
use App\Services\AutoRechargeSettingService;
use App\Services\CreditBallanceService;
use App\Services\CreditPackageService;
use App\Services\CreditTransactionService;
use App\Services\SmsMessageReceivedPhoneNumberService;
use App\Services\StripeService;
use App\Services\TeamUserService;

class SmsCampaignCron
{
    protected $smsCampaign;
    protected $smsCampaignService;

    public function __construct()
    {
        $smsCampaignTemplateDetail = new SmsCampaignTemplateDetail;
        $smsCampaignTemplateDetailRepository = new SmsCampaignTemplateDetailRepository($smsCampaignTemplateDetail);
        $smsCampaignTemplateDetailService = new SmsCampaignTemplateDetailService($smsCampaignTemplateDetailRepository);

        $team = new Team;
        $teamRepository = new TeamRepository($team);
        $teamService = new TeamService($teamRepository);

        $addOn = new AddOn;
        $addOnRepository = new AddOnRepository($addOn);
        $addOnService = new AddOnService($addOnRepository);

        $user = new User;
        $userRepository = new UserRepository($user);
        $twilioService = new TwilioService($userRepository);

        $smsCampaignProperty = new SmsCampaignProperty;
        $smsCampaignProperty = $smsCampaignProperty;
        $smsCampaignPropertyRepository = new SmsCampaignPropertyRepository($smsCampaignProperty);
        $smsCampaignPropertyService = new SmsCampaignPropertyService($smsCampaignPropertyRepository);

        $propertyPhone = new PropertyPhone;
        $propertyPhoneRepository = new PropertyPhoneRepository($propertyPhone);
        $propertyPhoneService = new PropertyPhoneService($propertyPhoneRepository);

        $property = new Property;
        $propertyRepository = new PropertyRepository($property);
        $propertyService = new PropertyService($propertyRepository);

        $smsMaster = new SmsMaster;
        $smsMasterRepository = new SmsMasterRepository($smsMaster);
        $smsMasterService = new SmsMasterService($smsMasterRepository);

        $smsDetail = new SmsDetail;
        $smsDetailRepository = new SmsDetailRepository($smsDetail);
        $smsDetailService = new SmsDetailService($smsDetailRepository);

        $propertyHistory = new PropertyHistory;
        $propertyHistoryRepository = new PropertyHistoryRepository($propertyHistory);
        $propertyHistoryService = new PropertyHistoryService($propertyHistoryRepository);

        $smsMessageReceivedPhoneNumber = new SmsMessageReceivedPhoneNumber;
        $smsMessageReceivedPhoneNumberRepository = new SmsMessageReceivedPhoneNumberRepository($smsMessageReceivedPhoneNumber);
        $smsMessageReceivedPhoneNumberService = new SmsMessageReceivedPhoneNumberService($smsMessageReceivedPhoneNumberRepository);

        $this->smsCampaign = new SmsCampaign;
        $smsCampaign = $this->smsCampaign;
        $smsCampaignRepository = new SmsCampaignRepository($smsCampaign);

        $teamUser = new TeamUser;
        $teamUserRepository = new TeamUserRepository($teamUser);
        $teamInvitation = new TeamInvitation;
        $teamInvitationRepository = new TeamInvitationRepository($teamInvitation);
        $teamUserService = new TeamUserService($teamUserRepository, $twilioService, $teamInvitationRepository);
        $userService = new UserService(
            $userRepository,
            $twilioService,
            $teamService,
            $addOnService,
            $teamUserService
        );
        $stripeService = new StripeService($teamUserService, $userService);

        $creditTransaction = new CreditTransaction;
        $creditTransactionRepository = new CreditTransactionRepository($creditTransaction);
        $creditBallance = new CreditBallance;
        $creditBallanceRepository = new CreditBallanceRepository($creditBallance);

        $creditTransactionType = new CreditTransactionType;
        $creditTransactionTypeRepository = new CreditTransactionTypeRepository($creditTransactionType);

        $creditBalanceService = new CreditBallanceService(
            $creditBallanceRepository,
            $creditTransactionTypeRepository,
            $propertyPhoneService,
            $propertyService,
            $teamService,
            $stripeService,
            $propertyHistoryService,
            $teamUserService,
            $userService
        );

        $autoRechargeSetting = new AutoRechargeSetting;
        $autoRechargeSettingRepository = new AutoRechargeSettingRepository($autoRechargeSetting);
        $autoRechargeSettingService = new AutoRechargeSettingService($autoRechargeSettingRepository);

        $creditPackage = new CreditPackage;
        $creditPackageRepository = new CreditPackageRepository($creditPackage);
        $creditPackageService = new CreditPackageService($creditPackageRepository);

        $creditTransactionService = new CreditTransactionService(
            $creditTransactionRepository,
            $creditBallanceRepository,
            $userService,
            $teamService,
            $autoRechargeSettingService,
            $stripeService,
            $creditPackageService
        );

        $this->smsCampaignService = new SmsCampaignService(
            $smsCampaignRepository,
            $smsCampaignTemplateDetailService,
            $userService,
            $smsMasterService,
            $smsCampaignPropertyService,
            $propertyPhoneService,
            $propertyService,
            $smsDetailService,
            $propertyHistoryService,
            $twilioService,
            $smsMessageReceivedPhoneNumberService,
            $stripeService,
            $teamUserService,
            $creditTransactionService,
            $creditBalanceService
        );
    }

    public function __invoke()
    {
        $page = 1;
        $perPage = 100;
        do {
            $campaigns = $this->smsCampaign->where('finished', 0)
                ->whereDate('start_date', '<=', date('Y-m-d') . ' 00:00:00')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            foreach ($campaigns as $campaign) {
                // Get Campaign Template
                $currentDay = $campaign['current_day'];
                $campaignId = $campaign['id'];
                $this->smsCampaignService->proceedCampaign($campaignId, $currentDay);
            }
            echo "SMS campaigns sent = " . count($campaigns);
            $page ++;
        } while(count($campaigns));
    }
}
