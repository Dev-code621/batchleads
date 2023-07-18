<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Notifications\VerifyCode;
use App\Repositories\UserRepository;
use App\Models\User;
use App\Mail\VerifySignUp;
use App\Mail\ForgotPassword;

use Mail;


/**
 * Class UserService
 *
 * @package App\Services
 */
class UserService
{

    protected $userRepository;
    protected $twilioService;
    protected $teamService;
    protected $addOnService;
    protected $teamUserService;

    /**
     * UserService constructor.
     *
     * @param UserRepository     $userRepository
     * @param TwilioService      $twilioService
     * @param TeamService        $teamService
     */
    public function __construct(
        UserRepository $userRepository,
        TwilioService $twilioService,
        TeamService $teamService,
        AddOnService $addOnService,
        TeamUserService $teamUserService
    )
    {
        $this->userRepository = $userRepository;
        $this->twilioService = $twilioService;
        $this->teamService = $teamService;
        $this->addOnService = $addOnService;
        $this->teamUserService = $teamUserService;
    }

    /**
     * @param array $data
     *
     * @return User|bool
     * @throws \Exception
     *
     */
    public function create(array $data): ?User
    {
        try {
            \DB::beginTransaction();

            $data['email'] = strtolower($data['email']);
            $user = $this->userRepository->create($data);
            \DB::commit();

            return $user;
        } catch (\Exception $e) {
            \DB::rollBack();

            throw new \Exception($e->getMessage());
        }
    }

    /**
     * @param User $user
     *
     * @return array
     */
    public function login($user): array
    {
        $user['email'] = strtolower($user['email']);
        $user['team_id'] = $this->teamService->getTeamId($user);
        $user['add_ons'] = [];
        $accessToken = auth()->login($user);
        // $this->userRepository->update($user->id, ['token' => null]);

        $planId = null;
        if ($user->subscribed('main')) {
            $planId = $user->subscription('main')->stripe_plan;
            $names = explode(' ', $user['name']);
            $firstName = $user['name'];
            $lastName = '';
            if (count($names) >= 2) {
                $firstName = $names[0];
                foreach ($names as $key => $name) {
                    if ($key !== 0) {
                        $lastName .= $name;
                    }
                }
            }
            $user->updateStripeCustomer(
                array(
                    'email'     => $user['email'],
                    'name'      => $user['name'],
                    'phone'     => $user['phone'],
                    'metadata'  => array(
                        'email'         => $user['email'],
                        'firstName'     => $firstName,
                        'lastName'      => $lastName,
                        'phone'         => $user['phone'],
                        // 'coupon'        => $user['first_promoter'] ? $user['first_promoter']['tracking_ref_id'] : null,
                        'plan'          => $planId
                    ),
                )
            );
        }

        return [
            'token' => [
                'access_token' => $accessToken,
                'token_type'   => 'bearer',
                'expires_in'   => auth()->factory()->getTTL() * 60,
            ],
            'user'  => new UserResource($user),
        ];
    }

    /**
     * @param array $data
     *
     * @return User|null
     */
    public function findUser(array $data): ?User
    {
        if (!empty($data['phone'])) {
            return $this->userRepository->findByPhone($data['phone']);
        } else {
            $data['email'] = strtolower($data['email']);
            return $this->userRepository->findByEmail($data['email']);
        }
    }

    /**
     * @param int $userId
     *
     * @return  User|null
     */
    public function findUserById($userId): ?User
    {
        return $this->userRepository->findById($userId);
    }

    /**
     * @param array $data
     *
     * @return User
     */
    public function changeEmail(array $data): ?User
    {
        $user = auth()->user();

        if ($user->token != $data['token']) {
            return null;
        }

        $user->email = $data['email'];
        $user->token = null;
        $user->save();

        return $user->fresh();
    }


    /**
     * @param User $user
     *
     * @return bool
     * @throws \Exception
     */
    public function sendTokenByPhone(User $user): bool
    {
        $this->twilioService->sendToken($user);

        return true;
    }

    /**
     * @param User $user
     *
     * @return bool
     */
    public function sendTokenByEmail(User $user): bool
    {
        $token = $this->twilioService->createToken();

        // send email with verification code
        $user->notify(new VerifyCode($token));

        $this->userRepository->update($user->id, ['token' => $token]);

        return true;
    }

    /**
     * @param User  $user
     * @param array $data
     *
     * @return bool
     * @throws \Exception
     */
    public function sendToken(User $user, array $data): bool
    {
        if (!empty($data['phone'])) {
            return $this->sendTokenByPhone($user);
        } else {
            return $this->sendTokenByEmail($user);
        }
    }

    public function sendRegistrationVerifyLink(User $user)
    {
        $token = $user['token'];
        if (!$token) {
            $token = $this->twilioService->createToken();
        }
        // $user->notify(new VerifyCode($token));
        $tokenToSend = base64_encode($token . ':' . $user->email);

        Mail::to($user->email)->send(new VerifySignUp($user->name, $tokenToSend));

        $this->userRepository->update($user->id, ['token' => $token]);

        return true;
    }

    public function sendForgotPasswordLink(User $user)
    {
        $token = $this->twilioService->createToken();
        $tokenToSend = base64_encode($token . ':' . $user->email);

        Mail::to($user->email)->send(new ForgotPassword($user, $tokenToSend));

        $this->userRepository->update($user->id, ['token' => $token]);

        return true;
    }

    /**
     * @param array $data
     *
     * @return User
     */
    public function changeTelnyxNumber($userId, $telnyxNumber): ?User
    {
        $user = User::find($userId);
        $user->telnyx_number = $telnyxNumber;
        $user->save();

        return $user;
    }

    /**
     * Update User Role
     *
     * @param array $data
     *
     * @return $user
     */
    public function updateUserRole(array $data)
    {
        $user = User::find($data['user_id']);
        $user->role = $data['role'];
        $user->save();

        return $user;
    }

    public function updateUserPhoto(array $data)
    {
        $user = User::find($data['user_id']);
        $user->photo_url = $data['photo_url'];
        $user->save();

        return $user;
    }

    public function updateUserInfo(array $data)
    {
        $user = User::find($data['user_id']);
        if (array_key_exists('name', $data)) {
            $user->name = $data['name'];
        }
        if (array_key_exists('phone', $data)) {
            $user->phone = $data['phone'];
        }
        if (array_key_exists('company', $data)) {
            $user->company = $data['company'];
        }
        if (array_key_exists('stripe_id', $data)) {
            $user->stripe_id = $data['stripe_id'];
        }
        if (array_key_exists('twilio_messaging_service_id', $data)) {
            $user->twilio_messaging_service_id = $data['twilio_messaging_service_id'];
        }

        $user->save();

        return $user;
    }

    public function getAllUsers()
    {
        return User::get();
    }

    public function deleteUserById($id)
    {
        return $this->userRepository->delete($id);
    }

    public function findUserByMessagingServiceId($messagingServiceId)
    {
        return $this->userRepository->findByMessagingServiceId($messagingServiceId);
    }

    public function getOwnerUser($user)
    {
        $role = $user['role'];
        $userId = $user['id'];
        $ownerUser = null;
        if ($role === 'owner') {
            $ownerUser = $user;
        } else {
            $teamUsers = $this->teamUserService->findByUserId($userId);
            if (count($teamUsers) > 0) {
                $team = $teamUsers[0]->team;
                if ($team) {
                    $ownerUserId = $team->owner_user_id;
                    $ownerUser = $this->findUserById($ownerUserId);
                }
            }
        }

        return $ownerUser;
    }
}
