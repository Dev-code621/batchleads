<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCreditPackageRequest;
use App\Http\Requests\UpdateCreditPackageRequest;
use App\Services\CreditPackageService;

/**
 * Class CreditPackageController
 *
 * @package App\Http\Controllers
 */
class CreditPackageController extends Controller
{
    /**
     * constructor.
     *
     * @param CreditPackageService $creditPackageService
     */
    public function __construct(CreditPackageService $creditPackageService)
    {
        $this->baseService = $creditPackageService;
    }

    public function create(CreateCreditPackageRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdateCreditPackageRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }
}
