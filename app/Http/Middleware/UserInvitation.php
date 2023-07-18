<?php

namespace App\Http\Middleware;

use App\Services\TeamService;
use App\Services\TeamUserService;
use App\Services\StripeService;
use App\Services\UserService;
use App\Services\TeamInvitationService;
use Closure;

class UserInvitation
{
    public function __construct(
        TeamService $teamService,
        TeamUserService $teamUserService,
        StripeService $stripeService,
        UserService $userService,
        TeamInvitationService $teamInvitationService
    )
    {
        $this->teamService = $teamService;
        $this->teamUserService = $teamUserService;
        $this->stripeService = $stripeService;
        $this->userService = $userService;
        $this->teamInvitationService = $teamInvitationService;
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
        $additionalUsersCount = array (
            config('services.plans.basic.name')             => 1,
            config('services.plans.basic_new.name')         => 1,
            config('services.plans.basic_yearly.name')      => 1,
            config('services.plans.standard.name')          => 3,
            config('services.plans.standard_yearly.name')   => 3,
            config('services.plans.standard_new.name')      => 3,
            config('services.plans.premium.name')           => 10,
            config('services.plans.premium_new.name')       => 10,
            config('services.plans.premium_yearly.name')    => 10
        );

        $actionName = class_basename($request->route()->getActionname());
        if ($actionName === 'TeamUserController@inviteUser') {
            $user = $request->user();
            $email = $request->email;
            $inviteUser = $this->userService->findUser(array('email' => $email));
            if ($inviteUser) {
                return response()->json([
                    'status'            => 423,
                    'message'           => 'User had been registered already!',
                ], 423);
            }
            $inviteUser = $this->teamInvitationService->findUser($email);
            if ($inviteUser) {
                return response()->json([
                    'status'            => 425,
                    'message'           => 'User had been invited already!',
                ], 425);
            }

            $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);

            $teamId = $this->teamService->getTeamId($user);
            $userCount = $this->teamUserService->getTeamUsersCount($teamId);

            if ($userCount >= $additionalUsersCount[$subscribedPlanName]) {
                if ($subscribedPlanName === config('services.plans.premium.name')) {
                    $customerId = $this->stripeService->getUserStripeId($user);
                    $charge = $this->stripeService->charge(
                        array(
                            'customer_id'   => $customerId,
                            'amount'        => 15
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
                } else {
                    return response()->json([
                        'status'            => 422,
                        'message'           => __('error.user.team.limit'),
                    ], 421);
                }
            }
        }
        return $next($request);
    }
}
