<?php

namespace App\Services;

use App\Repositories\TeamRepository;
use App\Models\Team;
use App\Models\TeamUser;

/**
 * Class TeamService
 *
 * @package App\Http\Services
 */
class TeamService extends BaseService
{
    protected $repository;

    /**
     * TeamService constructor.
     *
     * @param TeamRepository     $repository
     */
    public function __construct(TeamRepository $repository)
    {
        $this->repository = $repository;
    }

    public function read($id, array $relationships = array('owner', 'teamUsers'))
    {
        return $this->repository->find($id, $relationships);
    }

    public function isNameExist($name, $id = 0)
    {
        return $this->repository->isNameExist($name, $id);
    }

    public function isUserRegistered($userId, $id = 0)
    {
        return $this->repository->isUserRegistered($userId, $id);
    }

    public function isTeamExist($teamId)
    {
        return $this->repository->isTeamExist($teamId);
    }

    public function getTeamMembers(array $params)
    {
        return $this->repository->getTeamMembers($params);
    }

    public function findTeamByUserId($userId)
    {
        return $this->repository->findBy('owner_user_id', $userId);
    }

    public function getTeamId($user)
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

    public function getSkipTracingCountByTeamId($teamId)
    {
        $team = $this->read($teamId);
        if ($team) {
            return $team['skip_tracing_count'];
        }

        return 0;
    }
}
