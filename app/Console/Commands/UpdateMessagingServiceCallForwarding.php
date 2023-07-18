<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TwilioService;
use App\Services\UserService;

class UpdateMessagingServiceCallForwarding extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:callforwarding';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Messaging Service Call Forwarding';

    protected $userService;
    protected $twilioService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        UserService $userService,
        TwilioService $twilioService
    )
    {
        parent::__construct();
        $this->userService = $userService;
        $this->twilioService = $twilioService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = $this->userService->getAllUsers();
        foreach ($users as $user) {
            if ($user['twilio_messaging_service_id'] && $user['call_forwarding']) {
                $this->twilioService->updateMessagingServiceRequestUrl($user['twilio_messaging_service_id']);
                $numbers = $this->twilioService->getPurchasedPhoneNumbers($user['twilio_messaging_service_id']);
                foreach ($numbers as $number) {
                    $this->twilioService->updateIncomingPhoneNumber(
                        $number['sid'],
                        array('voiceUrl' => config('app.url') . '/api/callforwarding/forwarding/' . $user['id'])
                    );
                }
            }
        }
    }
}
