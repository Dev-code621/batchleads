<?php

namespace App\Http\Middleware;

use App\Services\UserCancelService;
use Closure;

class UserCancelStatus
{
    protected $userCancelService;

    public function __construct(
        UserCancelService $userCancelService
    )
    {
        $this->userCancelService = $userCancelService;
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
        $user = $request->user();
        if ($this->userCancelService->isSelfCancelled($user)) {
            return response()->json([
                'status'  => 403,
                'message' => __('user.self.cancelled'),
            ], 403);
        }

        return $next($request);
    }
}
