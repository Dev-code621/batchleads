<?php

namespace App\Services;

use App\Repositories\CreditTransactionTypeRepository;


/**
 * Class CreditTransactionTypeService
 *
 * @package App\Http\Services
 */
class CreditTransactionTypeService extends BaseService
{
    /**
     * CreditTransactionTypeService constructor.
     *
     * @param CreditTransactionTypeRepository     $repository
     */
    public function __construct(CreditTransactionTypeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function findByTransactionType($transactionType)
    {
        return $this->repository->findBy('transaction_type', $transactionType);
    }
}
