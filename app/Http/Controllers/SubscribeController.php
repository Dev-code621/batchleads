<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ArrayHelpers\Arr;
use App\Services\StripeService;
use App\Services\UserService;
use Illuminate\Routing\Controller as BaseController;
use App\Http\Requests\SubscribeRequest;
use App\Http\Requests\SubscribeChangeRequest;
use App\Http\Requests\AddCardRequest;
use App\Http\Requests\GetPlansRequest;
use App\Http\Requests\RemoveCardRequest;
use App\Http\Requests\SetDefaultCardRequest;
use App\Jobs\CreateStreetViewImage;
use App\Services\UserCancelService;
use App\Services\UserFpService;

class SubscribeController extends BaseController
{
    protected $stripeService;
    protected $userService;
    protected $userFpService;
    protected $userCancelService;

    /**
     * constructor.
     *
     * @param StripeService $service
     */
    public function __construct(
        StripeService $stripeService,
        UserService $userService,
        UserFpService $userFpService,
        UserCancelService $userCancelService
    )
    {
        $this->stripeService = $stripeService;
        $this->userService = $userService;
        $this->userFpService = $userFpService;
        $this->userCancelService = $userCancelService;
    }

    public function getStripeToken(Request $request)
    {
        return $this->responseWithSuccess(array(
            'stripe_token' => $request->stripeToken
        ));
    }

    public function compare ($a, $b) {
        return $a['amount'] > $b['amount'];
    }

    public function getPlans(GetPlansRequest $request)
    {
        $data = $request->validated();
        $yearlyOnly = false;
        if (array_key_exists('yearly_only', $data)) {
            $yearlyOnly = $data['yearly_only'];
        }

        $plans = $this->stripeService->getPlans($yearlyOnly);
        usort($plans, array($this, "compare"));
        $result = [];
        $registeredPlans = config('services.plans');
        foreach ($registeredPlans as $registeredPlan) {
            foreach ($plans as $plan) {
                if ($plan['id'] === $registeredPlan['id']) {
                    $plan['disabled'] = $registeredPlan['disabled'] ?? false;
                    if ($plan['id'] === config('services.plans.pause.id')) {
                        $plan['is_pause'] = true;
                    }
                    $result []= $plan;
                }
            }
        }
        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.plan.list.fail'));
    }

    public function subscribe(SubscribeRequest $request)
    {
        $data = $request->validated();
        $stripePlan = $data['stripe_plan'];
        $stripeToken = $data['stripe_token'];

        $user = $request->user();
        $paused = false;
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
        if ($subscribedPlanName === config('services.plans.pause.name')) {
            $paused = true;
        }
        $cancelled = $this->stripeService->isUserCancelledSubscription($user);
        $subscriptions = $user['subscriptions'];

        if (($paused || $cancelled) && count($subscriptions)) {
            $customerId = $user['stripe_id'];

            $cardId = null;
            if ($customerId) {
                $card = $this->stripeService->addCard($customerId, $stripeToken);
                if (!$card) {
                    return $this->responseWithError($card, 423);
                }
                $cardId = $card['id'];
                $card = $this->stripeService->setDefaultPaymentMethod($customerId, $cardId);
            }
            $result = $this->stripeService->subscribeChange($user, $stripePlan);
            if ($result !== 200) {
                $result = $this->stripeService->reSubscribeWithCard($user, $stripePlan, $cardId);
            }
        } else {
            $promoCode = $request->get('promo_code');
            $firstPromoter = $this->userFpService->getUserPromoterByUserId($user['id']);
            if ($firstPromoter) {
                if ($firstPromoter['tracking_ref_id']) {
                    $promoCode = $firstPromoter['tracking_ref_id'];
                }
            }
            $result = $this->stripeService->subscribe($user, $stripePlan, $stripeToken, $promoCode);
        }

        if ($result === 200) {
            $this->userCancelService->findAndDelete(
                array(
                    'user_id'   => $user['id']
                )
            );
            if ($stripePlan !== config('services.plans.premium.id')
                && $stripePlan !== config('services.plans.premium_new.id')
                && $stripePlan !== config('services.plans.premium_yearly.id')
            ) {
                // Subscribe Add_Ons
                $addOns = Arr::get($data, 'add_ons', null);
                if ($addOns) {
                    $user = $this->userService->findUserById($user['id']);
                    foreach ($addOns as $addOn) {
                        $result = $this->stripeService->subscribeAddOn($user, $addOn);
                    }
                }
            }

            return $this->responseWithSuccess(array('plan_id' => $stripePlan));
        } else if ($result === 421) {
            return $this->responseWithError('Already Subscribed.', 421);
        } else if ($result === 422) {
            return $this->responseWithError(__('error.subscribe.fail'), 422);
        } else if ($result === 424) {
            return $this->responseWithError('Error occured while registering customer.', 424);
        } else if ($result === 425) {
            return $this->responseWithError('Credit Card Error!', 425);
        } else {
            return $this->responseWithError($result, 423);
        }
    }

    public function subscribeChange(SubscribeChangeRequest $request)
    {
        $user = $request->user();
        $isTrial = $this->stripeService->isUserTrial($user);
        $isCancelled = $this->stripeService->isUserCancelledSubscription($user);
        // if ($isTrial && !$isCancelled) {
        //     return $this->responseWithError('You can not change the plan in trial period.');
        // }
        $data = $request->validated();
        if ($isCancelled) {
            $result = $this->stripeService->reSubscribe($request->user(), $data['stripe_plan']);
        } else {
            $result = $this->stripeService->subscribeChange($request->user(), $data['stripe_plan']);
        }

        if ($result === 200 &&
            (
                $data['stripe_plan'] === config('services.plans.premium.id')
                || $data['stripe_plan'] === config('services.plans.premium_new.id')
                || $data['stripe_plan'] === config('services.plans.premium_yearly.id')
            )
        ) {
            CreateStreetViewImage::dispatch($user);
            $addOns = config('services.add_ons');
            foreach ($addOns as $addOn) {
                if ($user->subscribed($addOn['name'])) {
                    $this->stripeService->cancelAddOn($user, $addOn['name']);
                }
            }
        }

        return $result === 200
            ? $this->responseWithSuccess(array('plan_id' => $data['stripe_plan']))
            : $this->responseWithError($result);
    }

    public function getPaymentMethod(Request $request)
    {
        $user = $request->user();
        $customerId = $user['stripe_id'];

        if ($customerId) {
            $card = $this->stripeService->getCard($customerId);

            if ($card) {
                return $this->responseWithSuccess($card);
            }

            return $this->responseWithError(__('error.subscribe.paymentmethod.get.fail'), 423);
        }

        return $this->responseWithError(__('error.subscribe.needed'));
    }

    public function addCard(AddCardRequest $request)
    {
        $user = $request->user();
        $customerId = $user['stripe_id'];
        $data = $request->validated();
        $stripeToken = $data['stripe_token'];

        if ($customerId) {
            $card = $this->stripeService->addCard($customerId, $stripeToken);

            if ($card) {
                return $this->responseWithSuccess($card);
            }

            return $this->responseWithError($card, 423);
        }

        return $this->responseWithError(__('error.subscribe.needed'));
    }

    public function removeCard(RemoveCardRequest $request)
    {
        $user = $request->user();
        $customerId = $user['stripe_id'];
        $data = $request->validated();
        $cardId = $data['card_id'];

        if ($customerId) {
            $card = $this->stripeService->removeCard($customerId, $cardId);

            if ($card) {
                return $this->responseWithSuccess($card);
            }

            return $this->responseWithError(__('error.subscribe.paymentmethod.remove.fail'), 423);
        }

        return $this->responseWithError(__('error.subscribe.needed'));
    }

    public function setDefaultCard(SetDefaultCardRequest $request)
    {
        $user = $request->user();
        $customerId = $user['stripe_id'];
        $data = $request->validated();
        $cardId = $data['card_id'];

        if ($customerId) {
            $card = $this->stripeService->setDefaultPaymentMethod($customerId, $cardId);

            if ($card) {
                return $this->responseWithSuccess($card);
            }

            return $this->responseWithError(__('error.subscribe.paymentmethod.remove.fail'), 423);
        }

        return $this->responseWithError(__('error.subscribe.needed'));
    }

    public function getSubscriptions(Request $request)
    {
        $user = $request->user();
        $planId = null;
        if ($user->subscribed('main')) {
            $planId = $user->subscription('main')->stripe_plan;
            $result = $this->stripeService->getPlan($planId);

            return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError(__('error.subscribe.plan.list.fail'));
        }

        return $this->responseWithError(__('error.subscribe.needed'));
    }

    public function endTrial(Request $request)
    {
        $user = $request->user();
        $result = $this->stripeService->endUserTrial($user);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.subscribe.needed'));
    }

    public function responseWithError($message="fail", $status=422)
    {
        return response()->json([
            'status'  => $status,
            'message' => $message,
        ], $status);
    }

    public function responseWithSuccess($data, $message="success", $status=200)
    {
        $response = array(
            'status'  => $status,
            'message' => $message,
            'data'    => $data
        );

        return response()->json($response, 200);
    }
}
