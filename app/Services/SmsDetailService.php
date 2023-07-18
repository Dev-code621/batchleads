<?php

namespace App\Services;

use App\Repositories\SmsDetailRepository;


/**
 * Class SmsDetailService
 *
 * @package App\Http\Services
 */
class SmsDetailService extends BaseService
{
    protected $repository;

    /**
     * SmsMasterService constructor.
     *
     * @param repository
     */
    public function __construct(SmsDetailRepository $repository)
    {
        $this->repository = $repository;
    }
}
