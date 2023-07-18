<?php

namespace App\Services;

use App\Mail\UserCancel;
use App\Repositories\UserCancelRepository;
use Mail;

/**
 * Class UserCancelService
 *
 * @package App\Http\Services
 */
class UserCancelService extends BaseService
{
    protected $repository;
    protected $userService;

    /**
     * UserCancelService constructor.
     *
     * @param $repository
     */
    public function __construct(
        UserCancelRepository $repository,
        UserService $userService
    )
    {
        $this->repository = $repository;
        $this->userService = $userService;
    }

    public function sendCancelInfoEmail($user)
    {
        Mail::to($user['email'])->send(new UserCancel('Your data will be remmoved in 30 days!'));
    }

    public function isSelfCancelled($user)
    {
        $ownerUser = $this->userService->getOwnerUser($user);

        if ($ownerUser) {
            $cancelInfos = $this->repository->findWhere(
                array(
                    'user_id' => $ownerUser['id']
                )
            );

            if (count($cancelInfos)) {
                return $cancelInfos[0]['active'] ? $cancelInfos[0]['active'] : false;
            }

            return false;
        }

        return true;
    }
}
