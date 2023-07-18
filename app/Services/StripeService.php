<?php

namespace App\Services;

use Stripe\Error\Card;
use Stripe\Stripe;
use Stripe\Invoice;
use Stripe\Customer;
use Stripe\Charge;
use Stripe\Plan;
use Stripe\Subscription;
use Stripe\Coupon;
use Carbon\Carbon;
use App\Services\TeamUserService;
use App\Services\UserService;
use App\Models\User;
use Exception;

/**
 * Class StripeService
 * @package App\Services
 */
class StripeService
{
    protected $teamUserService;
    protected $userService;

    /**
     * StripeService constructor.
     */
    public function __construct(
        TeamUserService $teamUserService,
        UserService $userService
    )
    {
        $this->teamUserService = $teamUserService;
        $this->userService = $userService;
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function charge(array $data)
    {
        try {
            $charge = Charge::create(array(
                'customer'  => $data['customer_id'],
                'amount'    => $data['amount'] * 100,
                'currency'  => 'usd'
            ));

            return $charge;
        } catch (Card $ex) {
            return null;
        }
    }

    public function createCustomer(array $data)
    {
        try {
            $customer = Customer::create(array(
                'email'     => $data['stripe_email'],
                'source'    => $data['stripe_token'],
                'name'      => $data['name']
            ));

            return $customer;
        } catch (Card $ex) {
            return null;
        }
    }

    public function getPlans($yearlyOnly = false)
    {
        $mainPlans = config('services.plans');

        $response = Plan::all(array('limit' => 100));
        $plans = $response['data'];
        $plansToReturn = [];
        foreach ($plans as $plan) {
            foreach ($mainPlans as $mainPlan) {
                $isYearly = $mainPlan['is_yearly'] ?? false;
                if ($mainPlan['id'] === $plan['id']) {
                    if ($yearlyOnly) {
                        if ($isYearly) {
                            $plansToReturn []= $plan;
                        }
                    } else {
                        if (!$isYearly) {
                            $plansToReturn []= $plan;
                        }
                    }

                }
            }
        }

        return $plansToReturn;
    }

    public function subscribe(User $user, $stripePlan, $stripeToken, $promoCode = null)
    {
        try {
            if ($promoCode) {
                $couponInfo = $this->getCoupon(strtoupper($promoCode));
                if (!$couponInfo) {
                    // return 423;
                    $promoCode = null;
                }
            }
            $isSubscribed = $user->subscribedToPlan($stripePlan, 'main');

            if ($isSubscribed) {
                return 421;
            }
            $trialPeriod = 7;
            $plans = config('services.plans');
            foreach($plans as $plan) {
                if ($plan['id'] === $stripePlan) {
                    if ($plan['is_yearly']) {
                        $trialPeriod = 60;
                    }
                }
            }
            // if ($stripePlan === config('services.plans.standard.id')) {
            //     $trialPeriod = 30;
            // }
            $customer = $user->createAsStripeCustomer(
                array(
                    'email'     => $user['email'],
                    'name'      => $user['name'],
                    'phone'     => $user['phone'],
                    'metadata'  => array(
                        'email'     => $user['email'],
                        'name'      => $user['name'],
                        'phone'     => $user['phone'],
                        'plan'      => $stripePlan,
                        // 'coupon'    => $promoCode
                    )
                )
            );
            if (!$customer) {
                return 424;
            }
            $card = $this->addCard($customer['id'], $stripeToken);
            if (!$card) {
                return 425;
            }
            $paymentMethod = $user->defaultPaymentMethod();
            if ($promoCode) {
                $user->newSubscription('main', $stripePlan)
                    ->trialUntil(Carbon::now()->addDays($trialPeriod))
                    ->withCoupon(strtoupper($promoCode))
                    ->create($paymentMethod['id']);
            } else {
                $user->newSubscription('main', $stripePlan)
                    ->trialUntil(Carbon::now()->addDays($trialPeriod))
                    // ->create($stripeToken, ['name' => $customerName]);
                    ->create($paymentMethod['id']);
            }

            return 200;
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    protected function getCoupon($coupon)
    {
        try {
            return Coupon::retrieve($coupon, []);
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function reSubscribe(User $user, $stripePlan)
    {
        try {
            $paymentMethod = $user->defaultPaymentMethod()->asStripePaymentMethod();
            $result = $user->newSubscription('main', $stripePlan)
                ->create($paymentMethod->id);
            return 200;
        }
        catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    public function reSubscribeWithCard(User $user, $stripePlan, $cardId)
    {
        try {
            $result = $user->newSubscription('main', $stripePlan)
                ->create($cardId);
            return 200;
        }
        catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    public function subscribeChange(User $user, $newStripePlan)
    {
        try {
            $user->subscription('main')->swap($newStripePlan);
            $user->updateStripeCustomer(
                array(
                    'metadata'  => array(
                        'plan'      => $newStripePlan,
                    )
                )
            );
            return 200;
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    public function cancel(User $user)
    {
        $user->subscription('main')->cancel();
    }

    public function getCard($customerId)
    {
        try {
            $response = Customer::allSources(
                $customerId,
                ['object' => 'card']
            );

            return $response['data'];
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function getCustomer($customerId)
    {
        return Customer::retrieve($customerId);
    }

    public function addCard($customerId, $stripeToken)
    {
        try {
            $response = Customer::createSource(
                $customerId,
                ['source' => $stripeToken]
            );
            return $response;
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function removeCard($customerId, $cardId)
    {
        try {
            $response = Customer::deleteSource(
                $customerId,
                $cardId
            );

            return $response;
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function getPlan($planId) {
        try {
            return Plan::retrieve($planId);
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function getUserPlan($user) {
        if ($user->subscribed('main')) {
            $plan = $user->subscription('main');
            if ($plan['stripe_plan'] === config('services.plans.basic.id')) {
                return array(
                    'name'  => config('services.plans.basic.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.basic_new.id')) {
                return array(
                    'name'  => config('services.plans.basic_new.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.basic_yearly.id')) {
                return array(
                    'name'  => config('services.plans.basic_yearly.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.standard.id')) {
                return array(
                    'name'  => config('services.plans.standard.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.standard_new.id')) {
                return array(
                    'name'  => config('services.plans.standard_new.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.standard_yearly.id')) {
                return array(
                    'name'  => config('services.plans.standard_yearly.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.premium.id')) {
                return array(
                    'name'  => config('services.plans.premium.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.premium_new.id')) {
                return array(
                    'name'  => config('services.plans.premium.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.premium_yearly.id')) {
                return array(
                    'name'  => config('services.plans.premium_yearly.name'),
                    'id'    => $plan['stripe_plan']
                );
            }
            if ($plan['stripe_plan'] === config('services.plans.pause.id')) {
                return array(
                    'name'  => config('services.plans.pause.name'),
                    'id'    => $plan['stripe_plan']
                );
            }

            return array(
                'name'  => config('services.plans.basic.name'),
                'id'    => 0
            );
        }
        return null;
    }

    public function isUserTrial($user) {
        if ($user['id'] === 1) {
            return false;
        }
        $ownerUser = $this->userService->getOwnerUser($user);

        if ($ownerUser) {
            if ($ownerUser->subscribed('main')) {
                return $ownerUser->subscription('main')->onTrial();
            }
        }

        return false;
    }

    public function isUserCancelledSubscription($user) {
        if ($user['id'] === 1) {
            return false;
        }
        $ownerUser = $this->userService->getOwnerUser($user);

        if ($ownerUser) {
            if ($ownerUser->hasIncompletePayment('main')) {
                return false;
            }
            if ($ownerUser->subscribed('main')) {
                if ($ownerUser->subscription('main')->cancelled()) {
                    if ($ownerUser->subscription('main')->ended()) {
                        return true;
                    }
                }
                return false;
            }
        }

        return true;
    }

    public function isUserPastDue($user)
    {
        if ($user['id'] === 1) {
            return false;
        }
        $ownerUser = $this->userService->getOwnerUser($user);

        if ($ownerUser) {
            return $ownerUser->hasIncompletePayment('main');
        }

        return false;
    }

    public function endUserTrial($user) {
        $plan = $this->getUserPlan($user);
        if ($user->subscribed('main')) {
            return $user->subscription('main')->skipTrial()->swap($plan['id']);
        }
        return null;
    }

    public function getUserSubscribedPlanName($user)
    {
        $subscribedPlanName = null;
        $ownerUser = $this->userService->getOwnerUser($user);

        if ($ownerUser) {
            $subscribedPlan = $this->getUserPlan($ownerUser);
            if ($subscribedPlan) {
                $subscribedPlanName = $subscribedPlan['name'];
            }
        }

        return $subscribedPlanName;
    }

    public function getUserStripeId($user)
    {
        $ownerUser = $this->userService->getOwnerUser($user);

        return $ownerUser ? $ownerUser['stripe_id'] : null;
    }

    public function getDefaultPaymentMethod($customerId)
    {
        try {
            $response = Customer::retrieve($customerId);
            return $response['default_source'];
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function setDefaultPaymentMethod($customerId, $paymentId)
    {
        try {
            $customer = Customer::update(
                $customerId,
                [
                    'default_source'    => $paymentId,
                    'invoice_settings'  => ['default_payment_method' => $paymentId]
                ]
            );

            return $customer;
        } catch (Card $ex) {
            return null;
        }
    }

    public function getSubscription($subscriptionId)
    {
        try {
            return Subscription::retrieve($subscriptionId);
        } catch (Exception $e) {
            return null;
        }
    }

    public function getUserDiscountInfo($user)
    {
        $discount = null;
        $subscriptions = $user['subscriptions'];
        foreach ($subscriptions as $subscriptionItem) {
            $plans = config('services.plans');
            foreach ($plans as $plan) {
                if ($plan['id'] === $subscriptionItem['stripe_plan']) {
                    $subscriptionInfo = $this->getSubscription($subscriptionItem['stripe_id']);
                    if ($subscriptionInfo) {
                        $discount = $subscriptionInfo['discount'];
                    }
                }
            }
        }

        return $discount;
    }

    public function subscribeAddOn($user, $addOn)
    {
        try {
            if (!$user->subscribed('main')) {
                return 420;
            }
            if ($this->isUserCancelledSubscription($user)) {
                return 423;
            }

            if ($user->hasIncompletePayment($addOn)) {
                return 424;
            }

            $isSubscribed = $user->subscribed($addOn);

            if ($isSubscribed) {
                $isCancelled = $user->subscription($addOn)->cancelled();
                if (!$isCancelled) {
                    return 421;
                }
                if ($user->subscription($addOn)->onGracePeriod()) {
                    $user->subscription($addOn)->resume();
                    return 200;
                }
            }
            $paymentMethod = $this->getDefaultPaymentMethod($user['stripe_id']);

            $stripePlan = null;
            $addOns = config('services.add_ons');
            foreach ($addOns as $item) {
                if ($addOn === $item['name']) {
                    $stripePlan = $item['plan_id'];
                }
            }

            $trial = 0;
            if ($this->isUserTrial($user)) {
                $subscription = null;
                $subscriptions = $user['subscriptions'];
                foreach ($subscriptions as $subscriptionItem) {
                    $plans = config('services.plans');
                    foreach ($plans as $plan) {
                        if ($plan['id'] === $subscriptionItem['stripe_plan']) {
                            $subscription = $subscriptionItem;
                        }
                    }
                }

                if ($subscription) {
                    $trialEndsAt = $subscription['trial_ends_at'];
                    if ($trialEndsAt) {
                        $date = Carbon::parse($trialEndsAt);
                        $now = Carbon::now();
                        $diff = $date->diffInDays($now);
                        $trial = $diff;
                    }
                }
            }

            if ($paymentMethod) {
                if ($trial === 0) {
                    $user->newSubscription($addOn, $stripePlan)
                        ->create($paymentMethod);
                } else {
                    $user->newSubscription($addOn, $stripePlan)
                        ->trialUntil(Carbon::now()->addDays($trial))
                        ->create($paymentMethod);
                }

                return 200;
            } else {
                return 424;
            }
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    public function cancelAddOn($user, $addOn)
    {
        try {
            if (!$user->subscribed('main')) {
                return 423;
            }
            if ($this->isUserCancelledSubscription($user)) {
                return 424;
            }
            $isSubscribed = $user->subscribed($addOn);

            if (!$isSubscribed) {
                return 421;
            }
            $user->subscription($addOn)->cancel();
            return 200;
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    public function endAddOnTrial($user, $addOn)
    {
        try {
            $isSubscribed = $user->subscribed($addOn);
            if (!$isSubscribed) {
                return 421;
            }

            $stripePlan = null;
            $addOns = config('services.add_ons');
            foreach ($addOns as $item) {
                if ($addOn === $item['name']) {
                    $stripePlan = $item['plan_id'];
                }
            }

            $user->subscription($addOn)->skipTrial()->swap($stripePlan);
            return 200;
        } catch (\Exception $ex) {
            return $ex->getMessage();
        }
    }

    public function getAddOns($user)
    {
        try {
            $addOns = config('services.add_ons');
            if ($user['id'] === 1) {
                foreach ($addOns as $addOn) {
                    $userAddOns []= array(
                        'id'        => $addOn['plan_id'],
                        'add_on'    => $addOn['name']
                    );
                }
                return $userAddOns;
            }
            // if (!$user->subscribed('main')) {
            //     return null;
            // }
            if ($this->isUserCancelledSubscription($user)) {
                return null;
            }
            $ownerUser = $this->userService->getOwnerUser($user);

            $userAddOns = [];
            if ($ownerUser) {
                foreach ($addOns as $addOn) {
                    $subscribedPlanName = $this->getUserSubscribedPlanName($ownerUser);

                    if (
                        $subscribedPlanName === config('services.plans.premium.name')
                        || $subscribedPlanName === config('services.plans.premium_new.name')
                        || $subscribedPlanName === config('services.plans.premium_yearly.name')
                    ) {
                        $userAddOns []= array(
                            'id'        => $addOn['plan_id'],
                            'add_on'    => $addOn['name']
                        );
                    } else {
                        if ($ownerUser->subscribed($addOn['name'])) {
                            if(!$ownerUser->subscription($addOn['name'])->cancelled()) {
                                $userAddOns []= array(
                                    'id'        => $addOn['plan_id'],
                                    'add_on'    => $addOn['name']
                                );
                            }
                        }
                    }
                }
            }

            return $userAddOns;
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function getUpcomingInvoice($customerId)
    {
        try {
            return Invoice::upcoming(["customer" => $customerId]);
        } catch (\Exception $ex) {
            return null;
        }
    }

    public function getAddOnList()
    {
        $mainPlans = config('services.add_ons');

        $response = Plan::all(array('limit' => 100));
        $plans = $response['data'];
        $plansToReturn = [];
        foreach ($plans as $plan) {
            foreach ($mainPlans as $mainPlan) {
                if ($mainPlan['plan_id'] === $plan['id']) {
                    $plansToReturn []= $plan;
                }
            }
        }

        return $plansToReturn;
    }
}
