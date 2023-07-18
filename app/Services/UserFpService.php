<?php

namespace App\Services;

use App\Repositories\UserFpRepository;

/**
 * Class UserFpService
 *
 * @package App\Http\Services
 */
class UserFpService extends BaseService
{
    /**
     * UserFpService constructor.
     *
     * @param UserFpRepository     $repository
     */
    public function __construct(UserFpRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getUserPromoterByUserId($userId)
    {
        return $this->repository->findWhere(
            array(
                'user_id' => $userId
            )
        )->first();
    }

    public function createPromoter($email)
    {
        $apiBase = config('services.first_promoter.api_base');
        $xApiKey = config('services.first_promoter.x-api-key');

        $data = array(
            "email" => $email
        );
        $data = json_encode($data);

        $curl = curl_init($apiBase . '/promoters/create');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Accept: application/json',
            'x-api-key: ' . $xApiKey
        ));
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return null;
        }
        curl_close($curl);

        $result = json_decode($response, true);

        return $result;
    }

    public function trackSignUp($email, $refId)
    {
        $milliseconds = round(microtime(true) * 1000);
        $eventId = 'signup_' . $email . "_" . $milliseconds;
        $apiBase = config('services.first_promoter.api_base');
        $wid = config('services.first_promoter.wid');
        $xApiKey = config('services.first_promoter.x-api-key');

        $data = array(
            "email"     => $email,
            "promo_code"    => $refId,
            "wid"       => $wid,
            "event_id"  => $eventId
        );
        $data = json_encode($data);

        $curl = curl_init($apiBase . '/track/signup');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Accept: application/json',
            'x-api-key: ' . $xApiKey
        ));
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return null;
        }
        curl_close($curl);

        $result = json_decode($response, true);

        return $result;
    }
}
