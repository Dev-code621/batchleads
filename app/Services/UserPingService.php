<?php

namespace App\Services;

use App\Repositories\UserPingRepository;


/**
 * Class UserPingService
 *
 * @package App\Http\Services
 */
class UserPingService extends BaseService
{
    /**
     * UserPingService constructor.
     *
     * @param UserPingRepository     $repository
     */
    public function __construct(UserPingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getUserPing($userId)
    {
        return $this->repository->findWhere(
            array(
                'user_id'   => $userId
            )
        )->first();
    }
}
