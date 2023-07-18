<?php

namespace App\Services;

use App\Repositories\PropertyImageRepository;
use App\Http\Helpers\UrlSignHelper;

/**
 * Class PropertyImageService
 *
 * @package App\Http\Services
 */
class PropertyImageService extends BaseService
{
    protected $repository;
    protected $propertyImageRepository;

    /**
     * PropertyImageService constructor.
     *
     * @param PropertyImageRepository $propertyImageRepository
     */
    public function __construct(PropertyImageRepository $propertyImageRepository)
    {
        $this->repository = $propertyImageRepository;
    }

    public function findAllByPropertyId($propertyId)
    {
        return $this->repository->findAllByPropertyId($propertyId);
    }

    public function getStreetViewImage($propertyId)
    {
        $images = $this->repository->findWhere(
            array(
                'property_id'       => $propertyId,
                'is_location_image' => 1
            )
        );
        if (count($images)) {
            return $images[0]['url'];
        }

        return null;
    }

    public function deleteWhere(array $where = [])
    {
        return $this->repository->deleteAll($where);
    }

    public function removeAllByPropertyId($propertyId)
    {
        return $this->repository->removeAllByPropertyId($propertyId);
    }

    public function createStreetViewImage($propertyId, $latitude, $longitude)
    {
        return $this->create(
            array(
                'property_id'       => $propertyId,
                'url'               => $this->getStreetViewImageUrl($latitude, $longitude),
                'is_location_image' => 1,
            )
        );
    }

    public function getStreetViewImageUrl($latitude, $longitude)
    {
        $url = 'https://maps.googleapis.com/maps/api/streetview?location=' . $latitude . ',' . $longitude . '&size=456x456&key=' . config('services.google_map.api_key');
        return UrlSignHelper::signUrl($url, config('services.google_map.api_secret'));
    }
}
