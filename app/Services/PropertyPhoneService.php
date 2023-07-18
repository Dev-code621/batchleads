<?php

namespace App\Services;

use App\Repositories\PropertyPhoneRepository;


/**
 * Class PropertyPhoneService
 *
 * @package App\Http\Services
 */
class PropertyPhoneService extends BaseService
{
    protected $repository;
    protected $propertyPhoneRepository;

    /**
     * PropertyPhoneService constructor.
     *
     * @param PropertyPhoneRepository $propertyPhoneRepository
     */
    public function __construct(PropertyPhoneRepository $propertyPhoneRepository)
    {
        $this->repository = $propertyPhoneRepository;
    }

    public function findAllByPropertyId($propertyId)
    {
        return $this->repository->findAllByPropertyId($propertyId);
    }

    public function removeAllByPropertyId($propertyId)
    {
        return $this->repository->removeAllByPropertyId($propertyId);
    }

    public function getCountByPropertyId($propertyId)
    {
        return $this->repository->getCountByPropertyId($propertyId);
    }

    public function findAllByPropertyIdAndPhoneNumber($propertyId, $phoneNumber)
    {
        return $this->repository->findAllByPropertyIdAndPhoneNumber($propertyId, $phoneNumber);
    }

    public function getPropertiesByPhoneNumber($userId, $phoneNumber)
    {
        return $this->repository->getPropertiesByPhoneNumber($userId, $phoneNumber);
    }

    public function getAll()
    {
        return $this->repository->findWhere(array());
    }
}
