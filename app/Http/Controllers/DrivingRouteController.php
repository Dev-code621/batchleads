<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateDrivingRouteRequest;
use App\Http\Requests\UpdateDrivingRouteRequest;
use App\Http\Requests\DefaultIndexRequest;
use App\Http\Requests\GetDrivingRoutesRequest;
use App\Services\DrivingRouteService;

/**
 * Class DrivingRouteController
 *
 * @package App\Http\Controllers
 */
class DrivingRouteController extends Controller
{
    /**
     * constructor.
     *
     * @param DrivingRouteService $drivingRouteService
     */
    public function __construct(DrivingRouteService $drivingRouteService)
    {
        $this->baseService = $drivingRouteService;
    }

    // search recent 30 days
    public function index(DefaultIndexRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $teamId = $this->getTeamId($user);

        $data = $this->baseService->search(array(
            'per_page'  =>  $pageSize,
            'order_by'  =>  $orderBy,
            'order'     =>  $order,
            'search'    =>  $search,
            // 'userId'    =>  $user['id'],
            'team_id'   =>  $teamId,
            'page'      =>  $page
        ));

        if ($data) {
            $result = array(
                'recent_total'      => array(
                    'trips' => $data['trips'],
                    'miles' => $data['miles']
                ),
                'page'              => $page,
                'count_per_page'    => $pageSize,
                'data'              => $data['data']
            );
        }

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function list(GetDrivingRoutesRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $date = $data['date'] ?? '';
        $userId = $data['user_id'] ?? '';
        $miles = $data['miles'] ?? '';
        $isProperties = $data['is_properties'] ?? '';
        $routeType = $data['route_type'] ?? '';
        $neLat = $data['ne_lat'] ?? null;
        $neLon = $data['ne_lon'] ?? null;
        $swLat = $data['sw_lat'] ?? null;
        $swLon = $data['sw_lon'] ?? null;
        $teamId = $this->getTeamId($user);

        $data = $this->baseService->search(array(
            'per_page'      =>  $pageSize,
            'order_by'      =>  $orderBy,
            'order'         =>  $order,
            'search'        =>  $search,
            // 'userId'    =>  $user['id'],
            'team_id'       =>  $teamId,
            'date'          => $date,
            'user_id'       => $userId,
            'miles'         => $miles,
            'is_properties' => $isProperties,
            'route_type'    => $routeType,
            'ne_lat'        => $neLat,
            'ne_lon'        => $neLon,
            'sw_lat'        => $swLat,
            'sw_lon'        => $swLon,
            'page'          =>  $page
        ));

        if ($data) {
            $result = array(
                'recent_total'      => array(
                    'trips' => $data['trips'],
                    'miles' => $data['miles']
                ),
                'page'              => $page,
                'count_per_page'    => $pageSize,
                'data'              => $data['data']
            );
        }

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreateDrivingRouteRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdateDrivingRouteRequest $request, $drivingRouteId)
    {
        return $this->updateData($request, $drivingRouteId);
    }
}
