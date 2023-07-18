<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\KpiRequest;
use App\Services\KpiService;

/**
 * Class KpiController
 *
 * @package App\Http\Controllers
 */
class KpiController extends Controller
{
    protected $baseService;
    /**
     * constructor.
     *
     * @param KpiService $service
     */
    public function __construct(KpiService $service)
    {
        $this->baseService = $service;
    }

    public function getKpis(KpiRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $data['request_user'] = $user;
        $result = $this->baseService->getKpis($data);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.list.fail'));
    }
}
