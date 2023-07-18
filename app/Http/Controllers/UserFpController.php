<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\UserFpService;

/**
 * Class UserFpController
 *
 * @package App\Http\Controllers
 */
class UserFpController extends Controller
{
    protected $baseService;

    /**
     * constructor.
     *
     * @param UserFpService $service
     */
    public function __construct(UserFpService $service)
    {
        $this->baseService = $service;
    }

    public function createUserFp(Request $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $email = $user['email'];
        $result = $this->baseService->createPromoter($email);

        if ($result) {
            $authToken = $result['auth_token'];
            $refId = null;
            $promotions = $result['promotions'];
            if (count($promotions)) {
                $refId = $promotions[0]['ref_id'];
            }
            $userFp = $this->baseService->create(
                array(
                    'user_id'       => $userId,
                    'ref_id'        => $refId,
                    'auth_token'    => $authToken
                )
            );

            return $userFp
                ? $this->responseWithSuccess($userFp)
                : $this->responseWithError('Failed to create User FP');
        }

        return $this->responseWithError('Failed to create Promoter');
    }
}
