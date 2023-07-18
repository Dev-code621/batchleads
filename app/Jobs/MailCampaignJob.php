<?php

namespace App\Jobs;

use App\Models\AddOn;
use App\Models\AutoRechargeSetting;
use App\Models\CreditBallance;
use App\Models\CreditPackage;
use App\Models\CreditTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

use Carbon\Carbon;
use GuzzleHttp\Client;

use App\Models\MailCampaign;
use App\Repositories\MailCampaignRepository;
use App\Services\MailCampaignService;

use App\Models\MailCampaignProperty;
use App\Repositories\MailCampaignPropertyRepository;
use App\Services\MailCampaignPropertyService;

use App\Models\MailTemplate;
use App\Repositories\MailTemplateRepository;
use App\Services\MailTemplateService;

use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Services\PropertyService;

use App\Models\PropertyHistory;
use App\Repositories\PropertyHistoryRepository;
use App\Services\PropertyHistoryService;

use App\Models\PropertyImage;
use App\Repositories\PropertyImageRepository;
use App\Services\PropertyImageService;

use App\Models\MailCampaignRepeat;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\TeamUser;
use App\Models\User;
use App\Repositories\AddOnRepository;
use App\Repositories\AutoRechargeSettingRepository;
use App\Repositories\CreditBallanceRepository;
use App\Repositories\CreditPackageRepository;
use App\Repositories\CreditTransactionRepository;
use App\Repositories\MailCampaignRepeatRepository;
use App\Repositories\TeamInvitationRepository;
use App\Repositories\TeamRepository;
use App\Repositories\TeamUserRepository;
use App\Repositories\UserRepository;
use App\Services\AddOnService;
use App\Services\AutoRechargeSettingService;
use App\Services\CreditPackageService;
use App\Services\CreditTransactionService;
use App\Services\MailCampaignRepeatService;

use App\Services\LobService;

use App\Services\StripeService;
use App\Services\TeamService;
use App\Services\TeamUserService;
use App\Services\TwilioService;
use App\Services\UserService;

use App\Mail\InsufficientCredits;
use App\Models\CreditTransactionType;
use App\Models\PropertyPhone;
use App\Repositories\CreditTransactionTypeRepository;
use App\Repositories\PropertyPhoneRepository;
use App\Services\CreditBallanceService;
use App\Services\PropertyPhoneService;
use App\Models\ZapierSubscribe;
use Mail;
use Log;

class MailCampaignJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->initializeVariables();
        $page = 1;
        $perPage = 100;
        do {
            $campaigns = MailCampaign::where('finished', 0)
                ->whereDate('send_date', '<=', date('Y-m-d') . ' 00:00:00')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            $this->startCampaigns($campaigns);
            echo "Mail campaigns sent = " . count($campaigns);
            echo PHP_EOL;
            $page++;
        } while (count($campaigns));

        $page = 1;
        $perPage = 100;

        do {
            $repeatCampaigns = MailCampaignRepeat::where('finished', 0)
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            $campaigns = [];
            foreach ($repeatCampaigns as $repeatCampaign) {
                $repeatEvery = intval($repeatCampaign['repeat_every']);
                $mailCampaign = $repeatCampaign['mailCampaign'];
                $currentRepeat = intval($repeatCampaign['current_repeat']);
                $totalMailers = intval($repeatCampaign['total_mailers']);
                $createdAt = $repeatCampaign['created_at'];
                $day = Carbon::parse($createdAt)->diffInDays(Carbon::now());

                Log::info('Repeat Campaign Id = ' . $repeatCampaign['id']);
                if ($day >= $repeatEvery &&
                    $day % $repeatEvery === 0 &&
                    $day !== 0 &&
                    $mailCampaign['finished'] === 3
                ) {
                    Log::info('Repeat Every = ' . $repeatEvery);
                    Log::info('Current Repeat = ' . $currentRepeat);
                    Log::info('Total Mailers = ' . $totalMailers);
                    Log::info('Created At = ' . $createdAt);
                    Log::info('Diff Days = ' . $day);
                    $campaigns []= $mailCampaign;
                    $finished = 0;
                    if ($currentRepeat + 1 >= $totalMailers) {
                        $finished = 1;
                    }
                    $this->mailCampaignRepeatService->update(
                        $repeatCampaign->id,
                        array(
                            'current_repeat'    => $currentRepeat + 1,
                            'finished'          => $finished
                        )
                    );
                }
            }

            $this->startCampaigns($campaigns, true);
            echo "Repeat Mail campaigns sent = " . count($campaigns);
            echo PHP_EOL;
            $page++;
        } while (count($repeatCampaigns));
    }

    protected function startCampaigns($campaigns, $isRepeat = false) {
        $prices = array(
            'send_mail' => array(
                config('services.plans.basic.name')             => 16,
                config('services.plans.basic_new.name')         => 16,
                config('services.plans.basic_yearly.name')      => 16,
                config('services.plans.standard.name')          => 15,
                config('services.plans.standard_yearly.name')   => 15,
                config('services.plans.standard_new.name')      => 15,
                config('services.plans.premium.name')           => 14,
                config('services.plans.premium_new.name')       => 14,
                config('services.plans.premium_yearly.name')    => 14
            ),
            'send_letter' => array(
                config('services.plans.basic.name')             => 18,
                config('services.plans.basic_new.name')         => 18,
                config('services.plans.basic_yearly.name')      => 18,
                config('services.plans.standard.name')          => 17,
                config('services.plans.standard_yearly.name')   => 17,
                config('services.plans.standard_new.name')      => 17,
                config('services.plans.premium.name')           => 16,
                config('services.plans.premium_new.name')       => 16,
                config('services.plans.premium_yearly.name')    => 16
            ),
        );

        foreach ($campaigns as $campaign) {
            $userId = $campaign['user_id'];
            $user = $this->userService->findUserById($userId);
            if (!$this->checkCredits($campaign, $user)) {
                continue;
            }
            $templateId = $campaign['template_id'];
            $role = $user['role'];
            $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
            if ($subscribedPlanName === config('services.plans.pause.name')) {
                continue;
            }
            $mailsSent = 0;
            $isPostCard = 0;

            $template = $this->mailTemplateService->read($templateId);

            if ($template) {
                $isPostCard = $template['is_postcard'];
                $templateSections = $template->mailTemplateSections;
                if ($templateSections) {
                    $signature = $template->mailSignature;
                    $style = $template->mailTemplateStyle;
                    $styleSections = $style->mailTemplateStyleSections;
                    $section0 = substr($templateSections[0]['content'], 0, $styleSections[0]['limit']);
                    $section1 = substr($templateSections[1]['content'], 0, $styleSections[1]['limit']);
                    $section2 = substr($templateSections[2]['content'], 0, $styleSections[2]['limit']);

                    $frontHtml = $style['front_content'];
                    $backHtml = $style['back_content'];

                    $frontHtml = str_replace('{{section_a}}', $section0, $frontHtml);
                    $frontHtml = str_replace('{{section_b}}', $section1, $frontHtml);
                    $frontHtml = str_replace('{{section_c}}', $section2, $frontHtml);

                    $backHtml = str_replace('{{section_a}}', $section0, $backHtml);
                    $backHtml = str_replace('{{section_b}}', $section1, $backHtml);
                    $backHtml = str_replace('{{section_c}}', $section2, $backHtml);

                    $mergeVariables = array(
                        'signature_name'        => $signature['name'],
                        'signature_sign_off'    => $signature['sign_off'],
                        'signature_phone'       => $signature['contact_phone'],
                        'signature_email'       => $signature['contact_email'],
                        'signature_website'     => $signature['contact_website'],
                        'signature_address'     => $signature['address_line1'],
                        'signature_city'        => $signature['address_city'],
                        'signature_state'       => $signature['address_state'],
                        'signature_zip'         => $signature['address_zip'],
                        'disclosure_agreement'  => $signature['disclosure_agreement'],
                        'primary_color'         => $template['primary_color']
                    );

                    $page = 1;
                    $perPage = 100;
                    do {
                        $properties = $this->mailCampaignProperty->where('mail_campaign_id', $campaign['id'])
                            ->skip(($page - 1) * $perPage)
                            ->take($perPage)
                            ->get();
                        foreach ($properties as $property) {
                            $contactedAlready = false;
                            $mailCampaignPropertyId = $property['id'];
                            $propertyId = $property['property_id'];

                            $property = $this->propertyService->read($propertyId);
                            Log::info('Property ID = ' . $propertyId);
                            if ($property) {
                                $propertyImage = $this->propertyImageService->getStreetViewImage($property['id']);
                                if (!$propertyImage) {
                                    $propertyId = $property['id'];
                                    $latitude = $property['location_latitude'];
                                    $longitude = $property['location_longitude'];
                                    $this->propertyImageService->createStreetViewImage($propertyId, $latitude, $longitude);
                                    // $propertyImage = config('app.url') . '/style_images/3/default_background_3.jpg';
                                    $propertyImage = $this->propertyImageService->getStreetViewImageUrl($latitude, $longitude);
                                }
                                $mergeVariables['street_view_image'] = $propertyImage;
                                $mergeVariables['property_address'] = $property['address1'];
                                $mergeVariables['property_city'] = $property['Site_City'];
                                $mergeVariables['property_state'] = $property['Site_State'];
                                $mergeVariables['property_zip'] = $property['Site_Zip5'];
                                $mergeVariables['owner_name'] = $property['Owner1FirstName'] . ' ' . $property['Owner1LastName'];
                                $mergeVariables['owner_address'] = $property['CO_Mail_Street_Address'];
                                $mergeVariables['owner_city'] = $property['CO_Mailing_City'];
                                $mergeVariables['owner_state'] = $property['CO_Mailing_State'];
                                $mergeVariables['owner_zip'] = $property['CO_Mailing_Zip_Code'];

                                $address = $property['CO_Mail_Street_Address'];
                                $city = $property['CO_Mailing_City'];
                                $state = $property['CO_Mailing_State'];
                                $zip = $property['CO_Mailing_Zip_Code'];
                                $name = $property['Current_Owner_Name'];
                                $description = $campaign['description'];

                                if ($address && $name && $city && $state && $zip) {
                                    if ($isPostCard) {
                                        $postCard = $this->lobService->createPostCard(
                                            array(
                                                'address'           => $address,
                                                'name'              => $name,
                                                'city'              => $city,
                                                'state'             => $state,
                                                'zip'               => $zip,
                                                'front'             => $frontHtml,
                                                'back'              => $backHtml,
                                                'description'       => $description,
                                                'mergeVariables'    => $mergeVariables
                                            )
                                        );
                                    } else {
                                        $postCard = $this->lobService->createLetter(
                                            array(
                                                'address'           => $address,
                                                'name'              => $name,
                                                'city'              => $city,
                                                'state'             => $state,
                                                'zip'               => $zip,
                                                'front'             => $frontHtml,
                                                'description'       => $description,
                                                'mergeVariables'    => $mergeVariables,
                                                'from_address'      => $signature['address_line1'],
                                                'from_city'         => $signature['address_city'],
                                                'from_state'        => $signature['address_state'],
                                                'from_zip'          => $signature['address_zip'],
                                                'from_name'         => $signature['name']
                                            )
                                        );
                                    }

                                    if ($postCard) {
                                        $mailsSent ++;
                                        $this->mailCampaignPropertyService->update(
                                            $mailCampaignPropertyId,
                                            array(
                                                'postcard_id'   => $postCard['id']
                                            )
                                        );
                                        if (!$contactedAlready) {
                                            $data = array(
                                                'user_id'       => $userId,
                                                'description'   => 'sent mail.',
                                                'type'          => 'mail',
                                                'property_id'   => $propertyId
                                            );
                                            $this->propertyHistoryService->create($data);
                                        }
                                        $contactedAlready = true;
                                    }
                                } else {
                                    Log::info('Failed Property Id = ' . $propertyId);
                                }
                            }
                        }
                        $page++;
                    } while(count($properties));
                }
            }
            if ($mailsSent) {
                if ($subscribedPlanName) {
                    $unitPrice = 0;
                    if ($isPostCard) {
                        $unitPrice = $prices['send_mail'][$subscribedPlanName];
                    } else {
                        $unitPrice = $prices['send_letter'][$subscribedPlanName];
                    }

                    $transactionType = config('services.credit_transaction_type.send_mail');
                    $creditCount = $unitPrice * $mailsSent;
                    $referenceId = $campaign['id'];
                    if ($role === 'owner') {
                        $this->creditTransactionService->addTransactionByTransactionType($userId, $transactionType, $creditCount, $referenceId, $userId, 'Sent Mail');
                    } else if ($role === 'admin' || $role === 'member') {
                        $ownerUserId = $this->teamUserService->getOwnerUserId($userId);
                        $this->creditTransactionService->addTransactionByTransactionType($ownerUserId, $transactionType, $creditCount, $referenceId, $userId, 'Sent Mail');
                    }
                }
            }
            if ($isRepeat) {
                $repeatCampaigns = $this->mailCampaignRepeatService->findWhere(
                    array(
                        'mail_campaign_id' => $campaign['id']
                    )
                );
                foreach ($repeatCampaigns as $repeatCampaign) {
                    if ($repeatCampaign['finished'] === 1) {
                        $this->mailCampaignService->update($campaign['id'], array(
                            'finished' => 1
                        ));
                        $this->zappierTrigger($campaign, 'Finished');
                    }
                }
            } else {
                $finished = 1;
                $repeatCount = $this->mailCampaignRepeatService->findWhereCount(
                    array(
                        'mail_campaign_id' => $campaign['id']
                    )
                );
                if ($repeatCount) {
                    $finished = 3;
                }
                $this->mailCampaignService->update($campaign['id'], array(
                    'finished' => $finished
                ));

                // Call Zapier Trigger
                if ($finished === 1) {
                    $this->zappierTrigger($campaign, 'Finished');
                }
            }
        }
    }

    protected function checkCredits($campaign, $user)
    {
        $role = $user['role'];
        $userId = $user['id'];
        $transactionType = config('services.credit_transaction_type.send_mail');
        $templateId = $campaign['template_id'];
        $template = $this->mailTemplateService->read($templateId);
        $isPostCard = $template['is_postcard'];
        if (!$isPostCard) {
            $transactionType = config('services.credit_transaction_type.send_letter');
        }

        $propertyIds = [];
        $page = 1;
        $perPage = 500;
        do {
            $properties = $this->mailCampaignProperty->where('mail_campaign_id', $campaign['id'])
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            foreach ($properties as $property) {
                $propertyIds []= $property['property_id'];
            }
            $page++;
        } while(count($properties));

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
            Log::info('Funds insufficient for sending mail');
            Log::info('user_id = ' . $user['id']);
            Log::info('campaign_id = ' . $campaign['id']);
            Log::info('credit_count = ' . $creditCount);

            $campaignId = $campaign['id'];
            $this->mailCampaignService->update($campaignId, array(
                'finished'  => 2
            ));
            $repeats = $this->mailCampaignRepeatService->findAllByCampaignId($campaignId);
            foreach ($repeats as $repeat) {
                $this->mailCampaignRepeatService->update(
                    $repeat['id'],
                    array(
                        'finished'  => 2
                    )
                );
                $this->zappierTrigger($campaign, 'Cancelled');
            }
            Mail::to($user->email)->send(new InsufficientCredits($user, 'Mail Campaign', $creditCount));
        }

        return $balance;
    }

    protected function zappierTrigger($campaign, $reason)
    {
        $subscribes = ZapierSubscribe::where('user_id', $campaign['user_id']);
        $subscribes = $subscribes->where('type', 'mail_campaign_finished')->get();
        $data = array(
            'start_date'        => $campaign['send_date'],
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

    protected function initializeVariables()
    {
        $mailCampaign = new MailCampaign;
        $mailCampaignRepository = new MailCampaignRepository($mailCampaign);
        $this->mailCampaignService = new MailCampaignService($mailCampaignRepository);

        $mailCampaignProperty = new MailCampaignProperty;
        $this->mailCampaignProperty = $mailCampaignProperty;
        $mailCampaignPropertyRepository = new MailCampaignPropertyRepository($mailCampaignProperty);
        $this->mailCampaignPropertyService = new MailCampaignPropertyService($mailCampaignPropertyRepository);

        $mailTemplate = new MailTemplate;
        $mailTemplateRepository = new MailTemplateRepository($mailTemplate);
        $this->mailTemplateService = new MailTemplateService($mailTemplateRepository);

        $property = new Property;
        $propertyRepository = new PropertyRepository($property);
        $this->propertyService = new PropertyService($propertyRepository);

        $propertyHistory = new PropertyHistory;
        $propertyHistoryRepository = new PropertyHistoryRepository($propertyHistory);
        $this->propertyHistoryService = new PropertyHistoryService($propertyHistoryRepository);

        $propertyImage = new PropertyImage;
        $propertyImageRepository = new PropertyImageRepository($propertyImage);
        $this->propertyImageService = new PropertyImageService($propertyImageRepository);

        $this->lobService = new LobService;

        $mailCampaignRepeat = new MailCampaignRepeat;
        $mailCampaignRepeatRepository = new MailCampaignRepeatRepository($mailCampaignRepeat);
        $this->mailCampaignRepeatService = new MailCampaignRepeatService($mailCampaignRepeatRepository);

        $addOn = new AddOn;
        $addOnRepository = new AddOnRepository($addOn);
        $addOnService = new AddOnService($addOnRepository);

        $team = new Team;
        $teamRepository = new TeamRepository($team);
        $teamService = new TeamService($teamRepository);

        $userModel = new User;
        $userRepository = new UserRepository($userModel);

        $twilioService = new TwilioService($userRepository);


        $teamInvitation = new TeamInvitation;
        $teamInvitationRepository = new TeamInvitationRepository($teamInvitation);
        $teamUser = new TeamUser;
        $teamUserRepository = new TeamUserRepository($teamUser);
        $teamUserService = new TeamUserService($teamUserRepository, $twilioService, $teamInvitationRepository);
        $this->teamUserService = $teamUserService;

        $userService = new UserService(
            $userRepository,
            $twilioService,
            $teamService,
            $addOnService,
            $teamUserService
        );
        $this->userService = $userService;

        $stripeService = new StripeService($teamUserService, $userService);
        $this->stripeService = $stripeService;

        $creditTransaction = new CreditTransaction;
        $creditTransactionRepository = new CreditTransactionRepository($creditTransaction);
        $creditBallance = new CreditBallance;
        $creditBallanceRepository = new CreditBallanceRepository($creditBallance);
        $autoRechargeSetting = new AutoRechargeSetting;
        $autoRechargeSettingRepository = new AutoRechargeSettingRepository($autoRechargeSetting);
        $autoRechargeSettingService = new AutoRechargeSettingService($autoRechargeSettingRepository);
        $creditPackage = new CreditPackage;
        $creditPackageRepository = new CreditPackageRepository($creditPackage);
        $creditPackageService = new CreditPackageService($creditPackageRepository);

        $this->creditTransactionService = new CreditTransactionService(
            $creditTransactionRepository,
            $creditBallanceRepository,
            $userService,
            $teamService,
            $autoRechargeSettingService,
            $stripeService,
            $creditPackageService
        );

        $creditTransactionType = new CreditTransactionType;
        $creditTransactionTypeRepository = new CreditTransactionTypeRepository($creditTransactionType);
        $propertyPhone = new PropertyPhone;
        $propertyPhoneRepository = new PropertyPhoneRepository($propertyPhone);
        $propertyPhoneService = new PropertyPhoneService($propertyPhoneRepository);
        $this->creditBalanceService = new CreditBallanceService(
            $creditBallanceRepository,
            $creditTransactionTypeRepository,
            $propertyPhoneService,
            $this->propertyService,
            $teamService,
            $stripeService,
            $this->propertyHistoryService,
            $teamUserService,
            $userService
        );
    }
}
