<?php
namespace App\Repositories;

use App\Models\PropertyImage;

/**
 * Class PropertyImageRepository
 *
 * @package App\Http\Repositories
 */
class PropertyImageRepository extends BaseRepository
{
    /**
     * PropertyImageRepository constructor.
     *
     * @param PropertyImage $propertyImage
     */
    public function __construct(PropertyImage $propertyImage)
    {
        $this->model = $propertyImage;
    }

    /**
     * @param array $data
     *
     * @return PropertyImage|null
     */
    public function create(array $data): ?PropertyImage
    {
        $propertyImage = $this->model->newInstance();
        $propertyImage->url = $data['url'] ?? null;
        $propertyImage->property_id = $data['property_id'] ?? null;
        $propertyImage->is_location_image = $data['is_location_image'] ?? null;

        return $propertyImage->save() ? $propertyImage : null;
    }

    public function update(int $id, array $data)
    {
        $propertyImage = $this->find($id);
        if ($propertyImage) {
            $propertyImage->url = $data['url'] ?? null;
            $propertyImage->property_id = $data['property_id'] ?? null;
        }

        return $propertyImage ? $propertyImage->save() : null;
    }

    public function findAllByPropertyId($propertyId)
    {
        return PropertyImage::where('property_id', $propertyId)->get();
    }

    public function removeAllByPropertyId($propertyId)
    {
        return PropertyImage::where('property_id', $propertyId)->delete();
    }
}
