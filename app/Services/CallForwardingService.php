<?php

namespace App\Services;

use App\Repositories\CallForwardingRepository;


/**
 * Class CallForwardingService
 *
 * @package App\Http\Services
 */
class CallForwardingService extends BaseService
{
    /**
     * CallForwardingService constructor.
     *
     * @param CallForwardingRepository     $repository
     */
    public function __construct(CallForwardingRepository $repository)
    {
        $this->repository = $repository;
    }
}
