<?php

namespace App\Services;

use App\Repositories\SmsCampaignTemplateDetailRepository;


/**
 * Class SmsCampaignTemplateDetailService
 *
 * @package App\Http\Services
 */
class SmsCampaignTemplateDetailService extends BaseService
{
    protected $repository;

    /**
     * SmsCampaignTemplateDetailService constructor.
     *
     * @param SmsCampaignTemplateDetailRepository $repository
     */
    public function __construct(SmsCampaignTemplateDetailRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getCampaignTemplateDetail(array $params)
    {
        return $this->repository->getCampaignTemplateDetail($params);
    }

    public function checkFurtherDay(array $params)
    {
        return $this->repository->checkFurtherDay($params);
    }

    public function removeByMasterId($masterId)
    {
        return $this->repository->deleteAll(
            array(
                'template_master_id' => $masterId
            )
        );
    }
}
