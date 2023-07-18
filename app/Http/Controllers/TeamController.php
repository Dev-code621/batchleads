<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use App\Http\Requests\GetTeamMembersRequest;
use App\Services\TeamService;
use App\Services\UserService;
use Illuminate\Http\Request;

/**
 * Class TeamController
 *
 * @package App\Http\Controllers
 */
class TeamController extends Controller
{
    protected $userService;

    /**
     * constructor.
     *
     * @param TeamService $service
     */
    public function __construct(TeamService $service, UserService $userService)
    {
        $this->baseService = $service;
        $this->userService = $userService;
    }

    public function create(CreateTeamRequest $request)
    {
        $name = $request->name;
        $isNameExist = $this->baseService->isNameExist($name);
        if ($isNameExist) {
            return $this->responseWithError('team.name.registered.already', 421);
        }

        $adminUserId = $request->admin_user_id;
        $isUserRegistered = $this->baseService->isUserRegistered($adminUserId);
        if ($isUserRegistered) {
            return $this->responseWithError('user.registered.already', 423);
        }

        $user = $this->userService->findUserById($adminUserId);
        if (!$user) {
            return $this->responseWithError('user.no.exist', 424);
        }

        return $this->add($request);
    }

    public function update(UpdateTeamRequest $request, $id)
    {
        $name = $request->name;
        $isNameExist = $this->baseService->isNameExist($name, $id);
        if ($isNameExist) {
            return $this->responseWithError('team.name.registered.already', 421);
        }

        return $this->updateData($request, $id);
    }

    public function getTeamMembers(GetTeamMembersRequest $request, $page = 1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $teamId = $this->getTeamId($user);

        $data = $this->baseService->getTeamMembers(array(
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
}
