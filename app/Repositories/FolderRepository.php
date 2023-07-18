<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\Folder;

/**
 * Class FolderRepository
 *
 * @package App\Http\Repositories
 */
class FolderRepository extends BaseRepository
{
    /**
     * FolderRepository constructor.
     *
     * @param Folder $folder
     */
    public function __construct(Folder $folder)
    {
        $this->model = $folder;
    }

    /**
     * @param array $data
     *
     * @return Folder|null
     */
    public function create(array $data): ?Folder
    {
        $folder = $this->model->newInstance();
        $folder->name = $data['name'] ?? null;
        $folder->color = $data['color'] ?? null;
        $folder->icon = $data['icon'] ?? null;
        $folder->user_id = $data['user_id'] ?? null;
        $folder->team_id = $data['team_id'] ?? null;

        return $folder->save() ? $folder : null;
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
        $userId = $params['userId'] ?? null;
        $teamId = $params['team_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = $this->model;
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($search) {
            $data = $data->whereRaw('lower(name) like (?)', '%' . strtolower($search) . '%');
        }

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
