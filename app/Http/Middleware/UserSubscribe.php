<?php

namespace App\Http\Middleware;

use App\Services\TeamService;
use App\Services\UserFpService;
use App\Services\CreditBallanceService;
use Closure;

class UserSubscribe
{
    public function __construct(
        TeamService $teamService,
        UserFpService $userFpService,
        CreditBallanceService $creditBallanceService
    )
    {
        $this->teamService = $teamService;
        $this->userFpService = $userFpService;
        $this->creditBallanceService = $creditBallanceService;
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
        $response = $next($request);
        $status = $response->status();
        if ($status === 200) {
            $user = $request->user();
            $promoCode = $request->get('promo_code');
            $firstPromoter = $this->userFpService->getUserPromoterByUserId($user['id']);
            $coupon = null;
            if ($promoCode) {
                $this->userFpService->trackSignUp($user['email'], strtoupper($promoCode));
                // $coupon = $promoCode;
                // if ($firstPromoter) {
                //     $this->userFpService->update($firstPromoter['id'], array(
                //         'tracking_ref_id'   => $promoCode
                //     ));
                //     // $this->userFpService->trackSignUp($user['email'], $promoCode);
                // }
            } else {
                // if ($firstPromoter) {
                //     $trackingRefId = $firstPromoter['tracking_ref_id'];
                //     if ($trackingRefId) {
                //         $this->userFpService->trackSignUp($user['email'], $trackingRefId);
                //         $coupon = $trackingRefId;
                //     }
                // }
            }

            $names = explode(' ', $user['name']);
            $planId = $request->get('stripe_plan');
            $user->updateStripeCustomer(
                array(
                    'email'     => $user['email'],
                    'name'      => $user['name'],
                    'phone'     => $user['phone'],
                    'metadata'  => array(
                        'email'         => $user['email'],
                        'firstName'     => $names[0],
                        'lastName'      => count($names) >=2 ? $names[1] : '',
                        'phone'         => $user['phone'],
                        'plan'          => $planId
                    ),
                )
            );

            if ($firstPromoter) {
                if ($firstPromoter['tracking_ref_id']) {
                    $promoCode = $firstPromoter['tracking_ref_id'];
                }
            }

            if ($promoCode) {
                $user->updateStripeCustomer(
                    array(
                        'metadata'  => array(
                            'promo_code'    => strtoupper($promoCode)
                        )
                    )
                );
                // $this->creditBallanceService->create(
                //     array(
                //         'user_id'   => $user['id'],
                //         'ballance'  => 400
                //     )
                // );
            }
        }
        return $response;
    }
}
