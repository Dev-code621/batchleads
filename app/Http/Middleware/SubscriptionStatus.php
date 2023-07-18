<?php

namespace App\Http\Middleware;

use App\Services\StripeService;
use App\Services\PropertyService;
use App\Services\TeamService;
use Illuminate\Support\Facades\Storage;
use Closure;

class SubscriptionStatus
{
    protected $stripeService;
    protected $propertyService;
    protected $teamService;

    public function __construct(
        StripeService $stripeService,
        PropertyService $propertyService,
        TeamService $teamService
    )
    {
        $this->stripeService = $stripeService;
        $this->propertyService = $propertyService;
        $this->teamService = $teamService;
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
        $isCancelled = $this->stripeService->isUserCancelledSubscription($user);
        $isPastDue = $this->stripeService->isUserPastDue($user);
        if ($isPastDue) {
            return response()->json([
                'status'  => 434,
                'message' => __('error.subscribe.pastdue'),
            ], 434);
        }

        if ($isCancelled) {
            return response()->json([
                'status'  => 433,
                'message' => __('error.subscribe.cancelled'),
            ], 433);
        }

        $isTrial = $this->stripeService->isUserTrial($user);
        if ($isTrial) {
            $actions = array(
                // array(
                //     'controller'    => 'Credit',
                //     'methods'       => ['chargeCredit']
                // )
            );

            $actionName = class_basename($request->route()->getActionname());
            $teamId = $this->teamService->getTeamId($user);
            $propertyCount = $this->propertyService->getSearchCount(array(
                'team_id' => $teamId
            ));
            $trialCount = 250;
            if ($actionName === 'PropertyController@create' || $actionName === 'PropertyController@propertyBulkAdd' || $actionName === 'DataManagerController@import' || $actionName === 'PropertyController@propertySearchAdd') {
                $countToAdd = 1;
                if ($actionName === 'PropertyController@propertyBulkAdd') {
                    $countToAdd = count($request['properties']);
                } else if ($actionName === 'DataManagerController@import') {
                    $fileName = $request['file_name'];
                    $path = Storage::disk('public')->path($fileName);
                    $csv = new \ParseCsv\Csv();
                    $csv->load_data($path);
                    $countToAdd = $csv->getTotalDataRowCount();
                } else if ($actionName === 'PropertyController@propertySearchAdd') {
                    $excludedProperties = $request->get('excluded_hashes') ?? [];
                    $total = $request->get('total');
                    $countToAdd = $total - count($excludedProperties);
                }
                if (($propertyCount + $countToAdd) > $trialCount) {
                    return response()->json([
                        'status'    => 434,
                        'data'      => array(
                            'trial_count'   => $trialCount,
                            'current_count' => $propertyCount,
                            'count_to_add'  => $countToAdd,
                        ),
                        'message'   => __('error.subscribe.istrial'),
                    ], 434);
                }
            } else {
                foreach($actions as $action) {
                    $controller = $action['controller'];
                    $methods = $action['methods'];
                    foreach($methods as $method) {
                        if ($actionName === $controller . 'Controller@' . $method) {
                            return response()->json([
                                'status'  => 434,
                                'message' => __('error.subscribe.istrial'),
                            ], 434);
                        }
                    }
                }
            }
        }

        return $next($request);
    }
}
