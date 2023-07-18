<?php
namespace App\Repositories;

use App\Models\PropertyPhone;

/**
 * Class PropertyPhoneRepository
 *
 * @package App\Http\Repositories
 */
class PropertyPhoneRepository extends BaseRepository
{
    /**
     * PropertyPhoneRepository constructor.
     *
     * @param PropertyPhone $propertyPhone
     */
    public function __construct(PropertyPhone $propertyPhone)
    {
        $this->model = $propertyPhone;
    }

    /**
     * @param array $data
     *
     * @return PropertyPhone|null
     */
    public function create(array $data): ?PropertyPhone
    {
        $propertyPhone = $this->model->newInstance();
        $propertyPhone->phone_number = $data['phone_number'] ?? null;
        $propertyPhone->property_id = $data['property_id'] ?? null;
        $propertyPhone->is_manually_updated	= $data['is_manually_updated'] ?? 1;
        $propertyPhone->type = $data['type'] ?? null;

        return $propertyPhone->save() ? $propertyPhone : null;
    }

    public function update(int $id, array $data)
    {
        $propertyPhone = $this->find($id);
        if ($propertyPhone) {
            $propertyPhone->phone_number = $data['phone_number'] ?? null;
            $propertyPhone->is_manually_updated = $data['is_manually_updated'] ?? 1;
            $propertyPhone->type = $data['type'] ?? null;
        }

        return $propertyPhone ? $propertyPhone->save() : null;
    }

    public function findAllByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)
            ->where('type', 'Mobile')
            ->skip(0)
            ->take(3)
            ->get();
    }

    public function removeAllByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->where('is_manually_updated', 0)->delete();
    }

    public function getCountByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->count();
    }

    public function findAllByPropertyIdAndPhoneNumber($propertyId, $phoneNumber)
    {
        return $this->model->where('property_id', $propertyId)
            ->where('phone_number', $phoneNumber)
            ->get();
    }

    public function getPropertiesByPhoneNumber($userId, $phoneNumber)
    {
        $result = $this->model->where('phone_number', $phoneNumber);
        $result = $result->where('type', 'Mobile');
        $result = $result->with('property');
        $result = $result->whereHas('property', function($query) use($userId) {
            $query = $query->where('user_id', $userId);
        });

        return $result->get();
    }
}
