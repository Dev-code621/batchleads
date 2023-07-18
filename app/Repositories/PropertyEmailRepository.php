<?php
namespace App\Repositories;

use App\Models\PropertyEmail;

/**
 * Class PropertyEmailRepository
 *
 * @package App\Http\Repositories
 */
class PropertyEmailRepository extends BaseRepository
{
    /**
     * PropertyEmailRepository constructor.
     *
     * @param PropertyEmail $propertyEmail
     */
    public function __construct(PropertyEmail $propertyEmail)
    {
        $this->model = $propertyEmail;
    }

    /**
     * @param array $data
     *
     * @return PropertyEmail|null
     */
    public function create(array $data): ?PropertyEmail
    {
        $propertyEmail = $this->model->newInstance();
        $propertyEmail->email = $data['email'] ?? null;
        $propertyEmail->property_id = $data['property_id'] ?? null;
        $propertyEmail->is_manually_updated	= $data['is_manually_updated'] ?? 1;
        $propertyEmail->type = $data['type'] ?? null;

        return $propertyEmail->save() ? $propertyEmail : null;
    }

    public function update(int $id, array $data)
    {
        $propertyEmail = $this->find($id);
        if ($propertyEmail) {
            $propertyEmail->email = $data['email'] ?? null;
            $propertyEmail->is_manually_updated = $data['is_manually_updated'] ?? 1;
            $propertyEmail->type = $data['type'] ?? null;
        }

        return $propertyEmail ? $propertyEmail->save() : null;
    }

    public function findAllByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->get();
    }

    public function removeAllByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->where('is_manually_updated', 0)->delete();
    }

    public function getCountByPropertyId($propertyId)
    {
        return $this->model->where('property_id', $propertyId)->count();
    }

    public function findAllByPropertyIdAndEmail($propertyId, $email)
    {
        return $this->model->where('property_id', $propertyId)->where('email', $email)->get();
    }
}
