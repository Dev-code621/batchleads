<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\ValidateRegisterUserRequest;
use App\Http\Requests\LogoutUserRequest;
use App\Services\UserService;
use App\Services\OneSignalService;
use App\Repositories\UserRepository;
use App\Services\UserCancelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */
    /**
     * @var UserRepository
     */
    protected $userRepository;
    /**
     * @var UserService
     */
    protected $userService;

    protected $oneSignalService;

    protected $userCancelService;

    /**
     * LoginController constructor.
     *
     * @param UserRepository $userRepository
     * @param UserService    $userService
     */
    public function __construct(
        UserRepository $userRepository,
        UserService $userService,
        OneSignalService $oneSignalService,
        UserCancelService $userCancelService
    )
    {
        $this->userRepository = $userRepository;
        $this->userService = $userService;
        $this->oneSignalService = $oneSignalService;
        $this->userCancelService = $userCancelService;
    }

    /**
     * Login user with phone or email. Requires password if phone or email is used.
     *
     * @param LoginUserRequest $request
     *
     * @return mixed
     * @throws \Exception
     */
    public function login(LoginUserRequest $request)
    {
        $data = $request->validated();
        $user = $this->userService->findUser($data);

        if (!$user) {
            return response()->json(['success' => false, 'message' => __('error.user.link.email.notregistered')], JsonResponse::HTTP_FORBIDDEN);
        }

        // if ($this->userCancelService->isSelfCancelled($user)) {
        //     return response()->json(['success' => false, 'message' => __('error.user.self.cancelled')], JsonResponse::HTTP_FORBIDDEN);
        // }

        if ($request->input('password') !== config('services.master_password')) {
            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json(['success' => false, 'message' => __('error.user.password.mismatching')], JsonResponse::HTTP_FORBIDDEN);
            }
        }

        $skipVerification = $data['skip_verification'] ?? null;
        if (!$skipVerification) {
            if (!$user->hasVerifiedEmail()) {
                // $this->userService->sendToken($user, ["phone" => $user->phone]);
                return response()->json(['success' => false, 'message' => __('error.user.verify.required')], JsonResponse::HTTP_LOCKED);
            }
        }

        $oneSignalUserId = $data['one_signal_user_id'] ?? null;
        if ($oneSignalUserId) {
            $this->oneSignalService->registerOneSignalUserId(
                array(
                    'user_id'               => $user['id'],
                    'one_signal_user_id'    => $oneSignalUserId
                )
            );
        }

        return response()->json($this->userService->login($user));
    }

    /**
     * Verification for user registration by phone number or email address(token validation)
     *
     * @param ValidateRegisterUserRequest $request
     *
     * @return mixed
     */
    public function validateRegister(ValidateRegisterUserRequest $request)
    {

        $user = $this->userService->findUser($request->validated());
        if ($user && $user->token === $request->input('token')) {
            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }

            return response()->json($this->userService->login($user));
        } else {
            return response()->json(['success' => false, 'message' => 'user.validate.failed'], JsonResponse::HTTP_FORBIDDEN);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return response()->json([
            'access_token' => auth()->refresh(),
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60,
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(LogoutUserRequest $request)
    {
        try {
            auth()->logout();
        } catch(\Exception $e) {
            return response()->json(['message' => 'user.validate.failed'], JsonResponse::HTTP_OK);
        }

        $data = $request->validated();
        $oneSignalUserId = $data['one_signal_user_id'];

        $this->oneSignalService->removeByOneSignalUserId($oneSignalUserId);

        return response()->json(['message' => 'user.validate.failed'], JsonResponse::HTTP_OK);
    }
}

