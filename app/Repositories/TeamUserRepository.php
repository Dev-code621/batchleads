<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\TeamUser;

/**
 * Class TeamUserRepository
 *
 * @package App\Http\Repositories
 */
class TeamUserRepository extends BaseRepository
{
    /**
     * TeamUserRepository constructor.
     *
     * @param TeamUser $teamUser
     */
    public function __construct(TeamUser $teamUser)
    {
        $this->model = $teamUser;
    }

    /**
     * @param array $data
     *
     * @return TeamUser|null
     */
    public function create(array $data): ?TeamUser
    {
        $team = $this->model->newInstance();
        $team->team_id = $data['team_id'] ?? null;
        $team->user_id = $data['user_id'] ?? null;
        $team->is_active = $data['is_active'] ?? 0;

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
        $page = $params['page'] ?? null;

        $data = $this->model->with('user')->with('team');

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

    public function isUserRegistered($userId, $teamId)
    {
        $teams = $this->model->where('user_id', $userId);
        $teams = $teams->where('team_id', $teamId)->get();
        if (count($teams) > 0) {
            return true;
        }
        return false;
    }
}
