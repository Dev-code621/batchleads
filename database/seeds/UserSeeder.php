<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Services\SmsCampaignTemplateMasterService;
use App\Services\SmsCampaignTemplateDetailService;
use App\Services\MailSignatureService;
use App\Services\MailTemplateService;
use App\Services\MailTemplateSectionService;
use App\Services\UserNotificationSettingService;
use App\Services\TwilioService;
use App\Services\UserService;

class UserSeeder extends Seeder
{
    public function __construct(
        SmsCampaignTemplateMasterService $smsCampaignTemplateMasterService,
        SmsCampaignTemplateDetailService $smsCampaignTemplateDetailService,
        MailSignatureService $mailSignatureService,
        MailTemplateService $mailTemplateService,
        MailTemplateSectionService $mailTemplateSectionService,
        UserNotificationSettingService $userNotificationSettingService,
        TwilioService $twilioService,
        UserService $userService
    )
    {
        $this->smsCampaignTemplateMasterService = $smsCampaignTemplateMasterService;
        $this->smsCampaignTemplateDetailService = $smsCampaignTemplateDetailService;
        $this->mailSignatureService = $mailSignatureService;
        $this->mailTemplateService = $mailTemplateService;
        $this->mailTemplateSectionService = $mailTemplateSectionService;
        $this->userNotificationSettingService = $userNotificationSettingService;
        $this->twilioService = $twilioService;
        $this->userService = $userService;
        $this->email = 'goknock.demo@goknock.com';
    }
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'id'                => 1,
            'name'              => 'GoKnock',
            'email'             => $this->email,
            'password'          => Hash::make('password'),
            'email_verified_at' => Carbon::now(),
            'stripe_id'         => 'cus_goknock_demo_customer',
            'role'              => 'owner',
            'card_brand'        => 'GoKnock Visa',
            'card_last_four'    => '4242',
        ]);
        DB::table('credit_ballances')->insert([
            'user_id'   => 1,
            'ballance'  => 3000
        ]);
        DB::table('teams')->insert([
            'id'                => 1,
            'owner_user_id'     => 1
        ]);
        $this->setUser();
    }

    protected function setUser()
    {
        $teamId = 1;
        $userId = 1;

        //Create Messaging Service
        $messagingServiceName = $this->email;
        $messagingServiceId = $this->twilioService->createMessagingService($messagingServiceName);
        $phoneNumbers = $this->twilioService->searchAvailablePhoneNumbers(1);
        if ($phoneNumbers && count($phoneNumbers)) {
            $phoneNumberSid = $this->twilioService->createIncomingPhoneNumberResource($phoneNumbers[0]);
            $this->twilioService->addPhoneNumberToService($messagingServiceId, $phoneNumberSid);
            $data['user_id'] = $userId;
            $data['twilio_messaging_service_id'] = $messagingServiceId;
            $this->userService->updateUserInfo($data);
        }

        // Create UserNotificationSettings
        $settings = config('services.notification_type');
        foreach ($settings as $setting) {
            $setting['user_id'] = $userId;
            $setting['enabled'] = 1;
            $this->userNotificationSettingService->create($setting);
        }

        // Create Sms Templates
        // $master = $this->smsCampaignTemplateMasterService->create(
        //     array(
        //         'user_id'   => $userId,
        //         'team_id'   => $teamId,
        //         'name'      => 'Template #1'
        //     )
        // );
        // $this->smsCampaignTemplateDetailService->create(
        //     array(
        //         'template_master_id'    => $master['id'],
        //         'day'                   => 1,
        //         'content'               => "Hi %Owner Name%,\r\nI am %My Name%.\r\nAre you a owner of the property located at %Property Address%?"
        //     )
        // );
        // $this->smsCampaignTemplateDetailService->create(
        //     array(
        //         'template_master_id'    => $master['id'],
        //         'day'                   => 2,
        //         'content'               => "Hi %Owner Name%,\r\nI am %My Name%.\r\nAre you a owner of the property located at %Property Address%?"
        //     )
        // );

        // Create Mail Templates
        $signature = $this->mailSignatureService->create(
            array(
                'label'                 => 'Signature #1',
                'sign_off'              => 'Sincerely',
                'name'                  => 'Justin Colby',
                'contact_phone'         => '480-378-34-33',
                'contact_email'         => ' ',
                'address_line1'         => '9375 E Shea Blvd',
                'address_line2'         => 'Scottsdale AZ 85260',
                'address_city'          => 'Scottsdale',
                'address_state'         => 'AZ',
                'address_zip'           => '85260',
                'disclosure_agreement'  => 'It is critical for me to stress that there is never any commitment when you call, even if you are simply curious. As professional investors, we are always happy to provide you with information regardless of the outcome.',
                'user_id'               => $userId,
                'team_id'               => $teamId
            )
        );
        $this->createMailTemplate7($signature['id'], $userId, $teamId);
        $this->createMailTemplate8($signature['id'], $userId, $teamId);
        $this->createMailTemplate8($signature['id'], $userId, $teamId);
        $this->createMailTemplate10($signature['id'], $userId, $teamId);
        $this->createMailTemplate11($signature['id'], $userId, $teamId);
    }

    protected function createMailTemplate3($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 3;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #3',
                'primary_color'             => '#e82727',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'Dear {{owner_name}},<br />
                I am writing because I am a local investor and would like to provide you with an unconditional offer on your property at <span class="red-color bold">{{property_address}} {{property_city}} {{property_state}} {{property_zip}}.</span>'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "Simply call today for a guaranteed offer in 72 hours or less. I’ll be glad to personally tell you more about my company and how we can work together. All calls are completely confidential and there is no obligation whatsoever."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'Even if you are not interested in selling at this time, <span class="red-color bold">CALL {{signature_phone}}</span>, so I can help you with determining the value of your property. Be sure to <span class="bold">KEEP THIS LETTER</span>. Thank you for your time and consideration and I look forward to speaking with you.'
            )
        );
    }

    protected function createMailTemplate4($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 4;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #4',
                'primary_color'             => '#0063b0',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'Dear {{owner_name}},<br />
                I am writing because I am a local investor and would like to provide you with an unconditional offer on your property at <span class="main-color bold">{{property_address}}.</span>'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "Simply call today for a guaranteed offer in 72 hours or less. I’ll be glad to personally tell you more about my company and how we can work together. All calls are completely confidential and there is no obligation whatsoever."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'Even if you are not interested in selling at this time, <span class="bold">CALL {{signature_phone}}</span>, so I can help you with determining the value of your property. Be sure to <span class="bold">KEEP THIS LETTER</span>. Thank you for your time and consideration and I look forward to speaking with you.'
            )
        );
    }

    protected function createMailTemplate5($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 5;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #5',
                'primary_color'             => '#2b8935',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'Dear {{owner_name}},<br />
                I am writing because I am a local investor and would like to provide you with an unconditional offer on your property at {{property_address}}.'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "Simply call today for a guaranteed offer in 72 hours or less. I’ll be glad to personally tell you more about my company and how we can work together. All calls are completely confidential and there is no obligation whatsoever."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'Even if you are not interested in selling at this time, CALL {{signature_phone}}, so I can help you with determining the value of your property. Be sure to KEEP THIS LETTER. Thank you for your time and consideration and I look forward to speaking with you.'
            )
        );
    }

    protected function createMailTemplate6($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 6;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #6',
                'primary_color'             => '#cc004a',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'Dear {{owner_name}},<br />
                I am writing because I am a local investor and would like to<br /> provide you with an unconditional offer on your property at <br /><span class="main-color">{{property_address}} {{property_city}} {{property_state}} {{property_zip}}.</span>'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "Simply call today for a guaranteed offer in 72 hours or less. I’ll be glad to personally tell you more about my company and how we can work together. All calls are completely confidential and there is no obligation whatsoever."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'Even if you are not interested in selling at this time, <span class="main-color">CALL {{signature_phone}}</span>, so I can help you with determining the value of your property. Be sure to <span class="bold">KEEP THIS LETTER.</span> Thank you for your time and consideration and I look forward to speaking with you.'
            )
        );
    }

    protected function createMailTemplate7($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 7;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #7',
                'primary_color'             => '#808080',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'I want to buy your house'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "If you have any interest in selling fast, as-is and with zero commissions or closing cost, I would like to buy it."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'I am interested in buying your house at {{property_address}}'
            )
        );
    }

    protected function createMailTemplate8($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 8;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #8',
                'primary_color'             => '#FF0202',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'I want to buy your house'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "If you have any interest in selling fast, as-is and with zero commissions or closing cost,"
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'I would like to buy it.'
            )
        );
    }

    protected function createMailTemplate9($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 9;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #9',
                'primary_color'             => '#6100DD',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'I want to buy your house'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "If you have any interest in selling fast, as-is and with zero commissions or closing cost, I would like to buy it."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'I am interested in buying your house at {{property_address}}'
            )
        );
    }

    protected function createMailTemplate10($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 10;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #10',
                'primary_color'             => '#AB2222',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'I want to buy your house'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "If you have any interest in selling fast, as-is and with zero commissions or closing cost, I would like to buy it."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'I am interested in buying your house at {{property_address}}'
            )
        );
    }

    protected function createMailTemplate11($signatureId, $userId, $teamId) {
        $mailTemplateStyleId = 11;
        $template = $this->mailTemplateService->create(
            array(
                'name'                      => 'Template #11',
                'primary_color'             => '#AB2222',
                'signature_id'              => $signatureId,
                'mail_template_style_id'    => $mailTemplateStyleId,
                'user_id'                   => $userId,
                'team_id'                   => $teamId,
                'is_postcard'               => 1
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section A',
                'content'       => 'Attention {{signature_name}}, I urgently Need to speak with you<br>about your property at: {{property_address}}.'
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section B',
                'content'       => "I am hoping this card catches you in time. I’ve tried for hours to find your phone number using the Internet but was unable to <br><br>
                I have recorder a brief message about your property at {{property_address}}. So that you could at least hear me out and then decide if we should speak over the phone.<br><br>
                All you have to do is call me at {{signature_phone}} to listen to my pre-recorded message about this matter. Call 24 hours a day, 7 days a week, to listen to my message. (No one will answer)."
            )
        );
        $this->mailTemplateSectionService->create(
            array(
                'template_id'   => $template['id'],
                'name'          => 'section C',
                'content'       => 'I have done all I can to get a hold you and this my last resort…<br><br>Please turn this card over… It’s  important that I hear from you ASAP.'
            )
        );
    }
}
