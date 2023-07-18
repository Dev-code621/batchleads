<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use App\Http\Cron\SmsCampaignCron;
use App\Http\Cron\NotificationCron;
use App\Jobs\MailCampaignJob;
use App\Jobs\RecurringPhoneNumberPaymentJob;
use App\Jobs\InitPropertyExportCountJob;
use App\Jobs\ResetSentMessageCounts;
use App\Jobs\UserCancelJob;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // $schedule->command('inspire')
        //          ->hourly();
        $schedule->call(new SmsCampaignCron)->dailyAt('19:00');
        $schedule->job(new MailCampaignJob)->dailyAt('20:00');
        $schedule->call(new NotificationCron)->dailyAt('02:00');
        $schedule->job(new RecurringPhoneNumberPaymentJob)->daily();
        $schedule->job(new InitPropertyExportCountJob)->monthly();
        $schedule->job(new UserCancelJob)->daily();
        $schedule->job(new ResetSentMessageCounts)->daily();

        // $schedule->job(new InitPropertyExportCountJob)->everyMinute();
        // $schedule->call(new SmsCampaignCron)->everyMinute();
        // $schedule->job(new MailCampaignJob)->everyMinute();
        // $schedule->job(new RecurringPhoneNumberPaymentJob)->everyMinute();
        // $schedule->command('queue:work --tries=3 --daemon --once')->withoutOverlapping();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
