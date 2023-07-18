<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePropertyTagRequest;
use App\Services\PropertyTagService;
use App\Http\Requests\DefaultIndexRequest;

/**
 * Class PropertyTagController
 *
 * @package App\Http\Controllers
 */
class PropertyTagController extends Controller
{
    /**
     * constructor.
     *
     * @param PropertyTagService $service
     */
    public function __construct(PropertyTagService $service)
    {
        $this->baseService = $service;
    }

    public function index(DefaultIndexRequest $request, $page=1)
    {
        $propertyId = $request->get('property_id') ?? null;
        $pageSize = $request->get('pageSize') ?? 30;
        $orderBy = $request->get('orderBy') ?? 'created_at';
        $order = $request->get('order') ?? 'desc';

        $data = $this->baseService->search(array(
            'property_id'   => $propertyId,
            'per_page'      =>  $pageSize,
            'order_by'      =>  $orderBy,
            'order'         =>  $order,
            'page'          =>  $page
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreatePropertyTagRequest $request)
    {
        return $this->add($request);
    }
}
