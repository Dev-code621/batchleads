<?php
namespace App\Repositories;

use App\Models\SmsCampaignLog;
use App\Models\SmsCampaign;
use App\Models\SmsCampaignProperty;
use Illuminate\Support\Facades\DB;

/**
 * Class SmsCampaignLogRepository
 *
 * @package App\Http\Repositories
 */
class SmsCampaignLogRepository extends BaseRepository
{
    /**
     * SmsCampaignLogRepository constructor.
     *
     * @param SmsCampaignLog $smsCampaignLog
     */
    public function __construct(SmsCampaignLog $smsCampaignLog)
    {
        $this->model = $smsCampaignLog;
    }

    /**
     * @param array $data
     *
     * @return SmsCampaignLog|null
     */
    public function create(array $data): ?SmsCampaignLog
    {
        $smsCampaignLog = $this->model->newInstance();
        $smsCampaignLog->sms_campaign_id = $data['sms_campaign_id'] ?? null;
        $smsCampaignLog->message = $data['message'] ?? null;
        $smsCampaignLog->sms_id = $data['sms_id'] ?? null;
        $smsCampaignLog->sender = $data['sender'] ?? null;
        $smsCampaignLog->receiver = $data['receiver'] ?? null;
        $smsCampaignLog->direction = $data['direction'] ?? null;
        $smsCampaignLog->status = $data['status'] ?? null;

        return $smsCampaignLog->save() ? $smsCampaignLog : null;
    }

    public function getInbox($phoneNumber, $page=1, $pageSize=30)
    {
        $data = SmsCampaignLog::where('receiver', $phoneNumber)
            ->select('sender', DB::raw('count(*) as message_count'))
            ->groupBy('sender');

        $totalCount = $data->get()->count();

        $data = $data->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get();

        $count = $data->count();

        $result = [];
        foreach($data as $item) {
            $unreadCount = SmsCampaignLog::where('sender', $item['sender'])
                ->where('receiver', $phoneNumber)
                ->select('sender', DB::raw('count(*) as unread_count'))
                ->where('status', '!=', 'read')
                ->count();
            $item['unread_count'] = $unreadCount;
            $result[] = $item;
        }

        $result = array(
            'total'          => $totalCount,
            'page'           => $page,
            'count_per_page' => $pageSize,
            'count'          => $count,
            'data'           => $result,
        );
        return $result;
    }

    public function getOutbox($phoneNumber, $page=1, $pageSize=30)
    {
        $data = SmsCampaignLog::where('sender', $phoneNumber);
        $data->select('receiver', DB::raw('count(*) as message_count'))
            ->groupBy('receiver');

        $totalCount = $data->get()->count();

        $data = $data->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get();

        $count = $data->count();

        $result = [];
        foreach($data as $item) {
            $unreadCount = SmsCampaignLog::where('receiver', $item['receiver'])
                ->where('sender', $phoneNumber)
                ->select('receiver', DB::raw('count(*) as unread_count'))
                ->where('status', '!=', 'read')
                ->count();

            $smsCampaignIds = SmsCampaignLog::where('receiver', $item['receiver'])
                ->where('sender', $phoneNumber)
                ->select('sms_campaign_id')
                ->distinct()
                ->get();
            $campaigns = [];
            foreach($smsCampaignIds as $smsCampaignId) {
                $campaign = SmsCampaign::find($smsCampaignId['sms_campaign_id']);
                $campaign['sms_campaign_properties'] = SmsCampaignProperty::where('sms_campaign_id', $smsCampaignId['sms_campaign_id'])
                    ->with('property')
                    ->get();
                $campaigns[] = $campaign;
            }

            $item['unread_count'] = $unreadCount;
            $item['campaigns'] = $campaigns;
            $result[] = $item;
        }

        $result = array(
            'total'          => $totalCount,
            'page'           => $page,
            'count_per_page' => $pageSize,
            'count'          => $count,
            'data'           => $result,
        );
        return $result;
    }

    public function getMessages($phoneNumber, $page=1, $pageSize=30, $search='')
    {
        $data = SmsCampaignLog::whereRaw('lower(message) like (?)', '%' . strtolower($search) . '%');
        $data = $data->where(function($query) use($phoneNumber) {
            $query->where('receiver', $phoneNumber)
                ->orWhere('sender', $phoneNumber);
        });
        $count = $data->count();
        $data = $data->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->orderBy('id', 'desc')
            ->get();

        $result = array(
            'total'          => $count,
            'page'           => $page,
            'count_per_page' => $pageSize,
            'count'          => $data->count(),
            'data'           => $data,
        );
        return $result;
    }

    public function getMessageLogs($senderPhoneNumber, $receiverPhoneNumber, $page=1, $pageSize=30, $search='')
    {
        $inboxData = SmsCampaignLog::whereRaw('lower(message) like (?)', '%' . strtolower($search) . '%');
        $inboxData = $inboxData->where(function($query) use($senderPhoneNumber, $receiverPhoneNumber) {
            $query->where('receiver', $receiverPhoneNumber)
                ->where('sender', $senderPhoneNumber);
        });

        $outboxData = SmsCampaignLog::whereRaw('lower(message) like (?)', '%' . strtolower($search) . '%');
        $outboxData = $outboxData->where(function($query) use($senderPhoneNumber, $receiverPhoneNumber) {
            $query->where('sender', $receiverPhoneNumber)
                ->where('receiver', $senderPhoneNumber);
        });

        $data = $inboxData->union($outboxData);

        $count = $data->count();
        $data = $data->orderBy('id', 'desc')
            ->skip(($page - 1) * $pageSize)
            ->take($pageSize)
            ->get();

        $result = array(
            'total'          => $count,
            'page'           => $page,
            'count_per_page' => $pageSize,
            'count'          => $data->count(),
            'data'           => $data,
        );
        return $result;
    }

    public function markMessagesRead($phoneNumber)
    {
        $message = SmsCampaignLog::where('sender', $phoneNumber)->update(['status' => 'read']);

        return $message;
    }
}
