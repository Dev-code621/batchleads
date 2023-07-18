<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateSmsCampaignTemplateRequest;
use App\Http\Requests\UpdateSmsCampaignTemplateRequest;
use App\Services\SmsCampaignTemplateMasterService;
use App\Services\SmsCampaignTemplateDetailService;

/**
 * Class SmsCampaignTemplateController
 *
 * @package App\Http\Controllers
 */
class SmsCampaignTemplateController extends Controller
{
    /**
     * constructor.
     *
     * @param SmsCampaignTemplateMasterService $service
     */
    public function __construct(SmsCampaignTemplateMasterService $service, SmsCampaignTemplateDetailService $templateDetailService)
    {
        $this->baseService = $service;
        $this->templateDetailService = $templateDetailService;
    }

    public function create(CreateSmsCampaignTemplateRequest $request)
    {
        $user = $request->user();
        $teamId = $this->getTeamId($user);

        $data = $request->validated();
        $name = $data['name'];
        $details = $data['details'];

        $result = $this->baseService->create(
            array(
                'name'      => $name,
                'user_id'   => $user['id'],
                'team_id'   => $teamId
            )
        );

        if ($result) {
            $masterId = $result['id'];
            foreach ($details as $key => $detail) {
                $this->templateDetailService->create(
                    array(
                        'template_master_id'    => $masterId,
                        'content'               => $detail['content'],
                        'day'                   => $detail['day']
                    )
                );
            }

            $result = $this->baseService->read($masterId);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.create.fail'));
        }

        return $this->responseWithError(__('error.create.fail'));
    }

    public function update(UpdateSmsCampaignTemplateRequest $request, $id)
    {
        $data = $request->validated();
        $name = $data['name'];
        $details = $data['details'];

        $result = $this->templateDetailService->removeByMasterId($id);
        if ($result) {
            $result = $this->baseService->update(
                $id,
                array(
                    'name' => $name
                )
            );

            foreach ($details as $key => $detail) {
                $this->templateDetailService->create(
                    array(
                        'template_master_id'    => $id,
                        'content'               => $detail['content'],
                        'day'                   => $detail['day']
                    )
                );
            }

            $result = $this->baseService->read($id);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.update.fail'));
        }

        return $this->responseWithError(__('error.delete.fail'));
    }
}
