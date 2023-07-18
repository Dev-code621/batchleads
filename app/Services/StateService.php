<?php

namespace App\Services;

use App\Repositories\StateRepository;


/**
 * Class StateService
 *
 * @package App\Http\Services
 */
class StateService extends BaseService
{
    protected $repository;

    /**
     * StateService constructor.
     *
     * @param repository
     */
    public function __construct(StateRepository $repository)
    {
        $this->repository = $repository;
    }
}
