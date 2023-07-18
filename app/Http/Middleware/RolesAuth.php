<?php

namespace App\Http\Middleware;

use Closure;

class RolesAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $permissions = array(
            'admin' => array(
                array(
                    'controller'    => 'Folder',
                    'methods'       => array('create', 'read', 'update', 'delete', 'index'),
                ),
                array(
                    'controller'    => 'Team',
                    'methods'       => array('getTeamMembers'),
                ),
                array(
                    'controller'    => 'TeamUser',
                    'methods'       => array('inviteUser', 'removeUser', 'cancelInvitation'),
                ),
                array(
                    'controller'    => 'User',
                    'methods'       => array('updateUserRole'),
                ),
                array(
                    'controller'    => 'Credit',
                    'methods'       => array('chargeCredit'),
                ),
            ),
            'member' => array(
                array(
                    'controller'    => 'Folder',
                    'methods'       => array('create', 'read', 'update', 'delete', 'index'),
                ),
                array(
                    'controller'    => 'Team',
                    'methods'       => array('getTeamMembers'),
                ),
            )
        );

        $role = auth()->user()->role;

        if ($role !== 'owner') {
            $actionName = class_basename($request->route()->getActionname());
            $permissions = $permissions[$role];
            foreach ($permissions as $permission) {
                $controller = $permission['controller'];
                $methods = $permission['methods'];
                foreach ($methods as $method) {
                    if ($actionName === $controller . 'Controller@' . $method) {
                        // authorized request
                        return $next($request);
                    }
                }
            }
        } else {
            return $next($request);
        }

        return response()->json([
            'status'  => 401,
            'message' => __('error.exception.unauthorized'),
        ], 401);
    }
}
