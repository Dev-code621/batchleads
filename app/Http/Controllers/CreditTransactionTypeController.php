<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCreditTransactionTypeRequest;
use App\Http\Requests\UpdateCreditTransactionTypeRequest;
use App\Services\CreditTransactionTypeService;

/**
 * Class CreditTransactionTypeController
 *
 * @package App\Http\Controllers
 */
class CreditTransactionTypeController extends Controller
{
    /**
     * constructor.
     *
     * @param CreditTransactionTypeService $service
     */
    public function __construct(CreditTransactionTypeService $service)
    {
        $this->baseService = $service;
    }

    public function create(CreateCreditTransactionTypeRequest $request)
    {
        $data = $request->validated();
        $transactionType = $data['transaction_type'];
        $transactionTypes = $this->baseService->findByTransactionType($transactionType);
        if (count($transactionTypes) > 0) {
            return $this->responseWithError('transaction.type.already.registered', 421);
        }

        $result = $this->baseService->create($data);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError('create.fail');
    }

    public function update(UpdateCreditTransactionTypeRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }
}
