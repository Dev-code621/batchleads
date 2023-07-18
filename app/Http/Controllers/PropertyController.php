<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreatePropertyRequest;
use App\Http\Requests\UpdatePropertyRequest;
use App\Http\Requests\PropertySearchRequest;
use App\Http\Requests\PropertySearchByRegionRequest;
use App\Http\Requests\PropertyBulkAddRequest;
use App\Http\Requests\DefaultDeleteRequest;
use App\Http\Requests\DefaultReadRequest;
use App\Http\Requests\MultiPropertyDeleteRequest;
use App\Http\Requests\GetPropertiesRequest;
use App\Http\Requests\GetPropertiesForStatusRequest;
use App\Http\Requests\PropertyBulkStatusUpdateRequest;
use App\Http\Requests\PropertyBulkFolderUpdateRequest;
use App\Http\Requests\PropertySearchAddRequest;
use App\Http\Requests\StopAllCampaignsRequest;
use App\Http\Requests\FilterByRegionRequest;
use App\Services\PropertyService;
use App\Services\PropertyImageService;
use App\Services\SmsCampaignPropertyService;
use App\Services\MailCampaignPropertyService;
use App\Services\SmsCampaignService;
use App\Services\MailCampaignService;
use App\Services\StripeService;
use App\Services\StateService;
use App\Http\Requests\PropertySearchByDistanceRequest;
use App\Http\Requests\PropertySearchByZipCodeRequest;
use App\Http\Requests\PropertySearchByCountyRequest;
use App\Http\Requests\GetNotSkipTracedPropertyCountRequest;
use App\Jobs\PropertySearchAddJob;
use ArrayHelpers\Arr;

/**
 * Class PropertyController
 *
 * @package App\Http\Controllers
 */
class PropertyController extends Controller
{
    protected $baseService;
    protected $propertyImageService;
    protected $smsCampaignPropertyService;
    protected $smsCampaignService;
    protected $mailCampaignService;
    protected $mailCampaignPropertyService;
    protected $stripeService;
    protected $stateService;

    /**
     * constructor.
     *
     * @param PropertyService $propertyService
     */
    public function __construct(
        PropertyService $propertyService,
        PropertyImageService $propertyImageService,
        SmsCampaignPropertyService $smsCampaignPropertyService,
        MailCampaignPropertyService $mailCampaignPropertyService,
        SmsCampaignService $smsCampaignService,
        MailCampaignService $mailCampaignService,
        StripeService $stripeService,
        StateService $stateService
    )
    {
        $this->baseService = $propertyService;
        $this->propertyImageService = $propertyImageService;
        $this->mailCampaignPropertyService = $mailCampaignPropertyService;
        $this->smsCampaignPropertyService = $smsCampaignPropertyService;
        $this->smsCampaignService = $smsCampaignService;
        $this->mailCampaignService = $mailCampaignService;
        $this->stripeService = $stripeService;
        $this->stateService = $stateService;
    }

    public function read(DefaultReadRequest $request, $id, array $relationships = [])
    {
        $data = $this->getPropertyById($id);

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.read.fail'));
    }

    protected function getPropertyById($id)
    {
        $data = $this->baseService->read($id);
        if (!$data) {
            return null;
        }

        $search = array(
            'request'    => array(
                'address'   => array (
                    'street'    => $data['Site_Address'],
                    'city'      => $data['Site_City'],
                    'state'     => $data['Site_State'],
                    'zip'       => $data['Site_Zip5']
                )
            )
        );

        $result = $this->baseService->propertySearchByAddress($search);

        if ($result !== 404) {
            $data = json_decode(json_encode($data), true);
            $data = array_merge($data, $result);
        }

        return $data;
    }

    public function filterByRegion(FilterByRegionRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $folderId = $data['folder_id'] ?? null;
        $drivingRouteId = $data['driving_route_id'] ?? null;
        $neLat = $data['ne_lat'] ?? null;
        $neLon = $data['ne_lon'] ?? null;
        $swLat = $data['sw_lat'] ?? null;
        $swLon = $data['sw_lon'] ?? null;
        $status = $data['status'] ?? null;
        $stateId = $data['state_id'] ?? null;
        $teamId = $this->getTeamId($user);
        $skipTraced = $data['skip_traced'] ?? null;
        $userId = $request->get('user_id') ?? null;
        $ownerOccupied = $data['owner_occupied'] ?? null;
        $smsCampaignId = $data['sms_campaign_id'] ?? null;
        $mailCampaignId = $data['mail_campaign_id'] ?? null;
        $createdAt = $data['created_at'] ?? null;
        $radius = $data['radius'] ?? null;
        $tags = $data['tags'] ?? null;

        $data = $this->baseService->filterByRegion(array(
            'per_page'          => $pageSize,
            'order_by'          => $orderBy,
            'order'             => $order,
            'search'            => $search,
            'userId'            => $userId,
            'team_id'           => $teamId,
            'page'              => $page,
            'folder_id'         => $folderId,
            'state_id'          => $stateId,
            'driving_route_id'  => $drivingRouteId,
            'status'            => $status,
            'ne_lat'            => $neLat,
            'ne_lon'            => $neLon,
            'sw_lat'            => $swLat,
            'sw_lon'            => $swLon,
            'skip_traced'       => $skipTraced,
            'owner_occupied'    => $ownerOccupied,
            'sms_campaign_id'   => $smsCampaignId,
            'mail_campaign_id'  => $mailCampaignId,
            'created_at'        => $createdAt,
            'radius'            => $radius,
            'tags'              => $tags
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function list(GetPropertiesRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $folderId = $data['folder_id'] ?? null;
        $drivingRouteId = $data['driving_route_id'] ?? null;
        $lat = $data['lat'] ?? null;
        $lon = $data['lon'] ?? null;
        $status = $data['status'] ?? null;
        $stateId = $data['state_id'] ?? null;
        $teamId = $this->getTeamId($user);
        $skipTraced = $data['skip_traced'] ?? null;
        $userId = $request->get('user_id') ?? null;
        $ownerOccupied = $data['owner_occupied'] ?? null;
        $smsCampaignId = $data['sms_campaign_id'] ?? null;
        $mailCampaignId = $data['mail_campaign_id'] ?? null;
        $createdAt = $data['created_at'] ?? null;
        $radius = $data['radius'] ?? null;
        $tags = $data['tags'] ?? null;

        if ($lat && $lon && !$pageSize) {
            $pageSize = 200;
        }

        $data = $this->baseService->search(array(
            'per_page'          => $pageSize,
            'order_by'          => $orderBy,
            'order'             => $order,
            'search'            => $search,
            'userId'            => $userId,
            'team_id'           => $teamId,
            'page'              => $page,
            'folder_id'         => $folderId,
            'state_id'          => $stateId,
            'driving_route_id'  => $drivingRouteId,
            'status'            => $status,
            'lat'               => $lat,
            'lon'               => $lon,
            'skip_traced'       => $skipTraced,
            'owner_occupied'    => $ownerOccupied,
            'sms_campaign_id'   => $smsCampaignId,
            'mail_campaign_id'  => $mailCampaignId,
            'created_at'        => $createdAt,
            'radius'            => $radius,
            'tags'              => $tags,
            'with_images'       => true
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function listForPropertyStatus(GetPropertiesForStatusRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $folderId = $data['folder_id'] ?? null;
        $stateId = $data['state_id'] ?? null;
        $drivingRouteId = $data['driving_route_id'] ?? null;
        $lat = $data['lat'] ?? null;
        $lon = $data['lon'] ?? null;
        $status = $data['status'] ?? null;
        $teamId = $this->getTeamId($user);
        $skipTraced = $data['skip_traced'] ?? null;
        $userId = $request->get('user_id') ?? null;
        $ownerOccupied = $data['owner_occupied'] ?? null;
        $smsCampaignId = $data['sms_campaign_id'] ?? null;
        $mailCampaignId = $data['mail_campaign_id'] ?? null;
        $createdAt = $data['created_at'] ?? null;
        $tags = $data['tags'] ?? null;

        $data = $this->baseService->search(array(
            'per_page'          => $pageSize,
            'order_by'          => $orderBy,
            'order'             => $order,
            'search'            => $search,
            'userId'            => $userId,
            'team_id'           => $teamId,
            'page'              => $page,
            'folder_id'         => $folderId,
            'state_id'          => $stateId,
            'driving_route_id'  => $drivingRouteId,
            'status'            => $status,
            'lat'               => $lat,
            'lon'               => $lon,
            'skip_traced'       => $skipTraced,
            'owner_occupied'    => $ownerOccupied,
            'sms_campaign_id'   => $smsCampaignId,
            'mail_campaign_id'  => $mailCampaignId,
            'created_at'        => $createdAt,
            'tags'              => $tags,
            'with_images'       => true
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function create(CreatePropertyRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();
        $data['user_id'] = $user['id'];

        $teamId = $this->getTeamId($user);
        $data['team_id'] = $teamId;
        $status = $data['status'];
        if (!in_array($status, array('New', 'Hot', 'Not Interested', 'Currently Marketing', 'Dead Deal', 'Danger'))) {
            $find = $this->stateService->findWhere(
                array(
                    'name'      => $status,
                    'team_id'   => $teamId
                )
            );

            if (count($find)) {
                $data['state_id'] = $find[0]['id'];
            } else {
                return $this->responseWithError('Status is invalid.');
            }
        }

        $result = $this->baseService->create($data);

        if ($result) {
            if ($request->images) {
                foreach ($request->images as $image) {
                    $path = Storage::disk('s3')->put('images/property', $image);
                    $url = Storage::disk('s3')->url($path);
                    $this->propertyImageService->create(
                        array(
                            'property_id'   => $result['id'],
                            'url'           => $url
                        )
                    );
                }
            }

            $result = $this->baseService->read($result['id']);
        }

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.create.fail'));
    }

    public function update(UpdatePropertyRequest $request, $propertyId)
    {
        $data = $request->validated();
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $status = $data['status'];
        if (in_array($status, array('New', 'Hot', 'Not Interested', 'Currently Marketing', 'Dead Deal', 'Danger'))) {
            $data['state_id'] = null;
        } else {
            $find = $this->stateService->findWhere(
                array(
                    'name'      => $status,
                    'team_id'   => $teamId
                )
            );

            if (count($find)) {
                $data['state_id'] = intval($find[0]['id']);
            } else {
                return $this->responseWithError('Status is invalid.');
            }
        }
        $result = $this->baseService->update($propertyId, $data);

        if ($result) {
            if ($request->images) {
                foreach ($request->images as $image) {
                    $path = Storage::disk('s3')->put('images/property', $image);
                    $url = Storage::disk('s3')->url($path);
                    $this->propertyImageService->create(
                        array(
                            'property_id'   => $propertyId,
                            'url'           => $url
                        )
                    );
                }
            }

            if ($request->removed_image_ids) {
                $removedImageIds = $request->removed_image_ids;
                foreach ($removedImageIds as $imageId) {
                    $this->propertyImageService->deleteWhere(
                        array(
                            'id'            => $imageId,
                            'property_id'   =>  $propertyId
                        )
                    );
                }
            }

            $result = $this->baseService->read($propertyId);

            return $result
                ? $this->responseWithSuccess($result, 'update.success')
                : $this->responseWithError(__('error.update.fail'));
        }

        return $this->responseWithError(__('error.update.fail'));
    }

    public function delete(DefaultDeleteRequest $request, $id)
    {
        $propertyCount = $this->smsCampaignService->findNotCancelledCountByPropertyId($id);
        if ($propertyCount) {
            return $this->responseWithError(__('error.property.isinuse'));
        }
        $propertyCount = $this->mailCampaignService->findNotCancelledCountByPropertyId($id);
        if ($propertyCount) {
            return $this->responseWithError(__('error.property.isinuse'));
        }

        $this->smsCampaignPropertyService->deleteAll(
            array(
                'property_id'   => $id
            )
        );
        $this->mailCampaignPropertyService->deleteAll(
            array(
                'property_id'   => $id
            )
        );
        $data = $this->baseService->delete($id);
        return $data
            ? $this->responseWithSuccess($data, 'delete.success')
            : $this->responseWithError(__('error.delete.fail'));
    }

    // Property Delete Multi List
    public function deleteList(MultiPropertyDeleteRequest $request)
    {
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $data = $request->validated();
        $type = Arr::get($data, 'type', null);
        $filter = Arr::get($data, 'filter', null);
        $excludedPropertyIds = $data['excluded_property_ids'] ?? [];
        $propertyIds = Arr::get($data, 'property_ids', []);
        if (!$filter) {
            $filter = [];
        }

        if ($propertyIds && count($propertyIds)) {
            $this->smsCampaignPropertyService->removeIfCancelledCampaignProperties($propertyIds);
            $this->mailCampaignPropertyService->removeIfCancelledCampaignProperties($propertyIds);
            $this->baseService->removeProperties($propertyIds);
        } else {
            $filter['team_id'] = $teamId;
            $this->baseService->searchAndDeleteSmsCampaignPropertiesCancelled($filter, $excludedPropertyIds);
            $this->baseService->searchAndDeleteMailCampaignPropertiesCancelled($filter, $excludedPropertyIds);
            $this->baseService->searchAndDelete($filter, $excludedPropertyIds);
        }

        return $this->responseWithSuccess('Success');
    }

    // Property search by address
    public function propertySearchByAddress(PropertySearchRequest $request)
    {
        $street = $request->get('street') ?? null;
        $state = $request->get('state') ?? null;
        $city = $request->get('city') ?? null;
        $zip = $request->get('zip') ?? null;

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

        $result = $this->baseService->propertySearchByAddress($search);

        if ($result === 404) {
            return $this->responseWithError(__('error.search.fail'), 404);
        }

        return $this->responseWithSuccess($result);
    }

    public function propertySearchByRegion(PropertySearchByRegionRequest $request, $page = 1, $pageSize = 100)
    {
        $data = $request->validated();
        $user = $request->user();
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);

        $region = $data['region'];
        $geoPoints = [];
        foreach ($region as $point) {
            $geoPoints[] = array(
                'latitude'  => $point['lat'],
                'longitude' => $point['lon'],
            );
        }

        $search = array(
            'searchCriteria'    => array(
                'propertyAddress'   => array (
                    'geoLocationPolygon'   => array(
                        'geoPoints'    => $geoPoints
                    )
                )
            ),
            'options'   => array(
                'skip'                  => ($page - 1) * $pageSize,
                'take'                  =>  $pageSize,
                'extractResultCount'    => true,
                'hideMeta'              => false,
            )
        );

        $search = $this->baseService->buildSearchParams($search, $data, $subscribedPlanName);

        $result = $this->baseService->propertySearch($search);

        if ($result === 404) {
            return $this->responseWithError(__('error.search.fail'));
        }

        return $this->responseWithSuccess(
            array(
                'items'             => $result['items'],
                'total'             => $result['total'],
                'count_per_page'    => intval($pageSize),
                'page'              => intval($page)
            )
        );
    }

    public function propertySearchByZipCode(PropertySearchByZipCodeRequest $request, $page = 1, $pageSize = 100)
    {
        $data = $request->validated();
        $user = $request->user();
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);

        $search = array(
            'searchCriteria'    => array(
                'propertyAddress'   => array (
                    'zip'   => array(
                        'equals'    => $data['zip_code']
                    )
                )
            ),
            'options'   => array(
                'skip'                  => ($page - 1) * $pageSize,
                'take'                  =>  $pageSize,
                'extractResultCount'    => true,
                'hideMeta'              => false,
            )
        );

        $search = $this->baseService->buildSearchParams($search, $data, $subscribedPlanName);

        $result = $this->baseService->propertySearch($search);

        if ($result === 404) {
            return $this->responseWithError(__('error.search.fail'));
        }

        return $this->responseWithSuccess(
            array(
                'items'             => $result['items'],
                'total'             => $result['total'],
                'count_per_page'    => intval($pageSize),
                'page'              => intval($page)
            )
        );
    }

    public function propertySearchByCounty(PropertySearchByCountyRequest $request, $page = 1, $pageSize = 100)
    {
        $data = $request->validated();
        $user = $request->user();
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);

        $search = array(
            'searchCriteria'    => array(
                'query'   =>  $data['county']
            ),
            'options'   => array(
                'skip'                  => ($page - 1) * $pageSize,
                'take'                  =>  $pageSize,
                'extractResultCount'    => true,
                'hideMeta'              => false,
            )
        );

        $search = $this->baseService->buildSearchParams($search, $data, $subscribedPlanName);

        $result = $this->baseService->propertySearch($search);

        if ($result === 404) {
            return $this->responseWithError(__('error.search.fail'));
        }

        return $this->responseWithSuccess(
            array(
                'items'             => $result['items'],
                'total'             => $result['total'],
                'count_per_page'    => intval($pageSize),
                'page'              => intval($page)
            )
        );
    }

    public function propertySearchByLatLng(PropertySearchByDistanceRequest $request)
    {
        $data = $request->validated();
        $lat = $data['lat'];
        $lon = $data['lon'];
        $address = $this->baseService->reverseGeocode($lat, $lon);

        if ($address) {
            $street = Arr::get($address, 'street', '');
            $city = Arr::get($address, 'city', '');
            $state = Arr::get($address, 'state', '');
            $zip = Arr::get($address, 'zip', '');
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

            if (array_key_exists('foreclosure_status', $data)) {
                if ($data['foreclosure_status']) {
                    $search['searchCriteria']['quickList'] = 'active-foreclosure';
                }
            }

            $result = $this->baseService->propertySearchByAddress($search);

            if ($result === 404) {
                return $this->responseWithError(__('error.search.fail'), 404);
            }

            return $this->responseWithSuccess($result);
        }

        return $this->responseWithError(__('error.search.fail'), 404);
    }

    public function propertySearchByDistance(PropertySearchByDistanceRequest $request, $page = 1, $pageSize = 100)
    {
        $data = $request->validated();
        $lat = $data['lat'];
        $lon = $data['lon'];
        $distance = $data['distance'];

        $search = array(
            'searchCriteria'    => array(
                'propertyAddress'   => array (
                    'geoLocationDistance'   => array(
                        'geoPoint'          => array(
                            'latitude'  => $lat,
                            'longitude' => $lon
                        ),
                        'distanceMeters'    => $distance
                    )
                )
            ),
            'options'   => array(
                'extractResultCount'    => true,
                'hideMeta'              => false,
            )
        );

        if (array_key_exists('foreclosure_status', $data)) {
            if ($data['foreclosure_status']) {
                $search['searchCriteria']['quickList'] = 'active-foreclosure';
            }
        }

        $result = $this->baseService->propertySearch($search);

        if ($result === 404) {
            return $this->responseWithError(__('error.search.fail'));
        }

        return $this->responseWithSuccess($result);
    }

    public function propertyBulkAdd(PropertyBulkAddRequest $request)
    {
        $user = $request->user();
        $request = $request->json()->all();
        $properties = $request['properties'];
        $folderId = $request['folder_id'];
        $teamId = $this->getTeamId($user);

        $successCount = 0;
        $failureCount = 0;
        $response = [];
        foreach($properties as $property) {
            $property['status'] = 'New';
            $property['user_id'] = $user['id'];
            $property['team_id'] = $teamId;
            $property['folder_id'] = $folderId;

            $find = $this->baseService->findWhereCount(
                array(
                    'address_hash'  => $property['address_hash'],
                    'team_id'       => $teamId
                )
            );
            if ($find) {
                $failureCount++;
            } else {
                $result = $this->baseService->create($property);
                if ($result) {
                    $successCount++;
                    $result = $this->baseService->read($result['id']);
                    $response[] = $result;
                } else {
                    $failureCount++;
                }
            }
        }

        return $this->responseWithSuccess(array('success' => $successCount, 'failure' => $failureCount, 'data' => $response));
    }

    public function propertySearchAdd(PropertySearchAddRequest $request)
    {
        $user = $request->user();
        $user = $request->user();
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
        $userId = $user['id'];
        $teamId = $this->getTeamId($user);
        $data = $request->validated();

        PropertySearchAddJob::dispatch($data, $userId, $teamId, $this->baseService, $subscribedPlanName);

        return $this->responseWithSuccess('Success');
    }

    public function bulkStatusUpdate(PropertyBulkStatusUpdateRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $teamId = $this->getTeamId($user);
        $propertyIds = Arr::get($data, 'property_ids', []);
        $filter = Arr::get($data, 'filter', []);
        if (!$filter) {
            $filter = [];
        }
        $propertyStatus = $data['status'];

        $stateId = null;
        if (!in_array($propertyStatus, array('New', 'Hot', 'Not Interested', 'Currently Marketing', 'Dead Deal', 'Danger'))) {
            $find = $this->stateService->findWhere(
                array(
                    'name'      => $propertyStatus,
                    'team_id'   => $teamId
                )
            );

            if (count($find)) {
                $stateId = intval($find[0]['id']);
            } else {
                return $this->responseWithError('Status is invalid.');
            }
        }

        if ($propertyIds && count($propertyIds)) {
            foreach ($propertyIds as $propertyId) {
                $this->baseService->update(
                    $propertyId,
                    array(
                        'status'    => $propertyStatus,
                        'state_id'  => $stateId
                    )
                );
            }
        } else {
            $search = Arr::get($filter, 'filter', '');
            $folderId = Arr::get($filter, 'folder_id', null);
            $drivingRouteId = Arr::get($filter, 'driving_route_id', null);
            $lat = Arr::get($filter, 'lat', null);
            $lon = Arr::get($filter, 'lon', null);
            $status = Arr::get($filter, 'status', null);
            $stateId = Arr::get($filter, 'state_id', null);
            $teamId = $this->getTeamId($user);
            $skipTraced = Arr::get($filter, 'skip_traced', null);
            $userId = Arr::get($filter, 'user_id', null);
            $ownerOccupied = Arr::get($filter, 'owner_occupied', null);
            $excludedPropertyIds = Arr::get($data, 'excluded_property_ids', null);
            $tags = Arr::get($filter, 'tags', null);
            $createdAt = Arr::get($filter, 'created_at', null);

            $this->baseService->searchAndUpdate(
                array(
                    'search'            => $search,
                    'userId'            => $userId,
                    'team_id'           => $teamId,
                    'folder_id'         => $folderId,
                    'state_id'          => $stateId,
                    'driving_route_id'  => $drivingRouteId,
                    'status'            => $status,
                    'lat'               => $lat,
                    'lon'               => $lon,
                    'skip_traced'       => $skipTraced,
                    'owner_occupied'    => $ownerOccupied,
                    'tags'              => $tags,
                    'created_at'        => $createdAt
                ),
                array(
                    'status'    => $propertyStatus,
                    'state_id'  => $stateId
                ),
                $excludedPropertyIds
            );
        }

        return $this->responseWithSuccess('Success');
    }

    public function bulkFolderUpdate(PropertyBulkFolderUpdateRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $propertyIds = Arr::get($data, 'property_ids', []);
        $filter = Arr::get($data, 'filter', []);
        if (!$filter) {
            $filter = [];
        }
        $newFolderId = $data['folder_id'];
        if ($propertyIds && count($propertyIds)) {
            foreach ($propertyIds as $propertyId) {
                $this->baseService->update(
                    $propertyId,
                    array('folder_id' => $newFolderId)
                );
            }
        } else {
            $search = Arr::get($filter, 'filter', '');
            $folderId = Arr::get($filter, 'folder_id', null);
            $drivingRouteId = Arr::get($filter, 'driving_route_id', null);
            $lat = Arr::get($filter, 'lat', null);
            $lon = Arr::get($filter, 'lon', null);
            $status = Arr::get($filter, 'status', null);
            $stateId = Arr::get($filter, 'state_id', null);
            $teamId = $this->getTeamId($user);
            $skipTraced = Arr::get($filter, 'skip_traced', null);
            $userId = Arr::get($filter, 'user_id', null);
            $ownerOccupied = Arr::get($filter, 'owner_occupied', null);
            $excludedPropertyIds = Arr::get($data, 'excluded_property_ids', null);
            $tags = Arr::get($filter, 'tags', null);
            $createdAt = Arr::get($filter, 'created_at', null);

            $this->baseService->searchAndUpdate(
                array(
                    'search'            => $search,
                    'userId'            => $userId,
                    'team_id'           => $teamId,
                    'folder_id'         => $folderId,
                    'state_id'          => $stateId,
                    'driving_route_id'  => $drivingRouteId,
                    'status'            => $status,
                    'lat'               => $lat,
                    'lon'               => $lon,
                    'skip_traced'       => $skipTraced,
                    'owner_occupied'    => $ownerOccupied,
                    'tags'              => $tags,
                    'created_at'        => $createdAt
                ),
                array(
                    'folder_id'    => $newFolderId
                ),
                $excludedPropertyIds
            );
        }

        return $this->responseWithSuccess('Success');
    }

    public function stopAllCampaigns(StopAllCampaignsRequest $request)
    {
        $data = $request->validated();
        $propertyId = $data['property_id'];
        $this->smsCampaignPropertyService->findAndDelete(
            array(
                'property_id'   => $propertyId
            )
        );
        $this->mailCampaignPropertyService->findAndDelete(
            array(
                'property_id'   => $propertyId
            )
        );

        return $this->responseWithSuccess('Success');
    }

    public function getNotSkipTracedCount(GetNotSkipTracedPropertyCountRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $excludedPropertyIds = Arr::get($data, 'excluded_property_ids', null);
        $teamId = $this->getTeamId($user);

        $count = $this->baseService->getNotSkipTracedCount($data, $teamId, $excludedPropertyIds);

        return $this->responseWithSuccess($count);
    }
}
