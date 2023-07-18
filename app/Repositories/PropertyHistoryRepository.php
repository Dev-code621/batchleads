<?php
namespace App\Repositories;

use App\Models\PropertyHistory;

/**
 * Class PropertyHistoryRepository
 *
 * @package App\Http\Repositories
 */
class PropertyHistoryRepository extends BaseRepository
{
    /**
     * PropertyHistoryRepository constructor.
     *
     * @param PropertyHistory $propertyHistory
     */
    public function __construct(PropertyHistory $propertyHistory)
    {
        $this->model = $propertyHistory;
    }

    /**
     * @param array $data
     *
     * @return PropertyHistory|null
     */
    public function create(array $data): ?PropertyHistory
    {
        $propertyHistory = $this->model->newInstance();
        $propertyHistory->user_id = $data['user_id'] ?? null;
        $propertyHistory->property_id = $data['property_id'] ?? null;
        $propertyHistory->description = $data['description'] ?? null;
        $propertyHistory->type = $data['type'] ?? 'note';

        return $propertyHistory->save() ? $propertyHistory : null;
    }

    public function update(int $id, array $data)
    {
        $propertyHistory = $this->find($id);
        if ($propertyHistory) {
            $propertyHistory->description = $data['description'] ?? null;
        }

        return $propertyHistory ? $propertyHistory->save() : null;
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
        $perPage = $params['per_page'] ?? 30;
        $search = $params['search'] ?? '';
        $page = $params['page'] ?? null;
        $propertyId = $params['property_id'] ?? null;

        $data = $this->model->where(function($query) use($search) {
            $query->whereRaw('lower(description) like (?)', '%' . strtolower($search) . '%');
        });

        if ($propertyId) {
            $data = $data->where('property_id', $propertyId);
        }

        // $data = $data->with('user');
        // $data = $data->with('property');

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

    public function findAllByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->get();
    }

    public function removeAllByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->delete();
    }
}
