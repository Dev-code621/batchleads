<?php

namespace App\Services;

use Telnyx;

/**
 * Class TelnyxService
 * @package App\Services
 */
class TelnyxService
{
    /**
     * TelnyxService constructor.
     */
    public function __construct()
    {
        \Telnyx\Telnyx::setApiKey(config('services.telnyx.api_key'));
    }

    /**
     * Send Message
     *
     * @param string $sender
     * @param string $receiver
     * @param string $message
     *
     * @return $new_message
     */
    public function sendMessage(string $sender, string $receiver, string $message)
    {
        try {
            //'webhook_url' => 'http://a024aafe.ngrok.io/api/sms/campaign/deliveryStatusUpdate'
            $new_message = \Telnyx\Message::Create(['from' => $sender, 'to' => $receiver, 'text' => $message]);
        }
        catch (Telnyx\Error\Api $exception) {
            return null;
        }
        return $new_message;
    }

    public function searchNumbers()
    {
        try {
            $phoneNumbers = \Telnyx\AvailablePhoneNumber::All(["filter[features][]" => "sms", "filter[features][]=mms", "filter[features][]=voice",  "filter[limit]" => 1]);
        }
        catch (Telnyx\Error\Api $exception) {
            return null;
        }
        return $phoneNumbers[0];
    }

    public function purchasePhoneNumber($phoneNumber)
    {
        $apiBase = config('services.telnyx.api_base_url');
        $apiKey = config('services.telnyx.api_key');
        $messagingProfileId = config('services.telnyx.messaging_profile_id');

        $data = array(
            "phone_numbers" => array(
                array("phone_number" => $phoneNumber)
            ),
            "messaging_profile_id" => $messagingProfileId
        );
        $data = json_encode($data);

        $authorization = "Authorization: Bearer " . $apiKey;

        $curl = curl_init($apiBase . '/number_orders');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Accept: application/json',
            $authorization
        ));
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return false;
        }
        curl_close($curl);

        $result = json_decode($response, true);
        return $result;
    }
}
