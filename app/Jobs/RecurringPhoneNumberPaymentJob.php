<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;
use App\Services\TwilioService;
use App\Repositories\UserRepository;
use App\Models\User;
use App\Models\CreditBallance;
use App\Models\Team;
use App\Repositories\CreditBallanceRepository;
use App\Models\CreditTransaction;
use App\Repositories\CreditTransactionRepository;
use App\Services\CreditTransactionService;
use App\Services\UserService;
use App\Repositories\TeamRepository;
use App\Services\TeamService;
use App\Models\AddOn;
use App\Repositories\AddOnRepository;
use App\Services\AddOnService;
use App\Models\AutoRechargeSetting;
use App\Models\CreditPackage;
use App\Models\TeamInvitation;
use App\Models\TeamUser;
use App\Repositories\AutoRechargeSettingRepository;
use App\Repositories\CreditPackageRepository;
use App\Repositories\TeamInvitationRepository;
use App\Repositories\TeamUserRepository;
use App\Services\AutoRechargeSettingService;
use App\Services\CreditPackageService;
use App\Services\StripeService;
use App\Services\TeamUserService;

class RecurringPhoneNumberPaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
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
        $creditBallance = new CreditBallance;
        $creditBallanceRepository = new CreditBallanceRepository($creditBallance);
        $team = new Team;
        $teamRepository = new TeamRepository($team);
        $teamService = new TeamService($teamRepository);
        $addOn = new AddOn;
        $addOnRepository = new AddOnRepository($addOn);
        $addOnService = new AddOnService($addOnRepository);

        $autoRechargeSetting = new AutoRechargeSetting;
        $autoRechargeSettingRepository = new AutoRechargeSettingRepository($autoRechargeSetting);
        $autoRechargeSettingService = new AutoRechargeSettingService($autoRechargeSettingRepository);
        $creditTransaction = new CreditTransaction;
        $creditTransactionRepository = new CreditTransactionRepository($creditTransaction);
        $teamUser = new TeamUser;
        $teamUserRepository = new TeamUserRepository($teamUser);
        $teamInvitation = new TeamInvitation;
        $teamInvitationRepository = new TeamInvitationRepository($teamInvitation);
        $teamUserService = new TeamUserService($teamUserRepository, $twilioService, $teamInvitationRepository);
        $userService = new UserService(
            $userRepository,
            $twilioService,
            $teamService,
            $addOnService,
            $teamUserService
        );
        $stripeService = new StripeService($teamUserService, $userService);
        $creditPackage = new CreditPackage;
        $creditPackageRepository = new CreditPackageRepository($creditPackage);
        $creditPackageService = new CreditPackageService($creditPackageRepository);

        $creditTransactionService = new CreditTransactionService(
            $creditTransactionRepository,
            $creditBallanceRepository,
            $userService,
            $teamService,
            $autoRechargeSettingService,
            $stripeService,
            $creditPackageService
        );

        $perPage = 100;
        $page = 1;
        do {
            $users = $user->whereNotNull('twilio_messaging_service_id')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            foreach ($users as $user) {
                $userId = $user['id'];
                $messagingServiceId = $user['twilio_messaging_service_id'];
                $phoneNumbers = $twilioService->getPurchasedPhoneNumbers($messagingServiceId);
                foreach ($phoneNumbers as $phoneNumber) {
                    $dateCreated = $phoneNumber['date_created'];
                    $date = Carbon::parse($dateCreated);
                    $now = Carbon::now();
                    $diff = $date->diffInDays($now);

                    if ($diff > 0 && ($diff % 30) === 0) {
                        $creditTransactionService->addTransactionByTransactionType(
                            $userId,
                            config('services.credit_transaction_type.purchase_phone'),
                            30,
                            $phoneNumber['phone_number'],
                            $userId,
                            'Recurring Phone Number Payment'
                        );
                    }
                }
            }
            $page ++;
        } while(count($users));
    }
}
