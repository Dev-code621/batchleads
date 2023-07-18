<?php

namespace App\Http\Controllers;

use ArrayHelpers\Arr;
use App\Http\Controllers\Controller;
use App\Http\Requests\ZapierCreateLeadRequest;
use App\Http\Requests\ZapierSubscribeRequest;
use App\Http\Requests\ZapierUnsubscribeRequest;
use App\Services\FolderService;
use App\Services\PropertyService;
use App\Services\ZapierSubscribeService;

/**
 * Class ZapierController
 *
 * @package App\Http\Controllers
 */
class ZapierController extends Controller
{
    protected $service;
    protected $propertyService;
    protected $folderService;

    /**
     * constructor.
     *
     */
    public function __construct(
        ZapierSubscribeService $service,
        PropertyService $propertyService,
        FolderService $folderService
    )
    {
        $this->baseService = $service;
        $this->propertyService = $propertyService;
        $this->folderService = $folderService;
    }

    public function subscribe(ZapierSubscribeRequest $request)
    {
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user['id'];
        $result = $this->baseService->create($data);

        return $result
            ? response()->json($result, 200)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function unSubscribe(ZapierUnsubscribeRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $result = $this->baseService->delete($data['id']);

        return $result
            ? $this->responseWithSuccess($result, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }

    public function createLead(ZapierCreateLeadRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $teamId = $this->getTeamId($user);
        $folderCount = $this->folderService->findWhereCount(
            array(
                'team_id'   => $teamId,
                'name'      => 'Zapier'
            )
        );

        if (!$folderCount) {
            $this->folderService->create(
                array(
                    'user_id'   => $userId,
                    'team_id'   => $teamId,
                    'name'      => 'Zapier'
                )
            );
        }

        $data = $request->validated();
        $street = $data['street'];
        $city = $data['city'];
        $state = $data['state'];
        $zip = $data['zip'];
        $search = array(
            'request'    => array(
                'address'   => array (
                    'street'    => $street,
                    'city'      => $city,
                    'state'     => $state,
                    'zip'       => $zip
                )
            )
        );

        $result = $this->propertyService->propertySearchByAddress($search);
        if ($result !== 404) {
            $addressHash = Arr::get($result, 'address_hash', null);
            if ($addressHash) {
                $properties = $this->propertyService->findWhere(
                    array(
                        'team_id'       => $teamId,
                        'address_hash'  => $addressHash
                    )
                );
                if (count($properties) > 0) {
                    return response()->json($properties[0], 200);
                    // return $this->responseWithError(__('error.create.fail'));
                }

                $folders = $this->folderService->findWhere(
                    array(
                        'team_id'   => $teamId,
                        'name'      => 'Zapier'
                    )
                );
                $folderId = $folders[0]['id'];
                $result['status'] = 'New';
                $result['folder_id'] = $folderId;
                $result['user_id'] = $userId;
                $result['team_id'] = $teamId;

                $result = $this->propertyService->create($result);

                return $result
                    ? response()->json($result, 200)
                    : $this->responseWithError(__('error.create.fail'));
            }
        }

        return $this->responseWithError('Can not find the property', 404);
    }

    public function statusChanged()
    {
        $result = array(
            "address"       =>  "1530 N Gable Rd, Saint Hedwig, TX 78152",
            "street"        =>  "1530 N Gable Rd",
            "city"          =>  "Saint Hedwig",
            "state"         =>  "TX",
            "zip"           =>  "78152",
            "before"        =>  "Not Interested",
            "current"       =>  "Dead Deal",
            "changed_date"  =>  "2020-11-23T01:49:51z"
        );

        return response()->json(array($result), 200);
    }

    public function newDealAdded()
    {
        $result = array(
            "address"           =>  "1530 N Gable Rd, Saint Hedwig, TX 78152",
            "street"            =>  "1530 N Gable Rd",
            "city"              =>  "Saint Hedwig",
            "state"             =>  "TX",
            "zip"               =>  "78152",
            "date_added"        =>  "2020-11-23T01:49:51z",
            "status"            =>  "New",
            "folder"            =>  "Zapier",
            "owner_name"        =>  "Johnny Vencill",
            "owner_occupied"    =>  "Y"
        );

        return response()->json(array($result), 200);
    }

    public function smsCampaignFinished()
    {
        $result = array(
            "start_date"        =>  "2020-11-23T01:49:51z",
            "end_date"          =>  "2020-11-24T01:49:51z",
            "reason"            =>  "Finished",
            "campaign_name"     =>  "New Deal Owner",
            "total_properties"  =>  10
        );

        return response()->json(array($result), 200);
    }

    public function mailCampaignFinished()
    {
        $result = array(
            "start_date"        =>  "2020-11-23T01:49:51z",
            "end_date"          =>  "2020-11-24T01:49:51z",
            "reason"            =>  "Finished",
            "campaign_name"     =>  "New Deal Owner",
            "total_properties"  =>  10
        );

        return response()->json(array($result), 200);
    }
}
