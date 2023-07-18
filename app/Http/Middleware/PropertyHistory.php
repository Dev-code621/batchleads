<?php

namespace App\Http\Middleware;

use App\Services\PropertyHistoryService;
use Closure;

class PropertyHistory
{
    protected $propertyHistoryService;

    public function __construct(PropertyHistoryService $propertyHistoryService)
    {
        $this->propertyHistoryService = $propertyHistoryService;
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
        $actions = array(
            array(
                'controller'    => 'Property',
                'methods'       => array(
                    array(
                        'method'        => 'create',
                        'description'   => 'created property.',
                        'type'          => 'create'
                    ),
                    array(
                        'method'        => 'propertyBulkAdd',
                        'description'   => 'created property.',
                        'type'          => 'propertyBulkAdd'
                    ),
                    array(
                        'method'        => 'update',
                        'description'   => 'updated property.',
                        'type'          => 'update'
                    )
                )
            ),
            // array(
            //     'controller'    => 'SkipTracing',
            //     'methods'       => array(
            //         array(
            //             'method'        => 'fetchSkipTracing',
            //             'description'   => 'did skip Tracing.',
            //             'type'          => 'skip tracing'
            //         ),
            //         array(
            //             'method'        => 'bulkSkipTracing',
            //             'description'   => 'did skip Tracing.',
            //             'type'          => 'skip tracing'
            //         )
            //     )
            // )
        );

        $user = $request->user();
        $userId = $user['id'];

        $actionName = class_basename($request->route()->getActionname());

        foreach($actions as $action) {
            $controller = $action['controller'];
            $methods = $action['methods'];
            foreach($methods as $method) {
                if ($actionName === $controller . 'Controller@' . $method['method']) {
                    $response = $next($request);
                    $result = json_decode($response->content(), true);
                    $status = $response->status();

                    if ($status === 200) {
                        $data = array(
                            'user_id'       => $userId,
                            'description'   => $method['description'],
                            'type'          => $method['type']
                        );
                        if ($actionName === 'PropertyController@create') {
                            $data['property_id'] = $result['data']['id'];
                            $this->propertyHistoryService->create($data);
                        } else if ($actionName === 'PropertyController@propertyBulkAdd') {
                            $properties = $result['data']['data'];
                            foreach ($properties as $property) {
                                $data['property_id'] = $property['id'];
                                $this->propertyHistoryService->create($data);
                            }
                        } else if ($actionName === 'PropertyController@update') {
                            $data['property_id'] = $result['data']['id'];
                            $this->propertyHistoryService->create($data);
                        }
                        // else if ($actionName === 'SkipTracingController@fetchSkipTracing') {
                        //     $data['property_id'] = $result['data']['property_id'];
                        //     $this->propertyHistoryService->create($data);
                        // } else if ($actionName === 'SkipTracingController@bulkSkipTracing') {
                        //     $propertyIds = $request->get('properties');
                        //     if ($propertyIds) {
                        //         foreach($propertyIds as $propertyId) {
                        //             $data['property_id'] = $propertyId;
                        //             $this->propertyHistoryService->create($data);
                        //         }
                        //     }
                        // }
                    }

                    return $response;
                }
            }
        }

        return $next($request);
    }
}
