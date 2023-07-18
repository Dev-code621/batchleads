<?php

namespace App\Http\Middleware;

use App\Services\SmsCampaignTemplateMasterService;
use App\Services\SmsCampaignTemplateDetailService;
use App\Services\MailSignatureService;
use App\Services\MailTemplateService;
use App\Services\MailTemplateSectionService;
use App\Services\TeamService;
use App\Services\UserNotificationSettingService;
use App\Services\UserFpService;
use App\Services\MailTemplateStyleService;
use App\Services\TagService;

use Closure;

class UserSignUp
{
    public function __construct(
        SmsCampaignTemplateMasterService $smsCampaignTemplateMasterService,
        SmsCampaignTemplateDetailService $smsCampaignTemplateDetailService,
        MailSignatureService $mailSignatureService,
        MailTemplateService $mailTemplateService,
        MailTemplateSectionService $mailTemplateSectionService,
        TeamService $teamService,
        UserNotificationSettingService $userNotificationSettingService,
        UserFpService $userFpService,
        MailTemplateStyleService $mailTemplateStyleService,
        TagService $tagService
    )
    {
        $this->smsCampaignTemplateMasterService = $smsCampaignTemplateMasterService;
        $this->smsCampaignTemplateDetailService = $smsCampaignTemplateDetailService;
        $this->mailSignatureService = $mailSignatureService;
        $this->mailTemplateService = $mailTemplateService;
        $this->mailTemplateSectionService = $mailTemplateSectionService;
        $this->teamService = $teamService;
        $this->userNotificationSettingService = $userNotificationSettingService;
        $this->userFpService = $userFpService;
        $this->mailTemplateStyleService = $mailTemplateStyleService;
        $this->tagService = $tagService;
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
        $response = $next($request);
        $status = $response->status();
        if ($status === 201) {
            $result = json_decode($response->content(), true);
            $user = $result['user'];
            $userId = $user['id'];
            // Create UserNotificationSettings
            $settings = config('services.notification_type');
            foreach ($settings as $setting) {
                $setting['user_id'] = $userId;
                $setting['enabled'] = 1;
                $this->userNotificationSettingService->create($setting);
            }

            $teamId = $this->teamService->getTeamId($user);

            // Create Mail Templates
            $signature = $this->mailSignatureService->create(
                array(
                    'label'                 => 'Signature #1',
                    'sign_off'              => 'Sincerely',
                    'name'                  => $user['name'],
                    'contact_phone'         => $user['phone'],
                    'contact_email'         => $user['email'],
                    'address_line1'         => '',
                    'address_line2'         => '',
                    'address_city'          => '',
                    'address_state'         => '',
                    'address_zip'           => '',
                    'disclosure_agreement'  => 'It is critical for me to stress that there is never any commitment when you call, even if you are simply curious. As professional investors, we are always happy to provide you with information regardless of the outcome.',
                    'user_id'               => $userId,
                    'team_id'               => $teamId
                )
            );

            $this->createMailTemplates($signature['id'], $userId, $teamId);

            // Create New First Promoter
            $trackingRefId = $request->get('tracking_ref_id');
            $this->createNewPromoter($userId, $user['email'], $trackingRefId);

            if ($user['role'] === 'owner') {
                // Create Default Tags
                $this->createDefaultTags($userId, $teamId);
            }
        }

        return $response;
    }

    protected function createMailTemplates($signatureId, $userId, $teamId)
    {
        for ($mailTemplateStyleId = 7; $mailTemplateStyleId <= 13; $mailTemplateStyleId++) {
            $mailTemplateStyle = $this->mailTemplateStyleService->read($mailTemplateStyleId);
            if ($mailTemplateStyle) {
                $primaryColor = $mailTemplateStyle['primary_color'];
                $name = $mailTemplateStyle['name'];
                $isPostCard = $mailTemplateStyle['is_post_card'];
                $template = $this->mailTemplateService->create(
                    array(
                        'name'                      => $name,
                        'primary_color'             => $primaryColor,
                        'signature_id'              => $signatureId,
                        'mail_template_style_id'    => $mailTemplateStyleId,
                        'user_id'                   => $userId,
                        'team_id'                   => $teamId,
                        'is_postcard'               => $isPostCard
                    )
                );
                if ($template) {
                    $templateId = $template['id'];
                    $mailTemplateStyleSections = $mailTemplateStyle['mail_template_style_sections'];
                    if ($mailTemplateStyleSections) {
                        foreach($mailTemplateStyleSections as $mailTemplateStyleSection) {
                            $this->mailTemplateSectionService->create(
                                array(
                                    'template_id'   => $templateId,
                                    'name'          => $mailTemplateStyleSection['name'],
                                    'content'       => $mailTemplateStyleSection['content']
                                )
                            );
                        }
                    }
                }
            }
        }
    }

    protected function createNewPromoter($userId, $email, $trackingRefId = null)
    {
        $result = $this->userFpService->createPromoter($email);
        if ($result) {
            if (array_key_exists('auth_token', $result)) {
                $authToken = $result['auth_token'];
                $refId = null;
                $promotions = $result['promotions'];
                if (count($promotions)) {
                    $refId = $promotions[0]['ref_id'];
                }
                $this->userFpService->create(
                    array(
                        'user_id'           => $userId,
                        'ref_id'            => $refId,
                        'auth_token'        => $authToken,
                        'tracking_ref_id'   => $trackingRefId
                    )
                );
            }
        }
    }

    protected function createDefaultTags($userId, $teamId)
    {
        $defaultTags = array(
            "Tall Grass",
            "Overfilled Mailbox",
            "Window A/C Unit",
            "Vacant",
            "Handicap Ramp",
            "Code Enforcement Signs",
            "Broken Windows",
            "Boarded Up Windows",
            "Broken Gutters",
            "In Bad Shape",
            "Bad Roof",
            "Missing Siding",
            "Peeling Paint",
            "Trash In Yard",
        );

        foreach ($defaultTags as $tag) {
            $this->tagService->create(
                array(
                    'user_id'   => $userId,
                    'team_id'   => $teamId,
                    'name'      => $tag
                )
            );
        }
    }
}
