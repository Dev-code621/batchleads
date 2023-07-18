<?php

namespace App\Services;

use App\Repositories\TeamInvitationRepository;

/**
 * Class TeamInvitataionService
 *
 * @package App\Http\Services
 */
class TeamInvitationService extends BaseService
{
    /**
     * TeamInvitationService constructor.
     *
     * @param TeamInvitationRepository     $repository
     */
    public function __construct(TeamInvitationRepository $repository)
    {
        $this->repository = $repository;
    }

    public function read($id, array $relationships = array('inviteUser', 'team'))
    {
        return $this->repository->find($id, $relationships);
    }

    public function findUser($email)
    {
        $email = strtolower($email);
        return $this->repository->findBy('email', $email)->first();
    }

    public function isMyInvitation($id, $userId)
    {
        return $this->repository->findWhere(
            array(
                'id'        => $id,
                'user_id'   => $userId
            )
        )->first();
    }
}
