<?php

namespace App\Services;

use App\Repositories\MailCampaignRepeatRepository;


/**
 * Class MailCampaignRepeatService
 *
 * @package App\Http\Services
 */
class MailCampaignRepeatService extends BaseService
{
    protected $repository;

    /**
     * MailCampaignRepeatService constructor.
     *
     * @param MailCampaignRepeatRepository $repository
     */
    public function __construct(MailCampaignRepeatRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getRepeats(array $where = [])
    {
        return $this->repository->getRepeats($where);
    }

    public function findAllByCampaignId($campaignId)
    {
        return $this->repository->findAllByCampaignId($campaignId);
    }
}
