<?php

namespace App\Console\Commands;

use App\Services\TwilioService;
use App\Services\UserService;
use Illuminate\Console\Command;

class UpdateMessagingServiceInboundRequestUrl extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:messagingservice';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Twilio Messaging Service Inbound Request URLs';

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
            if ($user['twilio_messaging_service_id']) {
                $this->twilioService->updateMessagingServiceRequestUrl($user['twilio_messaging_service_id']);
            }
        }
    }
}
