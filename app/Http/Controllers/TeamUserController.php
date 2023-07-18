<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTeamUserRequest;
use App\Http\Requests\UpdateTeamUserRequest;
use App\Http\Requests\InviteUserRequest;
use App\Http\Requests\TeamUserRemoveRequest;
use App\Http\Requests\CancelTeamInvitationRequest;
use App\Services\TeamUserService;
use App\Services\TeamService;
use App\Services\UserService;
use App\Services\TeamInvitationService;

/**
 * Class TeamUserController
 *
 * @package App\Http\Controllers
 */
class TeamUserController extends Controller
{
    protected $userService;
    protected $teamService;
    protected $teamInvitationService;

    /**
     * constructor.
     *
     * @param TeamUserService $service
     */
    public function __construct(
        TeamUserService $service,
        UserService $userService,
        TeamService $teamService,
        TeamInvitationService $teamInvitationService
    )
    {
        $this->baseService = $service;
        $this->userService = $userService;
        $this->teamService = $teamService;
        $this->teamInvitationService = $teamInvitationService;
    }

    public function create(CreateTeamUserRequest $request)
    {
        $teamId = $request->team_id;
        if (!$this->teamService->isTeamExist($teamId)) {
            return $this->responseWithError('team.no.exist', 421);
        }

        $userId = $request->user_id;
        $user = $this->userService->findUserById($userId);

        if (!$user) {
            return $this->responseWithError('user.no.exist', 423);
        }

        if ($this->teamService->isUserRegistered($userId)) {
            return $this->responseWithError('user.registered.as.team.admin.already', 424);
        }

        if ($this->baseService->isUserRegistered($userId)) {
            return $this->responseWithError('user.registered.as.team.user.already', 425);
        }

        return $this->add($request);
    }

    public function update(UpdateTeamUserRequest $request, $id)
    {
        $teamId = $request->team_id;
        if (!$this->teamService->isTeamExist($teamId)) {
            return $this->responseWithError('team.no.exist', 421);
        }

        return $this->updateData($request, $id);
    }

    public function inviteUser(InviteUserRequest $request)
    {
        $loggedInuser = $request->user();

        $email = $request->email;

        $teamId = $this->getTeamId($loggedInuser);
        $team = $this->teamService->read($teamId);

        if ($team) {
            $result = $this->baseService->sendInvitationLink($team, $loggedInuser, $email);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError('Invitation Failed');
        }
        return $this->responseWithError('You are not registered to any teams!', 424);
    }

    public function removeUser(TeamUserRemoveRequest $request, $userId)
    {
        $loggedInuser = $request->user();
        $loggedInUserId = $loggedInuser['id'];
        $userRole = $loggedInuser['role'];

        $teamId = $this->getTeamId($loggedInuser);
        $team = $this->teamService->read($teamId);

        if ($team) {
            $isUserRegistered = $this->baseService->isUserRegistered($userId, $teamId);
            if ($isUserRegistered) {
                $teamUsers = $this->baseService->findByUserId($userId);
                $result = $this->baseService->delete($teamUsers[0]->id);
                return $result
                    ? $this->responseWithSuccess('User is removed from team!')
                    : $this->responseWithError('Failed!', 424);
            }
            return $this->responseWithError('User is not registered to your team!', 425);
        }

        return $this->responseWithError('Team no exist!');
    }

    public function cancelInvitation(CancelTeamInvitationRequest $request, $teamInvitationId)
    {
        $loggedInuser = $request->user();
        $userId = $loggedInuser['id'];
        $userRole = $loggedInuser['role'];

        $teamId = $this->getTeamId($loggedInuser);
        $team = $this->teamService->read($teamId);

        if ($team) {
            if ($userRole === config('services.user_role.owner')) {
                $teamInvitation = $this->teamInvitationService->read($teamInvitationId);

                if ($teamInvitation) {
                    if ($teamId === $teamInvitation['team_id']) {
                        $result = $this->teamInvitationService->delete($teamInvitationId);

                        return $result
                            ? $this->responseWithSuccess('invitation.canceled')
                            : $this->responseWithError('Invitation is no existing!', 426);
                    }
                    return $this->responseWithError('It is not your team invitation', 427);
                }

                return $this->responseWithError('Invitation is no existing!');
            }

            if ($this->teamInvitationService->isMyInvitation($teamInvitationId, $userId)) {
                $result = $this->teamInvitationService->delete($teamInvitationId);
                return $result
                    ? $this->responseWithSuccess('invitation.canceled')
                    : $this->responseWithError('Invitation is no existing!');
            }

            return $this->responseWithError('It is not your invitation', 423);
        }

        return $this->responseWithError('You are not registered to any teams!', 424);
    }
}
