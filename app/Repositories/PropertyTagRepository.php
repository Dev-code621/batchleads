<?php
namespace App\Repositories;

use App\Models\PropertyTag;

/**
 * Class TagRepository
 *
 * @package App\Http\Repositories
 */
class PropertyTagRepository extends BaseRepository
{
    /**
     * TagRepository constructor.
     *
     * @param PropertyTag $propertyTag
     */
    public function __construct(PropertyTag $propertyTag)
    {
        $this->model = $propertyTag;
    }

    /**
     * @param array $data
     *
     * @return PropertyTag|null
     */
    public function create(array $data): ?PropertyTag
    {
        $tag = $this->model->newInstance();
        $tag->property_id = $data['property_id'] ?? 1;
        $tag->tag_id = $data['tag_id'] ?? null;

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
        $propertyId = $params['property_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = $this->model;
        if ($propertyId) {
            $data = $data->where('property_id', $propertyId);
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
