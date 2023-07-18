<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\MailTemplateStyleService;
use App\Services\MailTemplateService;
use App\Services\MailTemplateSectionService;
use App\Services\MailCampaignService;
use App\Services\MailCampaignPropertyService;
use App\Services\MailCampaignRepeatService;
use Log;

class RemoveStylesAndTemplates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remove:stylesandtemplates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove unrequired styles and templates, style_id = 3, 4, 5, 6';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        MailTemplateStyleService $mailTemplateStyleService,
        MailTemplateService $mailTemplateService,
        MailTemplateSectionService $mailTemplateSectionService,
        MailCampaignService $mailCampaignService,
        MailCampaignRepeatService $mailCampaignRepeatService,
        MailCampaignPropertyService $mailCampaignPropertyService
    )
    {
        parent::__construct();
        $this->mailTemplateStyleService = $mailTemplateStyleService;
        $this->mailTemplateService = $mailTemplateService;
        $this->mailTemplateSectionService = $mailTemplateSectionService;
        $this->mailCampaignService = $mailCampaignService;
        $this->mailCampaignRepeatService = $mailCampaignRepeatService;
        $this->mailCampaignPropertyService = $mailCampaignPropertyService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $mailTemplateStyleIds = [1, 3, 4, 5, 6];
        foreach ($mailTemplateStyleIds as $mailTemplateStyleId) {
            Log::info('style id = ' . $mailTemplateStyleId);
            $mailTemplates = $this->mailTemplateService->findWhere(
                array(
                    'mail_template_style_id' => $mailTemplateStyleId
                )
            );
            foreach ($mailTemplates as $mailTemplate) {
                $mailTemplateId = $mailTemplate['id'];
                Log::info('mail template id = ' . $mailTemplateId);
                $mailCampaigns = $this->mailCampaignService->findWhere(
                    array(
                        'template_id'   => $mailTemplateId
                    )
                );
                foreach ($mailCampaigns as $mailCampaign) {
                    $mailCampaignId = $mailCampaign['id'];
                    Log::info('mail campaign id = ' . $mailCampaignId);
                    $mailCampaignRepeats = $this->mailCampaignRepeatService->findWhere(
                        array(
                            'mail_campaign_id'  => $mailCampaignId
                        )
                    );
                    // Remove MailCampaignRepeats
                    foreach ($mailCampaignRepeats as $mailCampaignRepeat) {
                        Log::info('mail campaign repeat id = ' . $mailCampaignRepeat['id']);
                        $this->mailCampaignRepeatService->delete($mailCampaignRepeat['id']);
                    }
                    $mailCampaignProperties = $this->mailCampaignPropertyService->findWhere(
                        array(
                            'mail_campaign_id'  => $mailCampaignId
                        )
                    );
                    // Remove MailCampaignProperties
                    foreach ($mailCampaignProperties as $mailCampaignProperty) {
                        Log::info('mail campaign property id = ' . $mailCampaignProperty['id']);
                        $this->mailCampaignPropertyService->delete($mailCampaignProperty['id']);
                    }

                    // Remove MailCampaign
                    $this->mailCampaignService->delete($mailCampaignId);
                }
                Log::info('mail template id = ' . $mailTemplateId);
                // Remove MailTemplate
                $this->mailTemplateService->delete($mailTemplateId);
            }
            // Remove MailTemplateStyle
            $this->mailTemplateStyleService->delete($mailTemplateStyleId);
        }
    }
}
