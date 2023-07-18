<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\OneSignalRepository;
use App\Repositories\UserNotificationSettingRepository;

/**
 * Class OneSignalService
 * @package App\Services
 */
class OneSignalService
{
    protected $oneSignalRepository;
    protected $userRepository;
    protected $userNotificationSettingRepository;

    /**
     * TwilioService constructor.
     *
     * @param UserRepository $userRepository
     * @param OneSignalRepository $oneSignalRepository
     * @param UserNotificationSettingRepository $userNotificationSettingRepository
     */
    public function __construct(
        UserRepository $userRepository,
        OneSignalRepository $oneSignalRepository,
        UserNotificationSettingRepository $userNotificationSettingRepository
    )
    {
        $this->userRepository = $userRepository;
        $this->oneSignalRepository = $oneSignalRepository;
        $this->userNotificationSettingRepository = $userNotificationSettingRepository;
    }

    public function sendSmsNotification(array $params)
    {
        $smsDetail = $params['sms_detail'] ?? null;
        $masterId = $params['master_id'] ?? '';
        $content = array(
			"en" => $params['message'] ?? ''
        );

        $twilioMessagingServiceId = $params['twilio_messaging_service_id'];
        $users = $this->userRepository->findBy('twilio_messaging_service_id', $twilioMessagingServiceId);

        if (count($users) > 0) {
            $user = $users[0];
            if ($this->notificationEnabled($user['id'], config('services.notification_type.sms.notification_type'))) {
                $users = $this->oneSignalRepository->getAllByUserId($user['id']);
                $receivers = [];
                foreach ($users as $user) {
                    $receivers[] = $user['one_signal_user_id'];
                }

                $fields = array(
                    'app_id'                => config('services.onesignal.app_id'),
                    'include_player_ids'    => $receivers,
                    'contents'              => $content,
                    'headings'              => array(
                        "en" => $params['title'] ?? ''
                    ),
                    'data'                  => array(
                        'type'          => 'sms',
                        'master_id'     => $masterId,
                        'sms_detail'    => $smsDetail
                    )
                );

                return $this->sendNotification($fields);
            }
        }
    }

    public function sendDailyAddedPropertyNotification($countInfos)
    {
        if ($countInfos) {
            foreach($countInfos as $countInfo) {
                $users = $this->oneSignalRepository->getAllByUserId($countInfo['user_id']);
                if ($this->notificationEnabled($countInfo['user_id'], config('services.notification_type.daily_property_added.notification_type'))) {
                    $receivers = [];
                    foreach ($users as $user) {
                        $receivers[] = $user['one_signal_user_id'];
                    }
                    $message = ' properties';
                    if ($countInfo['total'] === 1) {
                        $message = ' property';
                    }
                    $content = array(
                        "en" => 'You added ' . $countInfo['total'] . $message
                    );
                    $fields = array(
                        'app_id'                => config('services.onesignal.app_id'),
                        'include_player_ids'    => $receivers,
                        'contents'              => $content,
                        'headings'              => array(
                            "en" => 'Property Statistics'
                        ),
                        'data'                  => array(
                            'type'      => 'daily_property_added',
                            'count'     => $countInfo['total']
                        )
                    );

                    $this->sendNotification($fields);
                }
            }
        }
    }

    public function sendPropertyImportNotification($userId, $count, $failureCount, $existingCount)
    {
        $message = ' properties';
        if ($count === 1) {
            $message = ' property';
        }
        $content = array(
            "en" => 'You imported ' . $count . $message
        );
        $fields = $this->buildOneSignalHeaders($userId, 'property_import', $count, 'Property Import Result', $content);

        $this->sendNotification($fields);
    }

    public function sendPropertyAddNotification($userId, $successCount, $failureCount)
    {
        $message = ' properties';
        if ($successCount === 1) {
            $message = ' property';
        }
        $content = array(
            "en" => 'You added ' . $successCount . $message
        );
        $fields = $this->buildOneSignalHeaders($userId, 'property_add', $successCount, 'Property Add Result', $content);

        $this->sendNotification($fields);
    }

    public function sendPropertyExportNotification($userId, $count)
    {
        $message = ' properties';
        if ($count === 1) {
            $message = ' property';
        }
        $content = array(
            "en" => 'You exported ' . $count . $message
        );
        $fields = $this->buildOneSignalHeaders($userId, 'property_export', $count, 'Property Export Result', $content);

        $this->sendNotification($fields);
    }

    public function sendSkipTracedNotification($userId, $count)
    {
        $message = ' properties';
        if ($count === 1) {
            $message = ' property';
        }
        $content = array(
            "en" => 'You skip traced ' . $count . $message
        );
        $fields = $this->buildOneSignalHeaders($userId, 'skip_tracing', $count, 'Skip Tracing Result', $content);

        $this->sendNotification($fields);
    }

    protected function buildOneSignalHeaders($userId, $type, $count, $message, $content)
    {
        $users = $this->oneSignalRepository->getAllByUserId($userId);
        $receivers = [];
        foreach ($users as $user) {
            $receivers[] = $user['one_signal_user_id'];
        }

        $fields = array(
            'app_id'                => config('services.onesignal.app_id'),
            'include_player_ids'    => $receivers,
            'headings'              => array(
                "en" => $message
            ),
            'data'                  => array(
                'type'  => $type,
                'count' => $count
            ),
            'contents'              => $content
        );

        return $fields;
    }

    protected function notificationEnabled($userId, $notificationType)
    {
        $notificationSettings = $this->userNotificationSettingRepository->findWhere(
            array(
                'user_id'           => $userId,
                'notification_type' => $notificationType
            )
        );
        if (count($notificationSettings)) {
            $setting = $notificationSettings[0];
            if ($setting['enabled']) {
                return true;
            }
        }

        return false;
    }

    protected function sendNotification($fields)
    {
        $fields = json_encode($fields);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }

    public function registerOneSignalUserId(array $params)
    {
        $this->oneSignalRepository->deleteAll(
            array(
                'one_signal_user_id'    => $params['one_signal_user_id']
            )
        );
        return $this->oneSignalRepository->create($params);
    }

    public function removeByOneSignalUserId($oneSignalUserId)
    {
        return $this->oneSignalRepository->deleteByOneSignalUserId($oneSignalUserId);
    }
}
