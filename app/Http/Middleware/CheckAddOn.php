<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\PropertyImageService;
use App\Services\StripeService;
use App\Http\Helpers\UrlSignHelper;
use App\Services\AddOnService;
use App\Services\TeamService;
use App\Services\PropertyService;
use App\Services\TeamUserService;
use App\Services\UserService;
use ArrayHelpers\Arr;

class CheckAddOn
{
    protected $propertyImageService;
    protected $stripeService;
    protected $addOnService;
    protected $teamService;
    protected $propertyService;
    protected $teamUserService;
    protected $userService;

    public function __construct(
        PropertyImageService $propertyImageService,
        StripeService $stripeService,
        AddOnService $addOnService,
        TeamService $teamService,
        PropertyService $propertyService,
        TeamUserService $teamUserService,
        UserService $userService
    )
    {
        $this->propertyImageService = $propertyImageService;
        $this->stripeService = $stripeService;
        $this->addOnService = $addOnService;
        $this->teamService = $teamService;
        $this->propertyService = $propertyService;
        $this->teamUserService = $teamUserService;
        $this->userService = $userService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        $teamId = $this->teamService->getTeamId($user);
        // $addOns = [];

        // $ownerUser = $this->userService->getOwnerUser($user);
        // if ($ownerUser) {
        //     $addOns = $this->stripeService->getAddOns($ownerUser);
        // }

        $actionName = class_basename($request->route()->getActionname());

        // Check property already exists
        if ($actionName === 'PropertyController@create') {
            $addressHash = $request->get('address_hash');
            $properties = $this->propertyService->findWhere(
                array(
                    'team_id'       => $teamId,
                    'address_hash'  => $addressHash
                )
            );
            if (count($properties) > 0) {
                $response = array(
                    'status'  => 422,
                    'message' => 'This Property had registered already.'
                );
                return response()->json($response, 422);
            }
        }

        $response = $next($request);
        $status = $response->status();

        if ($status === 200) {
            // $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);

            // $hasStreetViewAddOn = false;
            // if ($subscribedPlanName === config('services.plans.premium.name')) {
            //     $hasStreetViewAddOn = true;
            // } else {
            //     if ($addOns) {
            //         foreach ($addOns as $addOn) {
            //             if ($addOn['add_on'] === config('services.add_ons.street_view.name')) {
            //                 $hasStreetViewAddOn = true;
            //             }
            //         }
            //     }
            // }

            $result = json_decode($response->content(), true);

            if ($actionName === 'PropertyController@create' || $actionName === 'ZapierController@createLead') {
                if ($actionName === 'ZapierController@createLead') {
                    $property = $result;
                } else {
                    $property = $result['data'];
                }
                $propertyId = $property['id'];
                $latitude = $property['location_latitude'];
                $longitude = $property['location_longitude'];
                // if ($hasStreetViewAddOn) {
                    $this->createPropertyImage($propertyId, $latitude, $longitude);
                    $property = $this->propertyService->read($propertyId);
                    $response = array(
                        'status'  => 200,
                        'message' => 'success',
                        'data'    => $property
                    );
                    return response()->json($response, 200);
                // }
            } else if ($actionName === 'PropertyController@propertyBulkAdd') {
                $properties = $result['data']['data'];
                // if ($hasStreetViewAddOn) {
                    foreach ($properties as $property) {
                        $propertyId = $property['id'];
                        $latitude = $property['location_latitude'];
                        $longitude = $property['location_longitude'];
                        $this->createPropertyImage($propertyId, $latitude, $longitude);
                    }
                // }
            } else if (
                $actionName === 'PropertyController@propertySearchByAddress'
                || $actionName === 'PropertyController@propertySearchByLatLng'
            ) {
                $property = $result['data'];
                $addressHash = Arr::get($property, 'address_hash', null);
                if ($addressHash) {
                    $find = $this->propertyService->findWhere(
                        array(
                            'address_hash' => $addressHash,
                            'team_id'      => $teamId
                        )
                    );
                    if (count($find)) {
                        $property['id'] = $find[0]['id'];
                    }
                }
                // if ($hasStreetViewAddOn) {
                    $streetViewImageUrl = $this->propertyImageService->getStreetViewImageUrl($property['location_latitude'], $property['location_longitude']);
                    $property['images'] = array(array('url' => $streetViewImageUrl, 'id' => 1));
                // }
                $response = array(
                    'status'  => 200,
                    'message' => 'success',
                    'data'    => $property
                );
                return response()->json($response, 200);
            } else if (
                $actionName === 'PropertyController@propertySearchByRegion'
                || $actionName === 'PropertyController@propertySearchByZipCode'
                || $actionName === 'PropertyController@propertySearchByCounty'
            ) {
                $properties = $result['data']['items'];
                $newProperties = [];

                foreach ($properties as $property) {
                    $latitude = $property['location_latitude'];
                    $longitude = $property['location_longitude'];
                    // if ($hasStreetViewAddOn) {
                        $streetViewImageUrl = $this->propertyImageService->getStreetViewImageUrl($property['location_latitude'], $property['location_longitude']);
                        $property['images'] = array(array('url' => $streetViewImageUrl, 'id' => 1));
                    // }

                    $addressHash = Arr::get($property, 'address_hash', null);
                    if ($addressHash) {
                        $find = $this->propertyService->findWhere(
                            array(
                                'address_hash' => $addressHash,
                                'team_id'      => $teamId
                            )
                        );
                        if (count($find)) {
                            $property['id'] = $find[0]['id'];
                        }
                    }

                    $newProperties []= $property;
                }
                $response = array(
                    'status'  => 200,
                    'message' => 'success',
                    'data'    => array(
                        'items'             => $newProperties,
                        'total'             => $result['data']['total'],
                        'count_per_page'    => $result['data']['count_per_page'],
                        'page'              => $result['data']['page']
                    )
                );
                return response()->json($response, 200);
            } else if ($actionName === 'PropertyController@propertySearchByDistance') {
                $properties = $result['data']['items'];
                $newProperties = [];
                // if ($hasStreetViewAddOn) {
                    foreach ($properties as $property) {
                        $latitude = $property['location_latitude'];
                        $longitude = $property['location_longitude'];
                        $streetViewImageUrl = $this->propertyImageService->getStreetViewImageUrl($property['location_latitude'], $property['location_longitude']);
                        $property['images'] = array(array('url' => $streetViewImageUrl, 'id' => 1));
                        $newProperties []= $property;
                    }
                    $response = array(
                        'status'  => 200,
                        'message' => 'success',
                        'data'    => array(
                            'items'  => $newProperties,
                        )
                    );
                    return response()->json($response, 200);
                // }
            } else if ($actionName === 'PropertyController@list' || $actionName === 'PropertyController@listForPropertyStatus') {
                // $properties = $result['data']['data'];
                // $newProperties = [];
                // if (!$hasStreetViewAddOn) {
                //     foreach ($properties as $property) {
                //         $images = $property['images'];
                //         if ($images) {
                //             $property['images'] = [];
                //             // $property['images'] = array_filter($images, array($this, 'getNoStreetViewImages'));
                //             foreach ($images as $image) {
                //                 if ($image['is_location_image'] !== 1) {
                //                     $property['images'][] = $image;
                //                 }
                //             }
                //         }
                //         $newProperties []= $property;
                //     }
                //     $response = array(
                //         'status'  => 200,
                //         'message' => 'success',
                //         'data'    => array(
                //             'data'              => $newProperties,
                //             'total'             => $result['data']['total'],
                //             'count_per_page'    => $result['data']['count_per_page'],
                //             'page'              => $result['data']['page'],
                //             'count'             => $result['data']['count']
                //         )
                //     );
                //     return response()->json($response, 200);
                // }
            } else if ($actionName === 'PropertyController@read') {
                // if (!$hasStreetViewAddOn) {
                //     $property = $result['data'];
                //     $images = $property['images'];
                //     if ($images) {
                //         $property['images'] = [];
                //         // $property['images'] = array_filter($images, array($this, 'getNoStreetViewImages'));
                //         foreach ($images as $image) {
                //             if ($image['is_location_image'] !== 1) {
                //                 $property['images'][] = $image;
                //             }
                //         }
                //     }

                //     $response = array(
                //         'status'  => 200,
                //         'message' => 'success',
                //         'data'    => $property
                //     );
                //     return response()->json($response, 200);
                // }
            }
        }

        return $response;
    }

    protected function createPropertyImage($propertyId, $latitude, $longitude)
    {
        return $this->propertyImageService->createStreetViewImage($propertyId, $latitude, $longitude);
    }

    protected function getNoStreetViewImages($image)
    {
        return $image['is_location_image'] !== 1;
    }
}
