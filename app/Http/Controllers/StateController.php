<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateStateRequest;
use App\Http\Requests\DefaultIndexRequest;
use App\Http\Requests\DeleteStateRequest;
use App\Http\Requests\UpdateStateRequest;
use App\Services\PropertyService;
use App\Services\StateService;

/**
 * Class StateController
 *
 * @package App\Http\Controllers
 */
class StateController extends Controller
{
    protected $baseService;
    protected $propertyService;

    /**
     * constructor.
     *
     * @param StateService $service
     */
    public function __construct(
        StateService $service,
        PropertyService $propertyService
    )
    {
        $this->baseService = $service;
        $this->propertyService = $propertyService;
    }

    public function index(DefaultIndexRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $teamId = $this->getTeamId($user);

        $data = $this->baseService->search(
            array(
                'per_page'  =>  $pageSize,
                'order_by'  =>  $orderBy,
                'order'     =>  $order,
                'search'    =>  $search,
                'team_id'   =>  $teamId,
                'page'      =>  $page
            )
        );

        if ($data) {
            $items = $data['data'];
            $defaultStatus = config('services.default_status');
            $result = [];
            foreach ($defaultStatus as $status) {
                $propertyCount = $this->propertyService->findWhereCount(
                    array(
                        'status'    => $status['name'],
                        'team_id'   => $teamId
                    )
                );
                $status['property_count'] = $propertyCount;
                $result []= $status;
            }
            $data['data'] = array_merge($result, json_decode($items));
        }

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreateStateRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $name = $data['name'];
        $count = $this->baseService->findWhereCount(
            array(
                'team_id'   => $this->getTeamId($user),
                'name'      => $name
            )
        );
        if ($count) {
            return $this->responseWithError('Already registered!');
        }
        return $this->add($request);
    }

    public function update(UpdateStateRequest $request, $id)
    {
        $user = $request->user();
        $data = $request->validated();
        $name = $data['name'];
        $find = $this->baseService->findWhere(
            array(
                'team_id'   => $this->getTeamId($user),
                'name'      => $name
            )
        );
        if (count($find)) {
            if (intval($find[0]['id']) !== intval($id)) {
                return $this->responseWithError('Already registered!');
            }
        }
        return $this->updateData($request, $id);
    }

    public function deleteState(DeleteStateRequest $request, $id)
    {
        $data = $request->validated();
        $status = $data['status'] ?? null;
        $stateId = $data['state_id'] ?? null;

        $propertyCount = $this->propertyService->findWhereCount(
            array(
                'state_id'  => $id
            )
        );

        if ($stateId === $id) {
            return $this->responseWithError(__('error.delete.fail'));
        }

        if ($propertyCount && !$status && !$stateId) {
            return response()->json(['success' => false, 'data' => $propertyCount, 'message' => 'Status is in use'], 422);
        }

        if ($status) {
            $this->propertyService->searchAndUpdate(
                array(
                    'state_id'  => $id
                ),
                array(
                    'status'    => $status,
                    'state_id'  => null
                ),
                null
            );
        }
        if ($stateId) {
            $state = $this->baseService->read($stateId);
            $this->propertyService->searchAndUpdate(
                array(
                    'state_id'  => $id
                ),
                array(
                    'state_id'  => $stateId,
                    'status'    => $state['name']
                ),
                null
            );
        }

        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }
}
