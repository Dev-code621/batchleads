<?php
namespace App\Repositories;

use App\Models\SmsMessageReceivedPhoneNumber;

/**
 * Class SmsMasterRepository
 *
 * @package App\Http\Repositories
 */
class SmsMessageReceivedPhoneNumberRepository extends BaseRepository
{
    /**
     * SmsMessageReceivedPhoneNumberRepository constructor.
     *
     * @param SmsMessageReceivedPhoneNumber $model
     */
    public function __construct(SmsMessageReceivedPhoneNumber $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return SmsMessageReceivedPhoneNumber|null
     */
    public function create(array $data): ?SmsMessageReceivedPhoneNumber
    {
        $smsMessageReceivedPhoneNumber = $this->model->newInstance();
        $smsMessageReceivedPhoneNumber->sms_campaign_id = $data['sms_campaign_id'] ?? null;
        $smsMessageReceivedPhoneNumber->phone_number = $data['phone_number'] ?? null;

        return $smsMessageReceivedPhoneNumber->save() ? $smsMessageReceivedPhoneNumber : null;
    }
}
