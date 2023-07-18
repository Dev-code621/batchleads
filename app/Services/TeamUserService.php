<?php

namespace App\Services;

use App\Repositories\TeamUserRepository;
use App\Repositories\TeamInvitationRepository;
use App\Models\TeamInvitation;
use App\Mail\TeamUserInvitation;
use Mail;

/**
 * Class TeamUserService
 *
 * @package App\Http\Services
 */
class TeamUserService extends BaseService
{
    protected $twilioService;
    protected $teamInvitationRepository;

    /**
     * TeamUserService constructor.
     *
     * @param TeamUserRepository     $repository
     */
    public function __construct(
        TeamUserRepository $repository,
        TwilioService $twilioService,
        TeamInvitationRepository $teamInvitationRepository
    )
    {
        $this->repository = $repository;
        $this->twilioService = $twilioService;
        $this->teamInvitationRepository = $teamInvitationRepository;
    }

    public function read($id, array $relationships = array('user'))
    {
        return $this->repository->find($id, $relationships);
    }

    public function isUserRegistered($userId, $teamId)
    {
        return $this->repository->isUserRegistered($userId, $teamId);
    }

    public function findByUserId($userId)
    {
        return $this->repository->findBy('user_id', $userId);
    }

    public function sendInvitationLink($team, $user, $email)
    {
        $teamId = $team->id;
        $token = $this->twilioService->createToken();
        $tokenToSend = base64_encode($email . ':' . $teamId . ':' . $token);
        $email = strtolower($email);
        $this->teamInvitationRepository->create(
            array(
                'user_id'   => $user['id'],
                'email'     => $email,
                'token'     => $token,
                'team_id'   => $teamId
            )
        );

        Mail::to($email)->send(new TeamUserInvitation($user, $tokenToSend));

        return true;
    }

    public function getTeamUsersCount($teamId) {
        $teamUsers = $this->repository->findBy('team_id', $teamId);
        $pendingMemberCount = TeamInvitation::where('team_id', $teamId)->count();
        return count($teamUsers) + $pendingMemberCount;
    }

    public function getOwnerUserId($userId)
    {
        $teamUsers = $this->findByUserId($userId);
        if (count($teamUsers) > 0) {
            $team = $teamUsers[0]->team;
            $ownerUserId = $team->owner_user_id;
            return $ownerUserId;
        }
        return 0;
    }
}
