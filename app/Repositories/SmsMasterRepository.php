<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\SmsMaster;

/**
 * Class SmsMasterRepository
 *
 * @package App\Http\Repositories
 */
class SmsMasterRepository extends BaseRepository
{
    /**
     * SmsMasterRepository constructor.
     *
     * @param SmsMaster $smsMaster
     */
    public function __construct(SmsMaster $smsMaster)
    {
        $this->model = $smsMaster;
    }

    /**
     * @param array $data
     *
     * @return SmsMaster|null
     */
    public function create(array $data): ?SmsMaster
    {
        $smsMaster = $this->model->newInstance();
        $smsMaster->user_id = $data['user_id'] ?? null;
        $smsMaster->phone_number = $data['phone_number'] ?? null;
        $smsMaster->latest_message = $data['latest_message'] ?? null;
        $smsMaster->badge_number = $data['badge_number'] ?? 0;

        return $smsMaster->save() ? $smsMaster : null;
    }

    public function increaseBadge($id)
    {
        return $this->find($id)->increment('badge_number');
    }

    public function decreaseBadge($id)
    {
        return $this->find($id)->decrement('badge_number');
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = $params['order_by'] ?? 'id';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? '';
        $userId = $params['user_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = $this->model;
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($search) {
            $data = $data->whereRaw('lower(latest_message) like (?)', '%' . strtolower($search) . '%');
        }
        $data = $data->whereHas('smsDetails');

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

    public function getTotalBadge($userId)
    {
        $data = $this->model->where('user_id', $userId)->sum('badge_number');

        return $data;
    }
}
