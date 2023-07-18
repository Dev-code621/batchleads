<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Services\TagService;
use App\Http\Requests\DefaultIndexRequest;

/**
 * Class TagController
 *
 * @package App\Http\Controllers
 */
class TagController extends Controller
{
    /**
     * constructor.
     *
     * @param TagService $service
     */
    public function __construct(TagService $service)
    {
        $this->baseService = $service;
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
            'team_id'   =>  $teamId,
            'page'      =>  $page
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreateTagRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdateTagRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }
}
