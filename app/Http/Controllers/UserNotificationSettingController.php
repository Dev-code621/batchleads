<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateUserNotificatioinSettingRequest;
use App\Http\Requests\UpdateUserNotificatioinSettingRequest;
use App\Services\UserNotificationSettingService;

/**
 * Class UserNotificationSettingController
 *
 * @package App\Http\Controllers
 */
class UserNotificationSettingController extends Controller
{
    /**
     * constructor.
     *
     * @param UserNotificationSettingService $service
     */
    public function __construct(UserNotificationSettingService $service)
    {
        $this->baseService = $service;
    }

    public function create(CreateUserNotificatioinSettingRequest $request)
    {
        return $this->add($request);
    }

    public function updateSetting(UpdateUserNotificatioinSettingRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $settings = $this->baseService->findWhere(
            array(
                'user_id'           => $user['id'],
                'notification_type' => $data['notification_type']
            )
        );
        if (count($settings)) {
            $id = $settings[0]->id;
            $result = $this->baseService->update($id, $data);

            if ($result) {
                $result = $this->baseService->read($id);
                return $result
                    ? $this->responseWithSuccess($result, 'update.success')
                    : $this->responseWithError(__('error.update.fail'));
            }
        }

        return $this->responseWithError(__('error.update.fail'));
    }
}
