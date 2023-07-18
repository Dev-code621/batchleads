<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

/**
 * Class UserRepository
 *
 * @package App\Repositories
 * @method User find(int $id, array $relations = [])
 */
class UserRepository extends BaseRepository
{
    /** @var array */
    protected $filterWhereColumns = [
        'name'  => 'user_id',
        'phone' => 'phone',
        'email' => 'email',
    ];

    /**
     * UserRepository constructor.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->model = $user;
    }

    /**
     * @param array $data
     *
     * @return User|null
     */
    public function create(array $data): ?User
    {
        $user = $this->model->newInstance();
        $user->name = $data['name'] ?? null;
        $user->phone = $data['phone'] ?? null;
        $user->password = Hash::make($data['password'] ?? '');
        $user->email = $data['email'] ?? null;
        $user->token = $data['token'] ?? null;
        $user->email_verified_at = $data['email_verified_at'] ?? null;
        $user->role = $data['role'] ?? 'owner';
        $user->pre_selected_plan_index = $data['plan_index'] ?? null;

        return $user->save() ? $user : null;
    }

    /**
     * @param $userId
     *
     * @return User|null
     */
    public function findById($userId): ?User
    {
        return $this->findWhere(['id' => $userId])->first();
    }

    /**
     * @param string $email
     *
     * @return User|null
     */
   public function findByEmail(string $email): ?User
   {
       return $this->findWhere(['email' => $email])->first();
   }

   public function findByMessagingServiceId(string $messagingServiceId)
   {
       return $this->findWhere(['twilio_messaging_service_id' => $messagingServiceId])->first();
   }
}
