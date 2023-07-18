<?php

namespace App\Services;

use App\Repositories\PropertyHistoryRepository;


/**
 * Class PropertyHistoryService
 *
 * @package App\Http\Services
 */
class PropertyHistoryService extends BaseService
{
    protected $propertyHistoryRepository;

    /**
     * PropertyEmailService constructor.
     *
     * @param PropertyHistoryRepository $propertyHistoryRepository
     */
    public function __construct(PropertyHistoryRepository $propertyHistoryRepository)
    {
        $this->repository = $propertyHistoryRepository;
    }

    public function findAllByPropertyId($propertyId)
    {
        return $this->repository->findAllByPropertyId($propertyId);
    }

    public function removeAllByPropertyId($propertyId)
    {
        return $this->repository->removeAllByPropertyId($propertyId);
    }
}
