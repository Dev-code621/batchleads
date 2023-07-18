<?php

namespace App\Services;

use App\Repositories\MailSignatureRepository;


/**
 * Class MailSignatureService
 *
 * @package App\Http\Services
 */
class MailSignatureService extends BaseService
{
  protected $repository;

  /**
   * MailSignatureService constructor.
   *
   * @param MailSignatureRepository $repository
   */
  public function __construct(MailSignatureRepository $repository)
  {
      $this->repository = $repository;
  }
}
