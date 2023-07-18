<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\GetSmsCampaignTemplateMastersRequest;
use App\Http\Requests\CreateSmsCampaignTemplateMasterRequest;
use App\Http\Requests\UpdateSmsCampaignTemplateMasterRequest;
use App\Http\Requests\DefaultDeleteRequest;
use App\Services\SmsCampaignTemplateMasterService;
use App\Services\SmsCampaignService;

/**
 * Class SmsCampaignTemplateMasterController
 *
 * @package App\Http\Controllers
 */
class SmsCampaignTemplateMasterController extends Controller
{
    /**
     * constructor.
     *
     * @param SmsCampaignTemplateMasterService $service
     */
    public function __construct(SmsCampaignTemplateMasterService $service, SmsCampaignService $smsCampaignService)
    {
        $this->baseService = $service;
        $this->smsCampaignService = $smsCampaignService;
    }

    public function list(GetSmsCampaignTemplateMastersRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
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

    public function create(CreateSmsCampaignTemplateMasterRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdateSmsCampaignTemplateMasterRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }

    public function delete(DefaultDeleteRequest $request, $id)
    {
        $campaigns = $this->smsCampaignService->getCampaignsByTemplateMasterId($id);
        if (count($campaigns) > 0) {
            return $this->responseWithError(__('error.sms.campaign.template.isinuse'));
        }

        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }
}
