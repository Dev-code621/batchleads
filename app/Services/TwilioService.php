<?php

namespace App\Services;

use App\Repositories\UserRepository;
use Twilio\Rest\Client;
use App\Models\User;

/**
 * Class TwilioService
 * @package App\Services
 */
class TwilioService
{
    protected $client;
    protected $senderNumber;
    protected $userRepository;
    protected $tokenMessage = 'Your auth token is %s';

    /**
     * TwilioService constructor.
     *
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->client = new Client(config('services.twilio.account_sid'), config('services.twilio.auth_token'));
        $this->senderNumber = str_start(config('services.twilio.phone_number'), '+');
        $this->userRepository = $userRepository;
    }

    /**
     * @param string $phoneNumber
     * @param string $message
     */
    public function sendMessage(string $phoneNumber, string $message)
    {
        $phoneNumber = str_start($phoneNumber, '+');

        $this->client->messages->create($phoneNumber,
            [
                'from' => $this->senderNumber,
                'body' => $message,
            ]
        );
    }

    /**
     * @param User $user
     *
     * @throws \Exception
     */
    public function sendToken(User $user)
    {
        try {
            $token = $this->createToken();

            $this->sendMessage($user->phone, $this->getTokenMessage($token));

            $this->userRepository->update($user->id, ['token' => $token]);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }

    /**
     * @return int
     */
    public function createToken(): int
    {
        return mt_rand(1000, 9999);
    }

    /**
     * @param string $token
     *
     * @return string
     */
    public function getTokenMessage(string $token): string
    {
        return sprintf($this->tokenMessage, $token);
    }

    public function createMessagingService(string $name)
    {
        try {
            $service = $this->client->messaging->v1->services->create($name);

            $service = $this->client->messaging->v1->services($service->sid)
                ->update(
                    array(
                        "inboundRequestUrl" => config('app.url') . "/api/twilio/receive",
                        "inboundMethod"     => "POST"
                    )
                );

            return $service->sid;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function updateMessagingServiceRequestUrl($serviceId)
    {
        try {
            $service = $this->client->messaging->v1->services($serviceId)
                ->update(
                    array(
                        "inboundRequestUrl" => config('app.url') . "/api/twilio/receive",
                        "inboundMethod"     => "POST"
                    )
                );

            return $service->sid;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function searchAvailablePhoneNumbers($count, $areaCode = null)
    {
        try {
            $searchParams = array(
                "smsEnabled" => true,
                "voiceEnabled" => true
            );
            if ($areaCode) {
                $searchParams['areaCode'] = $areaCode;
            }
            $phoneNumbers = $this->client->availablePhoneNumbers("US")
                ->local
                ->read($searchParams, $count);

            $result = [];
            foreach($phoneNumbers as $phoneNumber) {
                $result[] = $phoneNumber->friendlyName;
            }
            return $result;
        } catch (\Exception $e) {
            return null;
        }

    }

    public function createIncomingPhoneNumberResource(string $phoneNumber)
    {
        try {
            $incomingPhoneNumber = $this->client->incomingPhoneNumbers
                ->create(array("phoneNumber"   => $phoneNumber));

            return $incomingPhoneNumber->sid;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function addPhoneNumberToService(string $messagingServiceId, string $phoneNumberSid)
    {
        try {
            $phoneNumber = $this->client->messaging->v1
                ->services($messagingServiceId)
                ->phoneNumbers
                ->create($phoneNumberSid);
            return $phoneNumber->sid;
        } catch (\Exception $e) {
            return null;
        }

    }

    public function sendCopilotSms(string $messagingServiceId, string $receiver, string $message)
    {
        try {
            $message = $this->client->messages
                ->create($receiver,
                    array(
                        "body"                   => $message,
                        "messagingServiceSid"    => $messagingServiceId
                    )
                );
            return $message->sid;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function sendSms(string $sender, string $receiver, string $message)
    {
        try {
            $message = $this->client->messages
                ->create($receiver,
                    array(
                        "body"   => $message,
                        "from"   => $sender
                    )
                );
            return $message->sid;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getPurchasedPhoneNumbers(string $messagingServiceId)
    {
        $accountSid = config('services.twilio.account_sid');
        $authToken = config('services.twilio.auth_token');
        $authorization = $accountSid . ':' . $authToken;

        $curl = curl_init('https://messaging.twilio.com/v1/Services/' . $messagingServiceId . '/PhoneNumbers?PageSize=50');
        curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_POST, 0);
        curl_setopt($curl, CURLOPT_USERPWD, $authorization);
        $response = curl_exec($curl);

        if(curl_errno($curl)){
            return null;
        }
        curl_close($curl);

        $result = json_decode($response, true);

        if (array_key_exists('phone_numbers', $result)) {
            return $result['phone_numbers'];
        } else {
            return null;
        }
    }

    public function updateIncomingPhoneNumber($phoneNumberSid, $data)
    {
        try {
            $phone = $this->client->incomingPhoneNumbers($phoneNumberSid)
                ->update($data);
            return $phone;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deletePhoneNumber($messagingServiceId, $phoneNumberSid)
    {
        try {
            $this->client->messaging->v1->services($messagingServiceId)
                ->phoneNumbers($phoneNumberSid)
                ->delete();
            $this->client->incomingPhoneNumbers($phoneNumberSid)
                ->delete();
            return true;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function deleteMessagingService($messagingServiceId)
    {
        try {
            $this->client->messaging->v1->services($messagingServiceId)
                ->delete();
        } catch (\Exception $e) {
            return null;
        }
    }
}
