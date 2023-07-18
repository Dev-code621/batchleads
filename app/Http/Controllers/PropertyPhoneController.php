<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePropertyPhoneRequest;
use App\Http\Requests\GetPropertiesByPhoneNumberRequest;
use App\Http\Requests\UpdatePropertyPhoneRequest;
use App\Services\PropertyPhoneService;
use App\Services\SmsMasterService;
use App\Http\Helpers\PhoneNumberHelper;
use App\Http\Requests\GetSmsMastersByPropertyIdRequest;

/**
 * Class PropertyPhoneController
 *
 * @package App\Http\Controllers
 */
class PropertyPhoneController extends Controller
{
    protected $baseService;
    protected $smsMasterService;

    /**
     * constructor.
     *
     * @param PropertyPhoneService $propertyPhoneService
     */
    public function __construct(
        PropertyPhoneService $propertyPhoneService,
        SmsMasterService $smsMasterService
    )
    {
        $this->baseService = $propertyPhoneService;
        $this->smsMasterService = $smsMasterService;
    }

    public function create(CreatePropertyPhoneRequest $request)
    {
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];
        $phoneNumber = PhoneNumberHelper::formatToSimple($phoneNumber);
        $propertyId = $data['property_id'];
        $phoneNumbers = $this->baseService->findAllByPropertyIdAndPhoneNumber($propertyId, $phoneNumber);
        if (!count($phoneNumbers)) {

            $data['phone_number'] = $phoneNumber;
            $result = $this->baseService->create($data);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.create.fail'));
        } else {
            return response()->json([
                "error" => [
                    "phone_number" => [
                        "The phone number has already been taken."
                    ]
                ],
                "message" => "Validation Failed."
            ], 422);
        }
    }

    public function update(UpdatePropertyPhoneRequest $request, $id)
    {
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];
        $phoneNumber = PhoneNumberHelper::formatToSimple($phoneNumber);
        $property = $this->baseService->read($id);
        $propertyId = $property['property_id'];

        $phoneNumbers = $this->baseService->findWhere(
            array(
                'phone_number'  => $phoneNumber,
                'property_id'   => $propertyId
            )
        );
        $existing = false;
        if (count($phoneNumbers)) {
            foreach ($phoneNumbers as $phoneNumberItem) {
                if ($phoneNumberItem['id'] !== intval($id)) {
                    $existing = true;
                }
            }
        }

        if (!$existing) {
            $data['phone_number'] = $phoneNumber;
            $result = $this->baseService->update($id, $data);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.create.fail'));
        } else {
            return response()->json([
                "error" => [
                    "phone_number" => [
                        "The phone number has already been taken."
                    ]
                ],
                "message" => "Validation Failed."
            ], 422);
        }
    }

    public function getPropertiesByPhoneNumber(GetPropertiesByPhoneNumberRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $data = $request->validated();
        $phoneNumber = $data['phone_number'];

        $result = $this->baseService->getPropertiesByPhoneNumber($userId, $phoneNumber);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function getSmsMastersByPropertyId(GetSmsMastersByPropertyIdRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $data = $request->validated();
        $propertyId = $data['property_id'];

        $smsMasters = [];

        $phoneNumbers = $this->baseService->findWhere(
            array(
                'property_id'   => $propertyId,
                'type'          => 'Mobile'
            )
        );

        foreach ($phoneNumbers as $phoneNumber) {
            $result = $this->smsMasterService->findWhere(
                array(
                    'user_id'       => $userId,
                    'phone_number'  => '+1' . $phoneNumber['phone_number']
                )
            )->first();

            if ($result) {
                $smsMasters []= $result;
            } else {
                $smsMasters []= array(
                    'phone_number'  => $phoneNumber['phone_number'],
                    'badge_number'  => 0
                );
            }

        }

        return $smsMasters
            ? $this->responseWithSuccess($smsMasters)
            : $this->responseWithError(__('error.list.fail'));
    }
}
