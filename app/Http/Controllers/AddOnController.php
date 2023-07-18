<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateAddOnRequest;
use App\Http\Requests\CancelAddOnRequest;
// use App\Http\Requests\UpdateAddOnRequest;
use App\Services\AddOnService;
use App\Services\StripeService;
use App\Jobs\CreateStreetViewImage;
use Illuminate\Http\Request;

/**
 * Class AddOnController
 *
 * @package App\Http\Controllers
 */
class AddOnController extends Controller
{
    protected $stripeService;

    /**
     * constructor.
     *
     * @param AddOnService $service
     */
    public function __construct(
        AddOnService $service,
        StripeService $stripeService
    )
    {
        $this->baseService = $service;
        $this->stripeService = $stripeService;
    }

    public function create(CreateAddOnRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $addOns = $this->baseService->findWhere(
            array(
                'user_id'   => $user['id'],
                'add_on'    => $data['add_on']
            )
        );
        if (count($addOns)) {
            return $this->responseWithError('You already have this add-on.');
        }
        if ($data['add_on'] === config('services.add_ons.street_view')) {
            CreateStreetViewImage::dispatch($user);
        }
        return $this->add($request);
    }

    public function subscribeAddOn(CreateAddOnRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $addOn = $data['add_on'];

        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName($user);
        if (
            $subscribedPlanName === config('services.plans.premium.name')
            || $subscribedPlanName === config('services.plans.premium_new.name')
            || $subscribedPlanName === config('services.plans.premium_yearly.name')
        ) {
            return $this->responseWithError('You already have this add-on.');
        }

        $result = $this->stripeService->subscribeAddOn($user, $addOn);
        if ($result === 421) {
            return $this->responseWithError('You already have this add-on.');
        }
        if ($result === 420) {
            return $this->responseWithError('You need to subscribe to the main plan first.');
        }
        if ($result === 423) {
            return $this->responseWithError('You canceled the main subscription.');
        }
        if ($result === 424) {
            return $this->responseWithError('You have incompleted payment.');
        }
        if ($result === 200) {
            if ($addOn === config('services.add_ons.street_view.name')) {
                CreateStreetViewImage::dispatch($user);
            }

            return $this->responseWithSuccess(array('add_on' => $addOn));
        }

        return $this->responseWithError($result);
    }

    public function cancelAddOn(CancelAddOnRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $addOn = $data['add_on'];

        $result = $this->stripeService->cancelAddOn($user, $addOn);
        if ($result === 421) {
            return $this->responseWithError('You do not have this add-on.');
        }
        if ($result === 200) {
            return $this->responseWithSuccess(array('add_on' => $addOn));
        }

        return $this->responseWithError($result);
    }

    public function getAddOns(Request $request)
    {
        $result = $this->stripeService->getAddOnList();
        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.plan.list.fail'));
    }
}
