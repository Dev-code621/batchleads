<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePropertyHistoryRequest;
use App\Http\Requests\UpdatePropertyHistoryRequest;
use App\Http\Requests\GetPropertyHistoriesRequest;
use App\Services\PropertyHistoryService;

/**
 * Class PropertyHistoryController
 *
 * @package App\Http\Controllers
 */
class PropertyHistoryController extends Controller
{
    /**
     * constructor.
     *
     * @param PropertyHistoryService $propertyHistoryService
     */
    public function __construct(PropertyHistoryService $propertyHistoryService)
    {
        $this->baseService = $propertyHistoryService;
    }

    public function list(GetPropertyHistoriesRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $request->get('pageSize') ?? 30;
        $orderBy = $request->get('orderBy') ?? 'created_at';
        $order = $request->get('order') ?? 'desc';
        $search = $request->get('search') ?? '';
        $propertyId = $request->get('property_id') ?? null;

        $data = $this->baseService->search(array(
            'per_page'          =>  $pageSize,
            'order_by'          =>  $orderBy,
            'order'             =>  $order,
            'search'            =>  $search,
            'page'              =>  $page,
            'property_id'       =>  $propertyId,
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreatePropertyHistoryRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdatePropertyHistoryRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }
}
