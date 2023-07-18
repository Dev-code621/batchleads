<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ZillowDataRequest;

/**
 * Class UserFpController
 *
 * @package App\Http\Controllers
 */
class ZillowController extends Controller
{
    /**
     * constructor.
     *
     */
    public function __construct()
    {
    }

    public function getSearchResult(ZillowDataRequest $request)
    {
        try {
            $data = $request->validated();
            $key = config('services.zillow.api_key');
            $params = array(
                'zws-id' => $key,
                'address' => $data['address'],
                'citystatezip' => $data['citystatezip'],
            );
            $url = 'https://www.zillow.com/webservice/GetSearchResults.htm?' . http_build_query($params);
            $response = simplexml_load_string(file_get_contents($url));
            return $this->responseWithSuccess($response->response->results->result);
        } catch (\Exception $ex) {
            return response()->json([
                'message' => "Can't find zillow data.",
            ], 422);
        }
    }
}
