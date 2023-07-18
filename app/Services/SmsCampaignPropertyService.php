<?php

namespace App\Services;

use App\Repositories\SmsCampaignPropertyRepository;


/**
 * Class SmsCampaignPropertyService
 *
 * @package App\Http\Services
 */
class SmsCampaignPropertyService extends BaseService
{
    protected $repository;
    protected $smsCampaignPropertyRepository;

    /**
     * PropertyPhoneService constructor.
     *
     * @param SmsCampaignPropertyRepository $smsCampaignPropertyRepository
     */
    public function __construct(SmsCampaignPropertyRepository $smsCampaignPropertyRepository)
    {
        $this->repository = $smsCampaignPropertyRepository;
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
