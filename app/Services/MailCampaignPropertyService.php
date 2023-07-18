<?php

namespace App\Services;

use App\Repositories\MailCampaignPropertyRepository;


/**
 * Class MailCampaignPropertyService
 *
 * @package App\Http\Services
 */
class MailCampaignPropertyService extends BaseService
{
    protected $repository;

    /**
     * MailCampaignPropertyService constructor.
     *
     * @param MailCampaignPropertyRepository $mailCampaignPropertyRepository
     */
    public function __construct(MailCampaignPropertyRepository $mailCampaignPropertyRepository)
    {
        $this->repository = $mailCampaignPropertyRepository;
    }

    public function setDeliveredByPostCardId($postCardId)
    {
        return $this->repository->setDeliveredByPostCardId($postCardId);
    }

    public function findAllByCampaignId($campaignId)
    {
        return $this->repository->findAllByCampaignId($campaignId);
    }

    public function removeIfCancelledCampaignProperties($propertyIds)
    {
        return $this->repository->removeIfCancelledCampaignProperties($propertyIds);
    }
}
