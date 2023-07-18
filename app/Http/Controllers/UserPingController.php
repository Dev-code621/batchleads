<?php
namespace App\Http\Controllers;

use Carbon\Carbon;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserPingRequest;
use App\Http\Requests\UpdateUserPingRequest;
use App\Http\Requests\UserPingRequest;
use App\Http\Requests\GetUserPingRequest;
use App\Services\UserPingService;

/**
 * Class UserPingController
 *
 * @package App\Http\Controllers
 */
class UserPingController extends Controller
{
    protected $baseService;

    /**
     * constructor.
     *
     * @param UserPingService $service
     */
    public function __construct(UserPingService $service)
    {
        $this->baseService = $service;
    }

    public function create(CreateUserPingRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];

        $ping = $this->baseService->getUserPing($userId);
        if ($ping) {
            $this->baseService->delete($ping['id']);
        }

        $data = $request->validated();
        $user = $request->user();
        $data['user_id'] = $user['id'];

        $result = $this->baseService->create($data);

        if ($result) {
            $result['online_status'] = true;
        }

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function update(UpdateUserPingRequest $request, $id)
    {
        return $this->updateData($request, $id);
    }

    public function updateUserPing(UserPingRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $data = $request->validated();

        $routes = null;
        if (array_key_exists('route', $data)) {
            $routes = $data['route'];
        }

        $ping = $this->baseService->getUserPing($userId);
        if ($ping) {
            if ($routes) {
                $currentRoute = $ping['route'];
                if ($currentRoute) {
                    $currentRoute = json_decode($currentRoute, true);
                } else {
                    $currentRoute = [];
                }
                $routes = array_merge($currentRoute, $routes);
                $ping['route'] = $routes;
            } else {
                $ping['route'] = json_decode($ping['route'], true);
            }

            $this->baseService->delete($ping['id']);

            $ping = $this->baseService->create(
                array(
                    'user_id'       => $ping['user_id'],
                    'latitude'      => $data['latitude'],
                    'longitude'     => $data['longitude'],
                    'route'         => $ping['route'],
                    'is_tracking'   => $data['is_tracking']
                )
            );

            if ($ping) {
                $ping = $this->baseService->getUserPing($userId);
                $ping['online_status'] = true;
            }
        } else {
            $data['user_id'] = $userId;
            $ping = $this->baseService->create($data);

            if ($ping) {
                $ping['online_status'] = true;
            }
        }

        return $ping
            ? $this->responseWithSuccess($ping)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function getUserPing(GetUserPingRequest $request)
    {
        $data = $request->validated();
        $ping = $this->baseService->getUserPing($data['user_id']);

        if ($ping) {
            $ping['online_status'] = true;
            $date = Carbon::parse($ping['updated_at']);
            $now = Carbon::now();
            $diff = $date->diffInMinutes($now);
            if ($diff > 5) {
                $ping['online_status'] = false;
            }
        }

        return $ping
            ? $this->responseWithSuccess($ping)
            : $this->responseWithError(__('error.read.fail'));
    }
}
