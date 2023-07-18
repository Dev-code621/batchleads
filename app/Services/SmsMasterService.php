<?php

namespace App\Services;

use App\Repositories\SmsMasterRepository;


/**
 * Class SmsMasterService
 *
 * @package App\Http\Services
 */
class SmsMasterService extends BaseService
{
    protected $repository;

    /**
     * SmsMasterService constructor.
     *
     * @param repository
     */
    public function __construct(SmsMasterRepository $repository)
    {
        $this->repository = $repository;
    }

    public function increaseBadge($id)
    {
        return $this->repository->increaseBadge($id);
    }

    public function decreaseBadge($id)
    {
        return $this->repository->decreaseBadge($id);
    }

    public function resetBadge($id)
    {
        return $this->repository->update($id, array('badge_number' => 0));
    }

    public function getTotalBadge($userId)
    {
        return $this->repository->getTotalBadge($userId);
    }
}
