<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\UserService;
use App\Services\StripeService;

class SwapUserPlan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'swap:plan {email} {plan_name}';// plan_name = basic, standard, standard_new, premium

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Swap User Plan';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        UserService $userService,
        StripeService $stripeService
    )
    {
        parent::__construct();
        $this->userService = $userService;
        $this->stripeService = $stripeService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $email = $this->argument('email');
        $planId = 0;
        $planName = $this->argument('plan_name');
        $plans = config('services.plans');
        foreach ($plans as $key => $plan) {
            if ($key === $planName) {
                $planId = $plan['id'];
            }
        }
        if ($planId) {
            $user = $this->userService->findUser(
                array(
                    'email' => $email
                )
            );

            if ($user) {
                if ($this->confirm('Do you wish to continue?')) {
                    $isCancelled = $this->stripeService->isUserCancelledSubscription($user);
                    if ($isCancelled) {
                        $result = $this->stripeService->reSubscribe($user, $planId);
                    } else {
                        $result = $this->stripeService->subscribeChange($user, $planId);
                        if ($result !== 200) {
                            $this->error($result);
                            $this->info('Retrying...');
                            $result = $this->stripeService->reSubscribe($user, $planId);
                        }
                    }
                    $this->info($result);
                }
            } else {
                $this->error('Can not find the user email = ' . $email);
            }
        } else {
            $this->error('Can not find the registered plan');
        }
    }
}
