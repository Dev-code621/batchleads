<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateMailTemplateRequest;
use App\Http\Requests\UpdateMailTemplateRequest;
use App\Http\Requests\DefaultIndexRequest;
use App\Http\Requests\DefaultDeleteRequest;
use App\Services\MailTemplateService;
use App\Services\MailTemplateSectionService;
use App\Services\MailCampaignService;

/**
 * Class MailTemplateController
 *
 * @package App\Http\Controllers
 */
class MailTemplateController extends Controller
{
    protected $mailTemplateSectionService;

    /**
     * constructor.
     *
     * @param MailTemplateService $service
     * @param MailTemplateSectionService $mailTemplateSectionService
     */
    public function __construct(MailTemplateService $service, MailTemplateSectionService $mailTemplateSectionService, MailCampaignService $mailCampaignService)
    {
        $this->baseService = $service;
        $this->mailTemplateSectionService = $mailTemplateSectionService;
        $this->mailCampaignService = $mailCampaignService;
    }

    public function index(DefaultIndexRequest $request, $page=1)
    {
        $user = $request->user();
        $pageSize = $request->get('pageSize') ?? 30;
        $orderBy = $request->get('orderBy') ?? 'created_at';
        $order = $request->get('order') ?? 'desc';
        $search = $request->get('search') ?? '';
        $teamId = $this->getTeamId($user);

        $data = $this->baseService->search(array(
            'per_page'  =>  $pageSize,
            'order_by'  =>  $orderBy,
            'order'     =>  $order,
            'search'    =>  $search,
            'userId'    =>  $user['id'],
            'team_id'   =>  $teamId,
            'page'      =>  $page
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreateMailTemplateRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $data['user_id'] = $user['id'];
        $teamId = $this->getTeamId($user);
        $data['team_id'] = $teamId;
        $template = $this->baseService->create($data);
        $templateId = $template['id'];

        $sectionA = $request->get('section_a') ?? '';
        $sectionB = $request->get('section_b') ?? '';
        $sectionC = $request->get('section_c') ?? '';
        $this->mailTemplateSectionService->create(array(
            'template_id'   => $templateId,
            'name'          => 'section A',
            'content'       => $sectionA
        ));
        $this->mailTemplateSectionService->create(array(
            'template_id'   => $templateId,
            'name'          => 'section B',
            'content'       => $sectionB
        ));
        $this->mailTemplateSectionService->create(array(
            'template_id'   => $templateId,
            'name'          => 'section C',
            'content'       => $sectionC
        ));

        $template = $this->baseService->read($templateId);

        return $template
            ? $this->responseWithSuccess($template)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function update(UpdateMailTemplateRequest $request, $id)
    {
        $data = $request->validated();
        $result = $this->baseService->update($id, $data);
        if ($result) {
            $sectionA = $request->get('section_a') ?? '';
            $sectionB = $request->get('section_b') ?? '';
            $sectionC = $request->get('section_c') ?? '';

            $this->mailTemplateSectionService->removeAllByTemplateId($id);
            $this->mailTemplateSectionService->create(array(
                'template_id'   => $id,
                'name'          => 'section A',
                'content'       => $sectionA
            ));
            $this->mailTemplateSectionService->create(array(
                'template_id'   => $id,
                'name'          => 'section B',
                'content'       => $sectionB
            ));
            $this->mailTemplateSectionService->create(array(
                'template_id'   => $id,
                'name'          => 'section C',
                'content'       => $sectionC
            ));

            $template = $this->baseService->read($id);

            return $this->responseWithSuccess($template, 'update.success');
        }

        return $this->responseWithError(__('error.update.fail'));
    }

    public function delete(DefaultDeleteRequest $request, $id)
    {
        $campaigns = $this->mailCampaignService->getCampaignsByTemplateId($id);
        if (count($campaigns) > 0) {
            return $this->responseWithError(__('error.mail.campaign.template.isinuse'));
        }

        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }
}
