<?php

namespace App\Services;

use App\Repositories\ZapierSubscribeRepository;


/**
 * Class ZapierSubscribeService
 *
 * @package App\Http\Services
 */
class ZapierSubscribeService extends BaseService
{
    /**
     * ZapierSubscribeService constructor.
     *
     * @param ZapierSubscribeRepository     $repository
     */
    public function __construct(ZapierSubscribeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getUserZapierSubscribes($userId, $type)
    {
        return $this->repository->findWhere(
            array(
                'user_id'   => $userId,
                'type'      => $type
            )
        );
    }
}
