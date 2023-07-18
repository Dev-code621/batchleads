<?php

namespace App\Http\Middleware;

use App\Services\StripeService;
use Closure;

class PayAddOn
{
    public function __construct(
        StripeService $stripeService
    )
    {
        $this->stripeService = $stripeService;
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
        $addOns = array(config('services.add_ons.driving_route'), config('services.add_ons.street_view'));
        $prices = array(
            config('services.plans.basic.name')     => array(
                'driving_route' => 20,
                'street_view'   => 20
            ),
            config('services.plans.standard.name')  => array(
                'driving_route' => 20,
                'street_view'   => 20
            ),
            config('services.plans.standard_new.name')  => array(
                'driving_route' => 20,
                'street_view'   => 20
            ),
            // config('services.plans.premium.name')   => array(
            //     'driving_route' => 20
            // ),
        );

        $actionName = class_basename($request->route()->getActionname());
        if ($actionName === 'AddOnController@create') {
            $addOn = $request->add_on;
            if (!in_array($addOn, $addOns)) {
                return response()->json([
                    'status'            => 422,
                    'message'           => 'Undefined add-on',
                ], 421);
            }
            $user = $request->user();
            $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);

            if ($subscribedPlanName === config('services.plans.premium.name')) {
                return response()->json([
                    'status'            => 422,
                    'message'           => 'You are already Premium member.',
                ], 422);
            }

            $isTrial = $this->stripeService->isUserTrial($user);

            if (!$isTrial) {
                $customerId = $this->stripeService->getUserStripeId($user);
                $charge = $this->stripeService->charge(
                    array(
                        'customer_id'   => $customerId,
                        'amount'        => $prices[$subscribedPlanName][$addOn]
                    )
                );

                if ($charge) {
                    return $next($request);
                } else {
                    return response()->json([
                        'status'            => 421,
                        'message'           => __('error.stripe.charge.fail'),
                    ], 421);
                }
            }
        }
        return $next($request);
    }
}
