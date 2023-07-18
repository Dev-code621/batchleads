<?php

namespace App\Services;

use App\Repositories\SmsMessageReceivedPhoneNumberRepository;


/**
 * Class SmsMessageReceivedPhoneNumberService
 *
 * @package App\Http\Services
 */
class SmsMessageReceivedPhoneNumberService extends BaseService
{
    protected $repository;

    /**
     * SmsMessageReceivedPhoneNumberService constructor.
     *
     * @param repository
     */
    public function __construct(SmsMessageReceivedPhoneNumberRepository $repository)
    {
        $this->repository = $repository;
    }
}
