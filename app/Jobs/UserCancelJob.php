<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;
use App\Models\UserCancel as UserCancelModel;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\TwilioService;

class UserCancelJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
    )
    {
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $user = new User;
        $userRepository = new UserRepository($user);
        $twilioService = new TwilioService($userRepository);

        $page = 1;
        $perPage = 100;
        do {
            $cancels = UserCancelModel::whereDate('cancel_at', Carbon::today());
            $cancels = $cancels->where('active', 1);
            $cancels = $cancels->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            foreach ($cancels as $cancel) {
                $user = $cancel['user'];
                $userId = $user['id'];
                $messagingServiceId = $user['twilio_messaging_service_id'];
                if ($messagingServiceId) {
                    $phoneNumbers = $this->twilioService->getPurchasedPhoneNumbers($messagingServiceId);
                    if ($phoneNumbers) {
                        foreach ($phoneNumbers as $phoneNumber) {
                            $sid = $phoneNumber['sid'];
                            $twilioService->deletePhoneNumber($messagingServiceId, $sid);
                        }
                    }
                    $twilioService->deleteMessagingService($messagingServiceId);
                }

                // Cancel AddOns
                // $addOns = config('services.add_ons');
                // if ($addOns) {
                //     foreach ($addOns as $addOn) {
                //         if ($user->subscribed($addOn['name'])) {
                //             $user->subscription($addOn['name'])->cancel();
                //         }
                //     }
                // }

                // if ($user->subscribed('main')) {
                //     $user->subscription('main')->cancel();
                // }
                $find = User::find($userId);
                if ($find) {
                    $find->delete();
                }
            }
            $page++;
        } while(count($cancels));
    }
}
