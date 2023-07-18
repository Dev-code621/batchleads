<?php
namespace App\Repositories;

use App\Models\SkipTracing;

/**
 * Class SkipTracingRepository
 *
 * @package App\Http\Repositories
 */
class SkipTracingRepository extends BaseRepository
{
    /**
     * SkipTracingRepository constructor.
     *
     * @param SkipTracing $skipTracing
     */
    public function __construct(SkipTracing $skipTracing)
    {
        $this->model = $skipTracing;
    }

    /**
     * @param array $data
     *
     * @return SkipTracing|null
     */
    public function create(array $data): ?SkipTracing
    {
        $skipTracing = $this->model->newInstance();
        $skipTracing->email = $data['email'] ?? null;
        $skipTracing->phone_number = $data['phone_number'] ?? null;
        $skipTracing->property_id = $data['property_id'] ?? null;

        return $skipTracing->save() ? $skipTracing : null;
    }

    public function findAllByPropertyId($propertyId)
    {
        return SkipTracing::where('property_id', $propertyId)->get();
    }
}
