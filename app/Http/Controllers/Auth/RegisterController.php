<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Http\Requests\RegisterUserRequest;
use App\Services\UserService;
use App\Services\TeamService;
use App\Services\TeamUserService;
use App\Services\TeamInvitationService;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';
    /**
     * @var UserService
     */
    protected $userService;

    protected $teamService;
    protected $teamUserService;
    protected $teamInvitationService;

    /**
     * Create a new controller instance.
     *@param UserService    $userService
     * @return void
     */
    public function __construct(
        UserService $userService,
        TeamService $teamService,
        TeamUserService $teamUserService,
        TeamInvitationService $teamInvitationService
    )
    {
        $this->middleware('guest');
        $this->userService = $userService;
        $this->teamService = $teamService;
        $this->teamUserService = $teamUserService;
        $this->teamInvitationService = $teamInvitationService;
    }


    /**
     * Register user with a phone number or email (sends token to phone number/email)
     *
     * @param RegisterUserRequest $request
     *
     * @return mixed
     */
    public function register(RegisterUserRequest $request)
    {
        try {
            $data = $request->validated();
            $teamId = 0;
            $token = null;
            $emailAddress = null;
            $selectedPlanIndex = 0;

            if (array_key_exists('token', $data)) {
                $token = $data['token'];
                if ($token) {
                    $tokenData = base64_decode($token);
                    $tokenData = explode(":", $tokenData);
                    if (count($tokenData) < 3) {
                        return $this->responseWithError(__('error.user.link.invalid'));
                    }

                    $emailAddress = $tokenData[0];
                    $teamId = $tokenData[1];
                    $token = $tokenData[2];
                }
            }

            if ($teamId !== 0) {
                $data['role'] = config('services.user_role.member');
                if (!$this->teamService->isTeamExist($teamId)) {
                    return response()->json(['success' => false, 'message' => 'Team is not existing.'], 424);
                }

                $invitedUser = $this->teamInvitationService->findUser($emailAddress);
                if (!$invitedUser) {
                    return response()->json(['success' => false, 'message' => __('error.user.team.notinvited')], 426);
                }

                // $date = Carbon::parse($invitedUser->updated_at);
                // $now = Carbon::now();
                // $diff = $date->diffInDays($now);
                // if ($diff > 0) {
                //     return response()->json(['success' => false, 'message' => __('error.user.link.expired')], 427);
                // }
                if ($token !== $invitedUser->token) {
                    return response()->json(['success' => false, 'message' => __('error.user.token.invalid')], 429);
                }

                $now = Carbon::now();
                $data['email_verified_at'] = $now;
                $data['token'] = '';
                $data['email'] = $emailAddress;
                $user = $this->userService->create($data);
                if (!isset($user->id)) {
                    return response()->json(['success' => false, 'message' => 'Sign up failed'], 425);
                }

                $teamUser = $this->teamUserService->create(array('team_id' => $teamId, 'user_id' => $user->id));
                if (!$teamUser) {
                    return response()->json(['success' => false, 'message' => 'Team User register failed'], 428);
                }
                $this->teamInvitationService->delete($invitedUser->id);
            } else {
                $data['role'] = config('services.user_role.owner');
                $user = $this->userService->create($data);
                if (!isset($user->id)) {
                    return response()->json(['success' => false, 'message' => 'Sign up failed'], 425);
                }

                $this->teamService->create(array('owner_user_id' => $user->id));
            }

            // $this->userService->sendToken($user, $data)
            if ($teamId === 0) {
                $this->userService->sendRegistrationVerifyLink($user);
            }

            if (array_key_exists('file', $data)) {
                $path = Storage::disk('s3')->put('images/user', $request->file);
                $url = Storage::disk('s3')->url($path);
                $this->userService->updateUserPhoto(array('user_id' => $user['id'], 'photo_url' => $url));
            }

            return $user
                ? response()->json(['success' => true, 'user' => $user, 'message' => 'user.signup.success'], JsonResponse::HTTP_CREATED)
                : response()->json(['success' => false, 'message' => 'user.signup.failed'], JsonResponse::HTTP_FORBIDDEN);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }
    }
    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
    }
}
