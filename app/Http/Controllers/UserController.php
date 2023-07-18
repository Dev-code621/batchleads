<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Requests\EmailChangeRequest;
use App\Http\Requests\PasswordChangeRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\SendTokenRequest;
use App\Http\Requests\VerifyTokenRequest;
use App\Http\Requests\UpdateUserRoleRequest;
use App\Http\Requests\UpdateUserPhotoRequest;
use App\Http\Requests\UpdateUserInfoRequest;
use App\Http\Requests\RegisterOneSignalUserIdRequest;
use App\Http\Requests\CancelOrPauseUserRequest;
use App\Http\Resources\UserResource;
use App\Mail\UserSurvey;
use App\Repositories\UserRepository;
use App\Services\UserService;
use App\Services\OneSignalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Services\TelnyxService;
use App\Services\CreditBallanceService;
use App\Services\CreditTransactionService;
use App\Services\TeamUserService;
use App\Services\TeamService;
use App\Services\StripeService;
use App\Services\AddOnService;
use App\Services\PropertyService;
use App\Services\AutoRechargeSettingService;
use App\Services\TwilioService;
use App\Services\UserCancelService as ServicesUserCancelService;
use Mail;
use Log;

/**
 * Class UserController
 *
 * @package App\Http\Controllers
 */
class UserController
{
    /**
     * @var UserRepository
     */
    protected $userRepository;
    /**
     * @var UserService
     */
    protected $userService;

    protected $telnyxService;
    protected $creditBallanceService;
    protected $creditTransactionService;
    protected $teamUserService;
    protected $stripeService;
    protected $oneSignalService;
    protected $propertyService;
    protected $userCancelService;

    /**
     * UserController constructor.
     *
     * @param UserService $userService
     */
    public function __construct(
        UserService $userService,
        TelnyxService $telnyxService,
        UserRepository $userRepository,
        CreditBallanceService $creditBallanceService,
        CreditTransactionService $creditTransactionService,
        TeamUserService $teamUserService,
        StripeService $stripeService,
        OneSignalService $oneSignalService,
        TeamService $teamService,
        AddOnService $addOnService,
        PropertyService $propertyService,
        AutoRechargeSettingService $autoRechargeSettingService,
        TwilioService $twilioService,
        ServicesUserCancelService $userCancelService
    )
    {
        $this->userService = $userService;
        $this->userRepository = $userRepository;
        $this->telnyxService = $telnyxService;
        $this->creditBallanceService = $creditBallanceService;
        $this->creditTransactionService = $creditTransactionService;
        $this->teamUserService = $teamUserService;
        $this->stripeService = $stripeService;
        $this->oneSignalService = $oneSignalService;
        $this->teamService = $teamService;
        $this->addOnService = $addOnService;
        $this->propertyService = $propertyService;
        $this->autoRechargeSettingService = $autoRechargeSettingService;
        $this->twilioService = $twilioService;
        $this->userCancelService = $userCancelService;
    }

    public function verify(VerifyTokenRequest $request)
    {
        $errorMessage = '';
        $data = $request->validated();
        $token = $data['token'];

        $data = base64_decode($token);
        $success = false;

        $data = explode(":", $data);
        if (count($data) < 2) {
            return $this->responseWithError(__('error.user.link.invalid'));
        }

        $token = $data[0];
        $email = $data[1];

        $user = $this->userService->findUser(array('email' => $email));

        if ($user) {
          if ($user->token === $token) {
            // check token validation
            // $date = Carbon::parse($user->updated_at);
            // $now = Carbon::now();
            // $diff = $date->diffInDays($now);
            // if ($diff > 0) {
            //     return $this->responseWithError(__('error.user.link.expired'), 421);
            // }

            if (!$user->hasVerifiedEmail()) {// not yet verified
                $user->markEmailAsVerified();
                return $this->responseWithSuccess('Your account has been verified.');
            } else {
                $errorMessage = __('error.user.link.already.verified');
            }
          } else {
              $errorMessage = __('error.user.link.invalid');
          }
        } else {
            $errorMessage = __('error.user.link.email.notregistered');
        }
        return $this->responseWithError($errorMessage);
    }

    /**
     * Resend User Signup verification Link
     *
     * @param Request $request
     * @param String $email
     *
     * @return mixed
     */
    public function resendVerification(VerifyTokenRequest $request)
    {
        $data = $request->validated();

        $errorMessage = '';
        $data = $request->validated();
        $token = $data['token'];

        $data = base64_decode($token);

        $data = explode(":", $data);
        if (count($data) < 2) {
            return $this->responseWithError(__('error.user.link.invalid'));
        }

        $token = $data[0];
        $email = $data[1];

        $user = $this->userService->findUser(array('email' => $email));

        if ($user) {
            if ($user->hasVerifiedEmail()) {
                $errorMessage = __('error.user.link.already.verified');
            } else {
                $this->userService->sendRegistrationVerifyLink($user);
                return $this->responseWithSuccess('Verification email sent.');
            }
        } else {
            $errorMessage = __('error.user.link.email.notregistered');
        }

        return $this->responseWithError($errorMessage);
    }

    /**
     * Change Password
     *
     * @param PasswordChangeRequest $request
     *
     * @return mixed
     */
    public function changePassword(PasswordChangeRequest $request)
    {
        $data = $request->validated();
        if (auth()->user()) {
            $request->validate([
                'cur_password' => 'required',
            ]);
            $user = $this->userService->findUser(['email' => auth()->user()->email]);

            if(!Hash::check($data['cur_password'], $user->password())) {
                return $this->responseWithError(__('error.user.password.mismatching'));
            }

            $this->userRepository->update($user->id, ['password' => Hash::make($data['new_password'])]);

            return $user
                ? $this->responseWithSuccess(new UserResource($user), 'user.update.success')
                : $this->responseWithError('Password update failed');
        } else {
            $request->validate([
                'email' => 'required',
                'token' => 'required',
            ]);
            $user = $this->userService->findUser(['email' => $data['email']]);
            if ($user) {
                // check token validation
                // $date = Carbon::parse($user->updated_at);
                // $now = Carbon::now();
                // $diff = $date->diffInDays($now);
                // if ($diff > 0) {
                //     $message = __('error.user.link.expired');
                //     return $this->responseWithError($message, 425);
                // }
                if ($user->token != $data['token']) {
                    return $this->responseWithError(__('error.user.token.invalid'), 426);
                } else {
                    $this->userRepository->update($user->id, [
                        'password' => Hash::make($data['new_password']),
                        'token' => ''
                    ]);
                    return $this->responseWithSuccess(new UserResource($user), 'user.update.success');
                }
            } else {
                return $this->responseWithError(__('error.user.link.email.notregistered'), 427);
            }
        }
    }

    /**
     * Send Forgot Password Link
     *
     * @param ForgotPasswordRequest $request
     *
     * @return mixed
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $data = $request->validated();
        $user = $this->userService->findUser(['email' => $data['email']]);

        if ($user) {
            // if (!$user->hasVerifiedEmail()) {
            //     return $this->responseWithError('Need to verify your email.');
            // }
            $this->userService->sendForgotPasswordLink($user);
            return $this->responseWithSuccess('user.forgot.password.mail.sent');
        } else {
            return $this->responseWithError('No email address found.');
        }
    }

    /**
     * Send Token
     *
     * @param SendTokenRequest $request
     *
     * @return mixed
     */
    public function sendToken(SendTokenRequest $request)
    {
        $data = $request->validated();
        $user = $this->userService->findUser(['email' => $data['email']]);

        if (auth()->user()) {
            if($user && $user->id != auth()->user()->id) {
                return response()->error(['success' => false], 'Email is already exist.');
            }

            $user = auth()->user();
            $user->email = $data['email'];
            $this->userService->sendTokenByEmail($user);

            return $user
                ? response()->success(new UserResource($user), 'user.update.success')
                : response()->error(['user.update.failed'], 'user.update.failed');
        } else {
            if ($user) {
                $this->userService->sendTokenByEmail($user);
                return response()->success(new UserResource($user), 'user.update.success');
            } else {
                return response()->error(['user.update.failed'], 'No email address found.');
            }
        }
    }
    /**
     * Change Email
     *
     * @param EmailChangeRequest $request
     *
     * @return mixed
     */
    public function changeEmail(EmailChangeRequest $request)
    {
        $data = $request->validated();

        if (auth()->user()) {
            $user = $this->userService->changeEmail($data);

            return $user
                ? response()->success(new UserResource($user), 'user.update.success')
                : response()->error(['user.update.failed'], 'Verification code is not correct.');
        } else {
            $user = $this->userService->findUser(['email' => $data['email']]);
            if ($user) {
                if ($user->token != $data['token']) {
                    return response()->error(['user.update.failed'], 'Verification code is not correct.');
                } else {
                    return response()->success(new UserResource($user), 'user.update.success');
                }
            } else {
                return response()->error(['user.update.failed'], 'No email address found.');
            }
        }
    }

    /**
     * @param array $params
     *
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function list(array $params): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        return $this->userRepository->list($params);
    }

    /**
     * Search Available Telny Phone Number
     *
     * @return mixed
     */
    public function searchTelnyxNumbers()
    {
        $data = $this->telnyxService->searchNumbers();
        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError('telnyx.phonenumber.search.fail');
    }

    /**
     * Purchase Phone Number
     *
     * @param Request $request
     * @param $phoneNumber
     *
     * @return mixed
     */
    public function purchasePhoneNumber(Request $request, $phoneNumber)
    {
        $user = $request->user();

        $transactionType = config('services.credit_transaction_type.purchase_phone');
        $userId = $user['id'];
        $ballance = $this->creditBallanceService->checkBallanceByTransactionType($userId, $transactionType, 1);
        if (!$ballance) {
            return $this->responseWithError('Credit Balance is not enough', 421);
        }

        $data = $this->telnyxService->purchasePhoneNumber($phoneNumber);

        if ($data) {
            if (array_key_exists('errors', $data)) {
               return $this->responseWithError($data['errors']);
            } else {
                $this->userService->changeTelnyxNumber($user['id'], $data['data']['phone_numbers'][0]['phone_number']);
                $this->creditTransactionService->addTransactionByTransactionType($userId, $transactionType, 1, $data['data']['phone_numbers'][0]['phone_number'], 'Purchase Phone');
                return $this->responseWithSuccess($data);
            }
        } else {
            return $this->responseWithError('Purchase Failed');
        }
    }

    /**
     * Update User Role
     *
     * @param UpdateUserRoleRequest $request
     *
     * @return mixed
     */
    public function updateUserRole(UpdateUserRoleRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        if ($user['id'] === $data['user_id']) {
            return $this->responseWithError('You can not update your role', 424);
        }

        $teamId = $this->teamService->getTeamId($user);

        if ($teamId !== 0) {
            $role = $data['role'];
            $userId = $data['user_id'];

            if ($this->teamUserService->isUserRegistered($userId, $teamId)) {
                $result = $this->userService->updateUserRole($data);

                return $result
                    ? $this->responseWithSuccess($data)
                    : $this->responseWithError('Updated Failed!');
            }
            return $this->responseWithError('User is not registered to your team member', 423);
        }

        return $this->responseWithError('You are not registered to any team member', 424);
    }

    public function updateUserPhoto(UpdateUserPhotoRequest $request)
    {
        $path = Storage::disk('s3')->put('images/user', $request->file);
        $url = Storage::disk('s3')->url($path);
        $user = $request->user();
        $result = $this->userService->updateUserPhoto(array('user_id' => $user['id'], 'photo_url' => $url));

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError('Update Failed!');
    }

    public function updateUserInfo(UpdateUserInfoRequest $request)
    {
        $user = $request->user();

        $data = $request->validated();
        $request->validate([
            'phone' => 'required|unique:users,phone,' . $user->id,
        ]);

        $data['user_id'] = $user->id;
        $result = $this->userService->updateUserInfo($data);

        if ($request->file) {
            $path = Storage::disk('s3')->put('images/user', $request->file);
            $url = Storage::disk('s3')->url($path);
            $result = $this->userService->updateUserPhoto(array('user_id' => $user['id'], 'photo_url' => $url));
        }

        if ($result) {
            $result = $this->getAdditionalUserInfos($user);
        }

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError('Update Failed!');
    }

    public function getUserInfo(Request $request)
    {
        $user = $request->user();
        $user = $this->getAdditionalUserInfos($user);

        return $user
                ? $this->responseWithSuccess($user)
                : $this->responseWithError('Get User Info Failed!');
    }

    protected function getAdditionalUserInfos($user)
    {
        $user['subscribed_plan'] = $this->stripeService->getUserSubscribedPlanName($user);
        if ($user['subscribed_plan'] === config('services.plans.pause.name')) {
            $user['is_paused'] = true;
        }
        $user['team_id'] = $this->teamService->getTeamId($user);
        $user['add_ons'] = $this->stripeService->getAddOns($user);
        $autoRechargeSettings = $this->autoRechargeSettingService->getAutoRechargeSettingByTeamId($user['team_id']);
        if (count($autoRechargeSettings)) {
           $user['auto_recharge_setting'] = $autoRechargeSettings[0];
        }
        $customerId = $user['stripe_id'];
        $cards = null;
        if ($customerId && $user['id'] !== 1) {
            if ($user->hasPaymentMethod()) {
                $paymentMethods = $user->paymentMethods();
                $cards = array();
                foreach ($paymentMethods as $paymentMethod) {
                    $cards []= $paymentMethod->asStripePaymentMethod();
                }
                $user['is_trial'] = $this->stripeService->isUserTrial($user);
                $user['is_cancelled'] = $this->stripeService->isUserCancelledSubscription($user);
                $user['is_pastdue'] = $this->stripeService->isUserPastDue($user);
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
                $user['discount'] = $this->stripeService->getUserDiscountInfo($user);
                if ($subscription) {
                    $trialEndsAt = $subscription['trial_ends_at'];
                    if ($trialEndsAt) {
                        $date = Carbon::parse($trialEndsAt);
                        $now = Carbon::now();
                        $diff = $date->diffInDays($now);
                        $user['trial_ends_at'] = $trialEndsAt;
                        $user['trial_left_days'] = $diff;
                    }
                }

                $user['payment_method'] = $this->stripeService->getDefaultPaymentMethod($customerId);

                $freeSkipTracingCount = $this->creditBallanceService->getFreeSkipTracingCount($user);
                $skipTracedCount = $this->creditBallanceService->getSkipTracedCount($user['team_id']);
                $user['free_skiptracing_count'] = $freeSkipTracingCount;
                $user['skip_traced_count'] = $skipTracedCount;
                $user['free_skiptracing_available_count'] = ($freeSkipTracingCount - $skipTracedCount) > 0 ? ($freeSkipTracingCount - $skipTracedCount) : 0;
                $user['self_cancelled'] = $this->userCancelService->isSelfCancelled($user);
            } else {
                $user['is_cancelled'] = true;
                $user['self_cancelled'] = true;
            }
        }
        $user['payment_methods'] = $cards;
        $user['property_count'] = $this->propertyService->getSearchCount(array(
            'team_id' => $user['team_id']
        ));

        if ($user->subscribed('main')) {
            $planId = $user->subscription('main')->stripe_plan;
            $result = $this->stripeService->getPlan($planId);

            if ($result) {
                $user['subscription'] = $result;
            }
        }

        $credits = $this->creditBallanceService->getBallanceByUserId($user['id']);
        if (count($credits)) {
            $user['credit'] = $credits[0];
        }
        if ($user['role'] !== 'owner') {
            $ownerUserId = $this->teamUserService->getOwnerUserId($user['id']);
            $credits = $this->creditBallanceService->getBallanceByUserId($ownerUserId);
            if (count($credits)) {
                $user['credit'] = $credits[0];
            }
        }

        return $user;
    }

    public function registerOneSignalUserId(RegisterOneSignalUserIdRequest $request)
    {
        $data = $request->validated();
        $oneSignalUserId = $data['one_signal_user_id'];
        $user = $request->user();
        $userId = $user['id'];

        $result = $this->oneSignalService->registerOneSignalUserId(
            array(
                'user_id'               => $userId,
                'one_signal_user_id'    => $oneSignalUserId
            )
        );

        return $result
                ? $this->responseWithSuccess($result)
                : $this->responseWithError('Registration Failed!');
    }

    public function cancelUser(CancelOrPauseUserRequest $request)
    {
        try {
            $request->validate([
                'survey_id' => 'required|in:cost_much,not_using,technical_support,data_quality,customer_service,found_alternative,learn_more',
            ]);
            $user = $request->user();
            $userId = $user['id'];
            $data = $request->validated();
            // $messagingServiceId = $user['twilio_messaging_service_id'];
            // if ($messagingServiceId) {
            //     $phoneNumbers = $this->twilioService->getPurchasedPhoneNumbers($messagingServiceId);
            //     if ($phoneNumbers) {
            //         foreach ($phoneNumbers as $phoneNumber) {
            //             $sid = $phoneNumber['sid'];
            //             $this->twilioService->deletePhoneNumber($messagingServiceId, $sid);
            //         }
            //     }
            //     $this->twilioService->deleteMessagingService($messagingServiceId);
            // }

            // $this->cancelUserAddOns($user);
            // $this->stripeService->cancel($user);

            // $this->userService->deleteUserById($userId);

            $upcomingInvoice = $this->stripeService->getUpcomingInvoice($user['stripe_id']);
            $nextPaymentAttempt = $upcomingInvoice['next_payment_attempt'];
            $now = Carbon::createFromTimestamp(intval($nextPaymentAttempt));
            // $now = Carbon::now();
            $now = $now->addDays(30);
            $userCancelInfos = $this->userCancelService->findWhere(
                array(
                    'user_id'   => $userId
                )
            );
            if (count($userCancelInfos)) {
                $this->userCancelService->update(
                    $userCancelInfos[0]['id'],
                    array (
                        'cancel_at' => $now,
                        'active'    => 1
                    )
                );
            } else {
                $this->userCancelService->create(
                    array(
                        'user_id'   => $userId,
                        'cancel_at' => $now,
                        'active'    => 1
                    )
                );
            }

            $this->sendSurveyEmail($data);
            $this->userCancelService->sendCancelInfoEmail($user);

            return $this->responseWithSuccess('Success');
        } catch (\Exception $e) {
            $message = $e->getMessage();
            return $this->responseWithError($message);
        }
    }

    public function pauseUser(CancelOrPauseUserRequest $request)
    {
        try {
            $user = $request->user();
            $data = $request->validated();
            $this->stripeService->subscribeChange($user, config('services.plans.pause.id'));
            $this->cancelUserAddOns($user);

            $this->sendSurveyEmail($data);

            return $this->responseWithSuccess('Success');
        } catch (\Exception $e) {
            $message = $e->getMessage();
            return $this->responseWithError($message);
        }
    }

    protected function cancelUserAddOns($user)
    {
        $addOns = $this->stripeService->getAddOns($user);
        if ($addOns) {
            foreach ($addOns as $addOn) {
                $this->stripeService->cancelAddOn($user, $addOn['add_on']);
            }
        }
    }

    protected function sendSurveyEmail($data)
    {
        $survey = config('services.cancel_or_pause_survey');
        $message = $survey[$data['survey_id']]['label'];
        if (array_key_exists('text', $data)) {
            $message .= ': ' . $data['text'];
        }

        Mail::to(config('mail.to.survey_address'))
            ->cc(config('mail.to.survey_address_cc'))
            ->send(new UserSurvey($message));
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
