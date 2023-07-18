<?php

namespace App\Services;

use App\Repositories\PropertyTagRepository;


/**
 * Class PropertyTagService
 *
 * @package App\Http\Services
 */
class PropertyTagService extends BaseService
{
    protected $repository;

    /**
     * PropertyTagService constructor.
     *
     * @param repository
     */
    public function __construct(PropertyTagRepository $repository)
    {
        $this->repository = $repository;
    }
}
