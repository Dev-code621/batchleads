<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use App\Http\Requests\ApiRequest;
use App\Http\Requests\DefaultDeleteRequest;
use App\Http\Requests\DefaultReadRequest;
use App\Http\Requests\DefaultUpdateRequest;
use App\Http\Requests\DefaultIndexRequest;
use App\Services\BaseService;
use App\Models\TeamUser;
use App\Models\Team;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    protected $baseService;

    /**
     * constructor.
     *
     * @param BaseService $baseService
     */
    public function __construct(BaseService $baseService)
    {
        $this->baseService = $baseService;
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
                // 'userId'    =>  $user['id'],
                'team_id'   =>  $teamId,
                'page'      =>  $page
            )
        );

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function add(ApiRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $data['user_id'] = $user['id'];

        $teamId = $this->getTeamId($user);
        $data['team_id'] = $teamId;

        $result = $this->baseService->create($data);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function read(DefaultReadRequest $request, $id, array $relationships = [])
    {
        $data = $this->baseService->read($id);
        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.read.fail'));
    }

    public function updateData(DefaultUpdateRequest $request, $id)
    {
        $data = $request->validated();
        $result = $this->baseService->update($id, $data);

        if ($result) {
            $result = $this->baseService->read($id);
            return $result
                ? $this->responseWithSuccess($result, 'update.success')
                : $this->responseWithError(__('error.update.fail'));
        }

        return $this->responseWithError(__('error.update.fail'));
    }

    public function delete(DefaultDeleteRequest $request, $id)
    {
        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }

    protected function getTeamId($user)
    {
        $userId = $user['id'];
        $userRole = $user['role'];

        $teamId = 0;

        if ($userRole === config('services.user_role.owner')) {
            $team = Team::where('owner_user_id', $userId)->first();
            if ($team) {
                $teamId = $team->id;
            }
        } else {
            $teamUser = TeamUser::where('user_id', $userId)->first();
            if ($teamUser) {
                $teamId = $teamUser->team_id;
            }
        }

        return $teamId;
    }

    public function responseWithError($message="fail", $status=422)
    {
        return response()->json([
            'status'  => $status,
            'message' => $message,
        ], $status);
    }

    public function responseWithSuccess($data, $message="success", $status=200)
    {
        $response = array(
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        );

        return response()->json($response, 200);
    }
}
