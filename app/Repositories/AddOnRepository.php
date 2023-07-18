<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\AddOn;

/**
 * Class AddOnRepository
 *
 * @package App\Http\Repositories
 */
class AddOnRepository extends BaseRepository
{
    /**
     * AddOnRepository constructor.
     *
     * @param AddOn $model
     */
    public function __construct(AddOn $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return AddOnRepository|null
     */
    public function create(array $data): ?AddOn
    {
        $addon = $this->model->newInstance();
        $addon->add_on = $data['add_on'] ?? null;
        $addon->user_id = $data['user_id'] ?? null;
        $addon->team_id = $data['team_id'] ?? null;

        return $addon->save() ? $addon : null;
    }

    public function getAddOnsByTeamId($teamId)
    {
        return $this->findWhere(
            array(
                'team_id'   => $teamId
            )
        );
    }
}
