<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\UserService;
use App\Services\MailTemplateService;
use App\Services\MailTemplateSectionService;
use App\Services\MailTemplateStyleService;
use App\Services\MailSignatureService;
use App\Services\TeamService;

class UpdateUserMailTemplates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:mailtemplates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update All User Mail Templates';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        UserService $userService,
        MailTemplateService $mailTemplateService,
        MailTemplateStyleService $mailTemplateStyleService,
        MailTemplateSectionService $mailTemplateSectionService,
        MailSignatureService $mailSignatureService,
        TeamService $teamService
    )
    {
        parent::__construct();
        $this->userService = $userService;
        $this->mailTemplateService = $mailTemplateService;
        $this->mailTemplateStyleService = $mailTemplateStyleService;
        $this->mailTemplateSectionService = $mailTemplateSectionService;
        $this->mailSignatureService = $mailSignatureService;
        $this->teamService = $teamService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = $this->userService->getAllUsers();
        foreach ($users as $user) {
            $userId = $user['id'];
            for ($mailTemplateStyleId = 7; $mailTemplateStyleId <= 13; $mailTemplateStyleId++) {
                $mailTemplates = $this->mailTemplateService->findWhere(
                    array(
                        'user_id'                   => $userId,
                        'mail_template_style_id'    => $mailTemplateStyleId
                    )
                );

                $mailTemplateStyle = $this->mailTemplateStyleService->read($mailTemplateStyleId);
                if ($mailTemplateStyle) {
                    if (count($mailTemplates)) {
                        foreach ($mailTemplates as $mailTemplate) {
                            $this->mailTemplateService->update(
                                $mailTemplate['id'],
                                array(
                                    'name'              => $mailTemplateStyle['name'],
                                    'primary_color'     => $mailTemplateStyle['primary_color'],
                                    'is_postcard'       => $mailTemplateStyle['is_post_card'],
                                )
                            );

                            $mailTemplateStyleSections = $mailTemplateStyle['mail_template_style_sections'];
                            if (count($mailTemplateStyleSections)) {
                                $this->mailTemplateSectionService->removeAllByTemplateId($mailTemplate['id']);
                                foreach ($mailTemplateStyleSections as $mailTemplateStyleSection) {
                                    $this->mailTemplateSectionService->create(
                                        array(
                                            'template_id'   => $mailTemplate['id'],
                                            'name'          => $mailTemplateStyleSection['name'],
                                            'content'       => $mailTemplateStyleSection['content']
                                        )
                                    );
                                }
                            }
                        }
                    } else {
                        $mailSignatures = $this->mailSignatureService->findWhere(
                            array(
                                'user_id'   => $userId
                            )
                        );
                        if (count($mailSignatures)) {
                            $mailSignatureId = $mailSignatures[0]['id'];
                            $teamId = $this->teamService->getTeamId($user);
                            if ($teamId) {
                                $mailTemplate = $this->mailTemplateService->create(
                                    array(
                                        'user_id'                   => $userId,
                                        'name'                      => $mailTemplateStyle['name'],
                                        'primary_color'             => $mailTemplateStyle['primary_color'],
                                        'is_postcard'               => $mailTemplateStyle['is_post_card'],
                                        'mail_template_style_id'    => $mailTemplateStyleId,
                                        'signature_id'              => $mailSignatureId,
                                        'team_id'                   => $teamId
                                    )
                                );
                                if ($mailTemplate) {
                                    $mailTemplateStyleSections = $mailTemplateStyle['mail_template_style_sections'];
                                    if (count($mailTemplateStyleSections)) {
                                        foreach ($mailTemplateStyleSections as $mailTemplateStyleSection) {
                                            $this->mailTemplateSectionService->create(
                                                array(
                                                    'template_id'   => $mailTemplate['id'],
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
                }
            }
        }
    }
}
