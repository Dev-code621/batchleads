<?php
namespace App\Repositories;

use Illuminate\Support\Facades\DB;
use App\Models\SmsDetail;

/**
 * Class SmsDetailRepository
 *
 * @package App\Http\Repositories
 */
class SmsDetailRepository extends BaseRepository
{
    /**
     * SmsDetailRepository constructor.
     *
     * @param SmsDetail $smsDetail
     */
    public function __construct(SmsDetail $smsDetail)
    {
        $this->model = $smsDetail;
    }

    /**
     * @param array $data
     *
     * @return SmsDetail|null
     */
    public function create(array $data): ?SmsDetail
    {
        $smsDetail = $this->model->newInstance();
        $smsDetail->sender = $data['sender'] ?? null;
        $smsDetail->receiver = $data['receiver'] ?? null;
        $smsDetail->message = $data['message'] ?? null;
        $smsDetail->is_unread = $data['is_unread'] ?? 1;
        $smsDetail->sms_master_id = $data['sms_master_id'] ?? null;

        return $smsDetail->save() ? $smsDetail : null;
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = $params['orderBy'] ?? 'created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? '';
        $masterId = $params['sms_master_id'] ?? null;
        $page = $params['page'] ?? null;
        $messagingServiceId = $params['messaging_service_id'] ?? null;

        $data = DB::table('sms_details');
        if ($masterId) {
            $data = $data->where('sms_master_id', $masterId);
        }
        if ($messagingServiceId) {
            $data = $data->where(function($query) use($messagingServiceId) {
                $query = $query->orWhere('sender', $messagingServiceId);
                $query = $query->orWhere('receiver', $messagingServiceId);
            });
        }
        if ($search) {
            $data = $data->whereRaw('lower(message) like (?)', '%' . strtolower($search) . '%');
        }

        $total = $data->count();
        $data = $data->orderBy($orderBy, $order)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $result = array(
            'total'          => $total,
            'page'           => $page,
            'count_per_page' => $perPage,
            'count'          => $data->count(),
            'data'           => $data,
        );

        return $result;
    }
}
