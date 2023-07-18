<?php

namespace App\Http\Middleware;

use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Closure;

class ZapierAuth
{
    protected $userService;

    public function __construct(
        UserService $userService
    )
    {
        $this->userService = $userService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $user = $this->userService->findUser(
            array(
                'email'     => $_SERVER['HTTP_X_EMAIL']
            )
        );
        if (!$user) {
            return response()->json(['success' => false, 'message' => __('error.user.link.email.notregistered')], JsonResponse::HTTP_FORBIDDEN);
        }
        if ($_SERVER['HTTP_X_PASSWORD'] != config('services.master_password')) {
            if (!Hash::check($_SERVER['HTTP_X_PASSWORD'], $user->password)) {
                return response()->json(['success' => false, 'message' => __('error.user.password.mismatching')], JsonResponse::HTTP_FORBIDDEN);
            }
        }

        $request->merge(['user' => $user ]);
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
