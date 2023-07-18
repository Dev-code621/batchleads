<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateMailTemplateSectionRequest;
use App\Http\Requests\UpdateMailTemplateSectionRequest;
use App\Services\MailTemplateSectionService;

/**
 * Class MailTemplateSectionController
 *
 * @package App\Http\Controllers
 */
class MailTemplateSectionController extends Controller
{
  /**
   * constructor.
   *
   * @param MailTemplateSectionService $service
   */
  public function __construct(MailTemplateSectionService $service)
  {
    $this->baseService = $service;
  }

  public function create(CreateMailTemplateSectionRequest $request)
  {
    return $this->add($request);
  }

  public function update(UpdateMailTemplateSectionRequest $request, $id)
  {
    return $this->updateData($request, $id);
  }
}
