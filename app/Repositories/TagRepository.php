<?php
namespace App\Repositories;

use App\Models\Tag;

/**
 * Class TagRepository
 *
 * @package App\Http\Repositories
 */
class TagRepository extends BaseRepository
{
    /**
     * TagRepository constructor.
     *
     * @param Tag $tag
     */
    public function __construct(Tag $tag)
    {
        $this->model = $tag;
    }

    /**
     * @param array $data
     *
     * @return Tag|null
     */
    public function create(array $data): ?Tag
    {
        $tag = $this->model->newInstance();
        $tag->name = $data['name'] ?? null;
        $tag->user_id = $data['user_id'] ?? 1;
        $tag->team_id = $data['team_id'] ?? null;

        return $tag->save() ? $tag : null;
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
        $perPage = $params['per_page'] ?? 100;
        $search = $params['search'] ?? '';
        $teamId = $params['team_id'] ?? null;
        $userId = $params['user_id'] ?? null;
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
