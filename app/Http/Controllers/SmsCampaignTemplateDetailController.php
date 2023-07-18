<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateSmsCampaignTemplateDetailRequest;
use App\Http\Requests\UpdateSmsCampaignTemplateDetailRequest;
use App\Services\SmsCampaignTemplateDetailService;

/**
 * Class SmsCampaignTemplateDetailController
 *
 * @package App\Http\Controllers
 */
class SmsCampaignTemplateDetailController extends Controller
{
  /**
   * constructor.
   *
   * @param SmsCampaignTemplateDetailService $service
   */
  public function __construct(SmsCampaignTemplateDetailService $service)
  {
    $this->baseService = $service;
  }

  public function create(CreateSmsCampaignTemplateDetailRequest $request)
  {
    return $this->add($request);
  }

  public function update(UpdateSmsCampaignTemplateDetailRequest $request, $id)
  {
    return $this->updateData($request, $id);
  }
}
