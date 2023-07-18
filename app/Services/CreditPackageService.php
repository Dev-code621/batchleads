<?php

namespace App\Services;

use App\Repositories\CreditPackageRepository;


/**
 * Class CreditPackageService
 *
 * @package App\Http\Services
 */
class CreditPackageService extends BaseService
{
    /**
     * CreditPackageService constructor.
     *
     * @param CreditPackageRepository     $repository
     */
    public function __construct(CreditPackageRepository $repository)
    {
        $this->repository = $repository;
    }
}
