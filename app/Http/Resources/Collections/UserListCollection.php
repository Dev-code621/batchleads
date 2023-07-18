<?php

namespace App\Http\Resources\Collections;

use App\Models\User;
use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Class UserCollection
 * @package App\Http\Resources\Collections
 */
class UserListCollection extends ResourceCollection
{
    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        return $this->collection->transform(function ($user) {
            /* @var User $user */
            return [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'phone' => $user->phone
            ];
        })->toArray();
    }
}
