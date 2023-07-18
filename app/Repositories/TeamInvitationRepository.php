<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\TeamInvitation;

/**
 * Class TeamInvitationRepository
 *
 * @package App\Http\Repositories
 */
class TeamInvitationRepository extends BaseRepository
{
    /**
     * TeamInvitationRepository constructor.
     *
     * @param TeamInvitation $model
     */
    public function __construct(TeamInvitation $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return TeamInvitation|null
     */
    public function create(array $data): ?TeamInvitation
    {
        $team = $this->model->newInstance();
        $team->team_id = $data['team_id'] ?? null;
        $team->user_id = $data['user_id'] ?? null;
        $team->email = $data['email'] ?? null;
        $team->token = $data['token'] ?? null;
        $team->team_id = $data['team_id'] ?? null;

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
}
