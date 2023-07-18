<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCallForwardingRequest;
use App\Services\CallForwardingService;
use App\Services\UserService;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Twilio\TwiML\VoiceResponse;

/**
 * Class CallForwardingController
 *
 * @package App\Http\Controllers
 */
class CallForwardingController extends Controller
{
    /**
     * constructor.
     *
     * @param CallForwardingService $service
     */
    public function __construct(
        CallForwardingService $service,
        TwilioService $twilioService,
        UserService $userService
    )
    {
        $this->baseService = $service;
        $this->twilioService = $twilioService;
        $this->userService = $userService;
    }

    public function create(CreateCallForwardingRequest $request)
    {
        $data = $request->validated();
        $user = $request->user();

        if ($user['twilio_messaging_service_id']) {
            $numbers = $this->twilioService->getPurchasedPhoneNumbers($user['twilio_messaging_service_id']);
            foreach ($numbers as $number) {
                $this->twilioService->updateIncomingPhoneNumber(
                    $number['sid'],
                    array('voiceUrl' => config('app.url') . '/api/callforwarding/forwarding/' . $user['id'])
                );
            }

            if ($user['call_forwarding']) {
                $id = $user['call_forwarding']['id'];
                $result = $this->baseService->update($id, $data);
                if ($result) {
                    $result = $this->baseService->read($id);
                }
                return $result
                    ? $this->responseWithSuccess($result, 'update.success')
                    : $this->responseWithError(__('error.update.fail'));
            }
            return $this->add($request);
        }

        return $this->responseWithError(__('error.twilio.phonenumber.list.fail'));
    }

    public function forwarding(Request $request, $userId)
    {
        $twiml = new VoiceResponse();
        if ($userId) {
            $user = $this->userService->findUserById($userId);
            $callForwarding = $user['call_forwarding'];
            if ($callForwarding) {
                $phoneNumber = $callForwarding['phone_number'];
                $twiml->dial($phoneNumber);
            }
        }

        return $twiml;
    }
}
