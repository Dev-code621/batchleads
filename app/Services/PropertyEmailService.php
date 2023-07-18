<?php

namespace App\Services;

use App\Repositories\PropertyEmailRepository;


/**
 * Class PropertyEmailService
 *
 * @package App\Http\Services
 */
class PropertyEmailService extends BaseService
{
    protected $propertyEmailRepository;

    /**
     * PropertyEmailService constructor.
     *
     * @param PropertyEmailRepository $propertyEmailRepository
     */
    public function __construct(PropertyEmailRepository $propertyEmailRepository)
    {
        $this->repository = $propertyEmailRepository;
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

    public function findAllByPropertyIdAndEmail($propertyId, $email)
    {
        return $this->repository->findAllByPropertyIdAndEmail($propertyId, $email);
    }
}
