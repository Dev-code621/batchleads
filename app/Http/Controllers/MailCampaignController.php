<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateMailCampaignRequest;
use App\Http\Requests\MailCampaignBulkStartRequest;
use App\Http\Requests\GetMailCampaignsRequest;
use App\Http\Requests\MailCampaignCancelRequest;
use App\Services\MailCampaignService;
use App\Services\MailCampaignPropertyService;
use App\Services\PropertyService;
use App\Services\MailTemplateService;
use App\Services\LobService;
use Illuminate\Http\Request;

use App\Services\MailCampaignRepeatService;

/**
 * Class MailCampaignController
 *
 * @package App\Http\Controllers
 */
class MailCampaignController extends Controller
{
    protected $lobService;
    protected $mailCampaignPropertyService;
    protected $propertyService;
    protected $mailTemplateService;

    /**
     * constructor.
     *
     * @param MailCampaignService $mailCampaignService
     * @param LobService $lobService
     */
    public function __construct(
        MailCampaignService $mailCampaignService,
        MailCampaignPropertyService $mailCampaignPropertyService,
        LobService $lobService,
        PropertyService $propertyService,
        MailTemplateService $mailTemplateService,
        MailCampaignRepeatService $mailCampaignRepeatService
    )
    {
        $this->baseService = $mailCampaignService;
        $this->mailCampaignPropertyService = $mailCampaignPropertyService;
        $this->lobService = $lobService;
        $this->propertyService = $propertyService;
        $this->mailTemplateService = $mailTemplateService;
        $this->mailCampaignRepeatService = $mailCampaignRepeatService;
    }

    public function list(GetMailCampaignsRequest $request, $page=1)
    {
        $data = $request->validated();
        $user = $request->user();
        $pageSize = $data['pageSize'] ?? 30;
        $orderBy = $data['orderBy'] ?? 'created_at';
        $order = $data['order'] ?? 'desc';
        $search = $data['search'] ?? '';
        $finished = $data['finished'] ?? null;
        $teamId = $this->getTeamId($user);

        $data = $this->baseService->search(array(
            'per_page'  => $pageSize,
            'order_by'  => $orderBy,
            'order'     => $order,
            'search'    => $search,
            // 'userId'    => $user['id'],
            'team_id'   => $teamId,
            'page'      => $page,
            'finished'  => $finished
        ));

        return $data
            ? $this->responseWithSuccess($data)
            : $this->responseWithError(__('error.list.fail'));
    }

    public function getTemplates(Request $request)
    {
        $data = $this->lobService->getTemplates();
        if ($data) {
            $templates = $data['data'];
            $result = [];
            foreach($templates as $template) {
                $result[] = array(
                    'id'            => $template['id'],
                    'description'   => $template['description'],
                    'html'          => $template['versions'][0]['html']
                );
            }
        }

        return $data
            ? $this->responseWithSuccess(array('templates' => $result, 'count' => $data['count']))
            : $this->responseWithError(__('error.list.fail'));
    }

    protected function createCampaign($propertyIds, $campaignId)
    {
        $startedCount = 0;
        foreach ($propertyIds as $propertyId) {
            $propertyId = trim($propertyId, " \t\n\r");
            $propertyId = intval($propertyId);

            $property = $this->propertyService->read($propertyId);
            if ($property) {
                $this->mailCampaignPropertyService->create(
                    array(
                        'mail_campaign_id'  => $campaignId,
                        'property_id'       => $propertyId,
                        'status'            => 'not delivered',
                        'postcard_id'       => '0',
                        'finished'          => 0
                    )
                );
                $startedCount++;
            }

            $this->propertyService->update($propertyId, array('status' => 'Currently Marketing'));
        }

        $campaignInfo = $this->baseService->read($campaignId, []);

        return $campaignInfo;
    }

    // Send Mail PostCard
    public function start(CreateMailCampaignRequest $request)
    {
        $data = $request->validated();
        $propertyIds = $data['property_ids'];

        $templateId = $data['template_id'];
        $template = $this->mailTemplateService->read($templateId);

        if (!$template) {
            return $this->responseWithError(__('error.mail.template.notfound'));
        }

        $campaign = $this->add($request);
        $content = $campaign->getContent();
        $array = json_decode($content, true);
        $campaignId = $array['data']['id'];

        $campaignInfo = $this->createCampaign($propertyIds, $campaignId);

        if ($campaignInfo) {
            if (array_key_exists('is_repeat', $data)) {
                if ($data['is_repeat']) {
                    $request->validate([
                        'total_mailers' => 'required',
                        'repeat_every'  => 'required',
                    ]);
                    $this->mailCampaignRepeatService->create(
                        array(
                            'mail_campaign_id'  => $campaignId,
                            'repeat_every'      => $data['repeat_every'],
                            'total_mailers'     => $data['total_mailers'],
                        )
                    );
                }
            }
        }

        return $campaignInfo
            ? $this->responseWithSuccess($campaignInfo)
            : $this->responseWithError(__('error.mail.campaign.start.fail'));
    }

    public function bulkStart(MailCampaignBulkStartRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();
        $filter = $data['filter'];

        // get Properties
        $search = $filter['search'] ?? '';
        $folderId = $filter['folder_id'] ?? null;
        $drivingRouteId = $filter['driving_route_id'] ?? null;
        $lat = $filter['lat'] ?? null;
        $lon = $filter['lon'] ?? null;
        $status = $filter['status'] ?? null;
        $stateId = $filter['state_id'] ?? null;
        $teamId = $this->getTeamId($user);
        $skipTraced = $filter['skip_traced'] ?? null;
        $userId = $filter['user_id'] ?? null;
        $ownerOccupied = $filter['owner_occupied'] ?? null;

        $excludedPropertyIds = $data['excluded_property_ids'] ?? null;

        $properties = $this->propertyService->search(array(
            'search'                => $search,
            'userId'                => $userId,
            'team_id'               => $teamId,
            'folder_id'             => $folderId,
            'state_id'              => $stateId,
            'driving_route_id'      => $drivingRouteId,
            'status'                => $status,
            'lat'                   => $lat,
            'lon'                   => $lon,
            'skip_traced'           => $skipTraced,
            'owner_occupied'        => $ownerOccupied,
            'is_all'                => 1,
            'id_only'               => 1,
            'excluded_property_ids' => $excludedPropertyIds
        ));
        $propertyIds = [];
        foreach ($properties as $property) {
            $propertyIds []= $property['id'];
        }

        $campaign = $this->add($request);
        $content = $campaign->getContent();
        $array = json_decode($content, true);
        $campaignId = $array['data']['id'];

        $campaignInfo = $this->createCampaign($propertyIds, $campaignId);

        if ($campaignInfo) {
            if (array_key_exists('is_repeat', $data)) {
                if ($data['is_repeat']) {
                    $request->validate([
                        'total_mailers' => 'required',
                        'repeat_every'  => 'required',
                    ]);
                    $this->mailCampaignRepeatService->create(
                        array(
                            'mail_campaign_id'  => $campaignId,
                            'repeat_every'      => $data['repeat_every'],
                            'total_mailers'     => $data['total_mailers'],
                        )
                    );
                }
            }
        }

        return $campaignInfo
            ? $this->responseWithSuccess($campaignInfo)
            : $this->responseWithError(__('error.mail.campaign.start.fail'));
    }

    public function cancelCampaign(MailCampaignCancelRequest $request, $campaignId)
    {
        $user = $request->user();
        $campaigns = $this->baseService->findWhere(
            array(
                'id'        => $campaignId,
                'user_id'   => $user['id'],
                'finished'  => 0
            )
        );

        if (count($campaigns) === 0) {
            return $this->responseWithError('Can not find the campaign to cancel', 404);
        }

        $result = $this->baseService->update($campaignId, array(
            'finished'  => 2
        ));

        $repeats = $this->mailCampaignRepeatService->findAllByCampaignId($campaignId);
        foreach ($repeats as $repeat) {
            $this->mailCampaignRepeatService->update(
                $repeat['id'],
                array(
                    'finished'  => 2
                )
            );
        }

        $result = $this->baseService->read($campaignId);

        return $result
            ? $this->responseWithSuccess($result)
            : $this->responseWithError(__('error.sms.campaign.cancel.fail'));
    }

    // Delivery Status Update webhook
    public function deliveryStatusUpdate(Request $request)
    {
        $eventType = $request->get('event_type');
        if ($eventType['id'] === 'postcard.processed_for_delivery') {
            $body = $request->get('body');
            $postCardId = $body['id'];
            $this->mailCampaignPropertyService->setDeliveredByPostCardId($postCardId);
        }
        return $postCardId;
    }
}
