<?php

namespace App\Services;

use App\Repositories\AddOnRepository;


/**
 * Class AddOnService
 *
 * @package App\Http\Services
 */
class AddOnService extends BaseService
{
    protected $repository;

    /**
     * AddOnService constructor.
     *
     * @param AddOnRepository     $repository
     */
    public function __construct(AddOnRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAddOnsByTeamId($teamId)
    {
        return $this->repository->getAddOnsByTeamId($teamId);
    }
}
