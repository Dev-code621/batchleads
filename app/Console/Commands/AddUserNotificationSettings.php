<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\UserNotificationSettingService;
use App\Services\UserService;

class AddUserNotificationSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:reset_notification_settings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset User Notification Settings';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        UserNotificationSettingService $userNotificationSettingService,
        UserService $userService
    )
    {
        parent::__construct();
        $this->userNotificationSettingService = $userNotificationSettingService;
        $this->userService = $userService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        echo "Resetting User Notification Settings......\r\n";
        $users = $this->userService->getAllUsers();
        $settings = config('services.notification_type');
        foreach ($users as $user) {
            $userId = $user['id'];
            foreach ($settings as $setting) {
                $userSettings = $this->userNotificationSettingService->findWhere(
                    array(
                        'notification_type' => $setting['notification_type'],
                        'user_id'           => $userId
                    )
                );
                if (!count($userSettings)) {
                    $setting['user_id'] = $userId;
                    $setting['enabled'] = 1;
                    print_r($setting);
                    $this->userNotificationSettingService->create($setting);
                }
            }
        }
        echo "User Notification Settings Reset!\r\n";
    }
}
