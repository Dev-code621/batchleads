<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\Team;
use App\Models\TeamInvitation;

/**
 * Class TeamRepository
 *
 * @package App\Http\Repositories
 */
class TeamRepository extends BaseRepository
{
    /**
     * TeamRepository constructor.
     *
     * @param Team $team
     */
    public function __construct(Team $team)
    {
        $this->model = $team;
    }

    /**
     * @param array $data
     *
     * @return Team|null
     */
    public function create(array $data): ?Team
    {
        $team = $this->model->newInstance();
        $team->owner_user_id = $data['owner_user_id'] ?? null;

        return $team->save() ? $team : null;
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = $params['orderBy'] ?? 'created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? '';
        $page = $params['page'] ?? null;

        $data = $this->model->with('adminUser');
        $data = $data->with('teamUsers');

        $total = $data->count();
        $data = $data->orderBy($orderBy, $order)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $result = array(
            'total'          => $total,
            'page'           => $page,
            'count_per_page' => $perPage,
            'count'          => $data->count(),
            'data'           => $data,
        );

        return $result;
    }

    public function getTeamMembers(array $params)
    {
        $orderBy = $params['orderBy'] ?? 'created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 30;
        $search = $params['search'] ?? '';
        $page = $params['page'] ?? null;
        $teamId = $params['team_id'] ?? null;

        $data = $this->model->where('id', $teamId);
        $team = $data->first();
        if (!$team) {
            return null;
        }

        $data = $data->with('owner')->first();
        $teamAdmins = $data->teamUsers()->whereHas('user', function($query) {
            $query->where('role', 'admin');
        });
        $teamAdmins = $teamAdmins->with('user')->get();

        $teamMembers = $data->teamUsers()->whereHas('user', function($query) {
            $query->where('role', 'member');
        });
        $teamMembers = $teamMembers->with('user')->get();

        $pendingMembers = TeamInvitation::where('team_id', $teamId)->with('inviteUser')->get();

        return array(
            'owner'             => $data->owner,
            'admins'            => $teamAdmins,
            'members'           => $teamMembers,
            'pending_members'   => $pendingMembers
        );
    }

    public function isNameExist($name, $id)
    {
        $teams = Team::where('name', $name);
        $teams = $teams->where('id', '!=', $id)->get();
        if (count($teams) > 0) {
            return true;
        }
        return false;
    }

    public function isUserRegistered($userId, $id)
    {
        $teams = $this->model->where('owner_user_id', $userId);
        $teams = $teams->where('id', '!=', $id)->get();
        if (count($teams) > 0) {
            return true;
        }
        return false;
    }

    public function isTeamExist($teamId)
    {
        $team = $this->find($teamId);
        if($team) {
            return true;
        }
        return false;
    }
}
