<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAutoRechargeSettingRequest;
use App\Services\AutoRechargeSettingService;

/**
 * Class AutoRechargeSettingController
 *
 * @package App\Http\Controllers
 */
class AutoRechargeSettingController extends Controller
{
    /**
     * constructor.
     *
     * @param AddOnService $service
     */
    public function __construct(AutoRechargeSettingService $service)
    {
        $this->baseService = $service;
    }

    public function updateSetting(UpdateAutoRechargeSettingRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $data['user_id'] = $user['id'];
        $teamId = $this->getTeamId($user);
        $data['team_id'] = $teamId;
        if ($data['status']) {
            $request->validate([
                'threshold'         => 'required',
                'credit_package_id' => 'required|exists:credit_packages,id'
            ]);
        }

        $settings = $this->baseService->getAutoRechargeSettingByTeamId($teamId);
        if (count($settings)) {
            $id = $settings[0]->id;
            $result = $this->baseService->update($id, $data);

            if ($result) {
                $result = $this->baseService->read($id);
                return $result
                    ? $this->responseWithSuccess($result, 'update.success')
                    : $this->responseWithError(__('error.update.fail'));
            }
        } else {
            $result = $this->baseService->create($data);
            return $result
                ? $this->responseWithSuccess($result, 'update.success')
                : $this->responseWithError(__('error.update.fail'));
        }
    }
}
