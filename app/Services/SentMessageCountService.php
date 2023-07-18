<?php

namespace App\Services;

use App\Repositories\SentMessageCountRepository;

/**
 * Class SentMessageCountService
 *
 * @package App\Http\Services
 */
class SentMessageCountService extends BaseService
{
    protected $repository;

    /**
     * SentMessageCountService constructor.
     *
     * @param $repository
     */
    public function __construct(SentMessageCountRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getSentMessageCount($userId)
    {
        $countInfos = $this->findWhere(
            array(
                'user_id' => $userId
            )
        );

        if (count($countInfos)) {
            return $countInfos[0]['count'];
        }

        return 0;
    }

    public function increaseSentMessageCount($userId)
    {
        $countInfos = $this->findWhere(
            array('user_id' => $userId)
        );
        if (count($countInfos) > 0) {
            $count = intval($countInfos[0]['count']) + 1;
            return $this->update($countInfos[0]['id'], array('count' => $count));
        }

        return $this->create(
            array(
                'user_id'   => $userId,
                'count'     => 1
            )
        );
    }
}
