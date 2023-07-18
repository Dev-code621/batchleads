<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Error\Card;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Charge;

class CheckoutController extends BaseController
{

    public function charge(Request $request)
    {
        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $customer = Customer::create(array(
                'email' => $request->stripeEmail,
                'source' => $request->stripeToken
            ));

            $charge = Charge::create(array(
                'customer' => $customer->id,
                'amount' => 1999,
                'currency' => 'usd'
            ));

            return 'Charge successful, you get the course!';
        } catch (Card $ex) {
            return $ex->getMessage();
        }
    }

    public function subscribe_process(Request $request)
    {
        try {
            $userId = auth()->user()->id;
            Stripe::setApiKey(config('services.stripe.secret'));

            $user = User::find($userId);
            $isSubscribed = auth()->user()->subscribedToPlan($request->stripe_plan, 'main');
            
            // if ($isSubscribed) {
            //     return response()->json([
            //         'message' => 'subscribe.fail.already.subscribed'
            //     ]);
            // }
            $user->newSubscription('main', $request->stripe_plan)->create($request->stripe_token);

            return response()->json([
                'message' => 'subscribe.success'
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 422);
        }

    }

    public function plan_change()
    {
        try {
            $userId = auth()->user()->id;
            Stripe::setApiKey(config('services.stripe.secret'));

            $user = User::find($userId);

            $user->subscription('main')->swap($request->stripe_plan);

            return response()->json([
                'message' => 'success'
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 422);
        }

    }

    public function plan_cancel()
    {
        try {
            $userId = auth()->user()->id;
            Stripe::setApiKey(config('services.stripe.secret'));

            $user = User::find($userId);

            $user->subscription('main')->cancel();

            return response()->json([
                'message' => 'stripe.subscribe.cancel.success'
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => $ex->getMessage()
            ], 422);
        }

    }

    public function invoices()
    {
        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $user = User::find(1);

            $invoices = $user->invoices();

            return view('invoices', compact('invoices'));

        } catch (\Exception $ex) {
            return $ex->getMessage();
        }

    }

    public function invoice($invoice_id)
    {
        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            $user = User::find(1);

            return $user->downloadInvoice($invoice_id, [
                'vendor'  => 'Your Company',
                'product' => 'Your Product',
            ]);

        } catch (\Exception $ex) {
            return $ex->getMessage();
        }

    }

    public function getStripeToken(Request $request) {
        return response()->json([
            'stripe_token' => $request->stripeToken
        ]);
    }
}
