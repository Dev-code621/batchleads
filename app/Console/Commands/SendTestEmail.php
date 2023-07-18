<?php

namespace App\Console\Commands;

use App\Mail\InsufficientCredits;
use App\Services\UserService;
use Illuminate\Console\Command;
use Mail;

class SendTestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send Test Email';

    protected $userService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(UserService $userService)
    {
        parent::__construct();
        $this->userService = $userService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $user = $this->userService->findUserById(6);
        Mail::to($user->email)->send(new InsufficientCredits($user, 'Mail Campaign', 100));
    }
}
