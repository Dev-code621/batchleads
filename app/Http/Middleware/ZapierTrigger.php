<?php

namespace App\Http\Middleware;

use GuzzleHttp\Client;
use Carbon\Carbon;
use App\Services\PropertyService;
use App\Services\ZapierSubscribeService;
use App\Models\Property;
use Closure;

class ZapierTrigger
{
    protected $propertyService;
    protected $zapierSubscribeService;

    public function __construct(
        PropertyService $propertyService,
        ZapierSubscribeService $zapierSubscribeService
    )
    {
        $this->propertyService = $propertyService;
        $this->zapierSubscribeService = $zapierSubscribeService;
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
        $beforeStatus = null;
        $beforeProperties = [];
        $items = [];
        $subscribes = [];

        $actionName = class_basename($request->route()->getActionname());
        if ($actionName === 'PropertyController@update') {
            $propertyId = $request->route('id');
            $property = $this->propertyService->read($propertyId);
            $beforeStatus = $property['status'];
        } else if ($actionName === 'PropertyController@bulkStatusUpdate') {
            $propertyIds = $request->get('property_ids');
            $status = $request->get('status');
            if ($propertyIds) {
                $beforeProperties = Property::whereIn('id', $propertyIds)->where('status', '!=', $status)->get();
            }
        }

        $response = $next($request);
        $status = $response->status();
        if ($status === 200) {
            // get Web hooks
            if ($actionName === 'PropertyController@update' || $actionName === 'PropertyController@bulkStatusUpdate') {
                $subscribes = $this->zapierSubscribeService->getUserZapierSubscribes($user['id'], 'status_changed');
            } else if ($actionName === 'PropertyController@create') {
                $subscribes = $this->zapierSubscribeService->getUserZapierSubscribes($user['id'], 'new_deal_added');
            } else if ($actionName === 'SmsCampaignController@cancelCampaign') {
                $subscribes = $this->zapierSubscribeService->getUserZapierSubscribes($user['id'], 'sms_campaign_finished');
            } else if ($actionName === 'MailCampaignController@cancelCampaign') {
                $subscribes = $this->zapierSubscribeService->getUserZapierSubscribes($user['id'], 'mail_campaign_finished');
            }

            // Call Web hooks
            if ($actionName === 'PropertyController@update') {
                $property = $this->propertyService->read($propertyId);
                $afterStatus = $property['status'];
                if ($beforeStatus !== $afterStatus) {
                    $items[] = array(
                        'address'       => $property['address1'],
                        'street'        => $property['Site_Address'],
                        'city'          => $property['Site_City'],
                        'state'         => $property['Site_State'],
                        'zip'           => $property['Site_Zip5'],
                        'before'        => $beforeStatus,
                        'current'       => $afterStatus,
                        'changed_date'  => Carbon::parse($property['updated_at'])->toIso8601ZuluString()
                    );
                }
            } else if ($actionName === 'PropertyController@bulkStatusUpdate') {
                $propertyIds = $request->get('property_ids');
                $status = $request->get('status');
                if ($propertyIds) {
                    if ($beforeProperties) {
                        foreach ($beforeProperties as $property) {
                            $items[] = array(
                                'address'       => $property['address1'],
                                'street'        => $property['Site_Address'],
                                'city'          => $property['Site_City'],
                                'state'         => $property['Site_State'],
                                'zip'           => $property['Site_Zip5'],
                                'before'        => $property['status'],
                                'current'       => $status,
                                'changed_date'  => Carbon::now()->toIso8601ZuluString()
                            );
                        }
                    }
                }
            } else if ($actionName === 'PropertyController@create') {
                $result = json_decode($response->content(), true);
                $data = $result['data'];
                $items[] = array(
                    'address'           => $data['address1'],
                    'street'            => $data['Site_Address'],
                    'city'              => $data['Site_City'],
                    'state'             => $data['Site_State'],
                    'zip'               => $data['Site_Zip5'],
                    'status'            => $data['status'],
                    'owner_name'        => $data['Owner1FirstName'] . ' ' . $data['Owner1LastName'],
                    'owner_occupied'    => $data['Owner_Occupied'],
                    'folder'            => $data['folder']['name'],
                    'date_added'        => Carbon::parse($data['created_at'])->toIso8601ZuluString()
                );
            } else if ($actionName === 'SmsCampaignController@cancelCampaign') {
                $result = json_decode($response->content(), true);
                $data = $result['data'];
                $items[] = array(
                    'start_date'        => Carbon::parse($data['start_date'])->toIso8601ZuluString(),
                    'end_date'          => Carbon::now()->toIso8601ZuluString(),
                    'reason'            => 'Cancelled',
                    'campaign_name'     => $data['title'],
                    'total_properties'  => $data['property_count']
                );
            } else if ($actionName === 'MailCampaignController@cancelCampaign') {
                $result = json_decode($response->content(), true);
                $data = $result['data'];
                $items[] = array(
                    'start_date'        => Carbon::parse($data['send_date'])->toIso8601ZuluString(),
                    'end_date'          => Carbon::now()->toIso8601ZuluString(),
                    'reason'            => 'Cancelled',
                    'campaign_name'     => $data['title'],
                    'total_properties'  => $data['property_count']
                );
            }

            foreach ($subscribes as $subscribe) {
                $hookUrl = $subscribe['hookUrl'];
                $client = new Client();
                $headers = [
                    'Content-Type'  => 'application/json'
                ];
                foreach ($items as $item) {
                    try {
                        $client->request('POST', $hookUrl, [
                            'headers'   => $headers,
                            'json'      => $item
                        ]);
                    } catch (\Exception $ex) {
                    }
                }
            }
        }
        return $response;
    }
}
