<?php

namespace App\Services;

use App\Repositories\SmsCampaignTemplateMasterRepository;


/**
 * Class SmsCampaignTemplateMasterService
 *
 * @package App\Http\Services
 */
class SmsCampaignTemplateMasterService extends BaseService
{
  protected $repository;

  /**
   * SmsCampaignTemplateMasterService constructor.
   *
   * @param SmsCampaignTemplateMasterRepository $repository
   */
  public function __construct(SmsCampaignTemplateMasterRepository $repository)
  {
      $this->repository = $repository;
  }
}
