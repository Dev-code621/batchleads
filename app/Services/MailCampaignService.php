<?php

namespace App\Services;

use App\Repositories\MailCampaignRepository;


/**
 * Class MailCampaignService
 *
 * @package App\Http\Services
 */
class MailCampaignService extends BaseService
{
    protected $repository;

    /**
     * SmsCampaignService constructor.
     *
     * @param repository
     */
    public function __construct(MailCampaignRepository $repository)
    {
        $this->repository = $repository;
    }

    public function read($id, array $relationships = array('mailCampaignProperties'))
    {
        return $this->repository->find($id, $relationships);
    }

    public function getCampaigns(array $params)
    {
        $campaigns = $this->repository->getCampaigns($params);
        return $campaigns;
    }

    public function getCampaignsByTemplateId($templateId)
    {
        return $this->repository->getCampaignsByTemplateId($templateId);
    }

    public function findNotCancelledCountByPropertyId($propertyId)
    {
        return $this->repository->findNotCancelledCountByPropertyId($propertyId);
    }
}
