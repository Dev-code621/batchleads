<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateMailSignatureRequest;
use App\Http\Requests\UpdateMailSignatureRequest;
use App\Http\Requests\DefaultDeleteRequest;
use App\Services\MailSignatureService;
use App\Services\MailTemplateService;
use App\Http\Requests\DefaultIndexRequest;

/**
 * Class MailSignatureController
 *
 * @package App\Http\Controllers
 */
class MailSignatureController extends Controller
{
    /**
     * constructor.
     *
     * @param MailSignatureService $service
     */
    public function __construct(MailSignatureService $service, MailTemplateService $mailTemplateService)
    {
        $this->baseService = $service;
        $this->mailTemplateService = $mailTemplateService;
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

    public function create(CreateMailSignatureRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdateMailSignatureRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }

    public function delete(DefaultDeleteRequest $request, $id)
    {
        $templates = $this->mailTemplateService->getTemplatesBySignatureId($id);
        if (count($templates) > 0) {
            return $this->responseWithError(__('error.mail.campaign.signature.isinuse'));
        }

        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }
}
