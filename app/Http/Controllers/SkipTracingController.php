<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use ArrayHelpers\Arr;
use App\Services\SkipTracingService;
use App\Services\PropertyPhoneService;
use App\Services\PropertyEmailService;
use App\Services\PropertyHistoryService;
use App\Services\PropertyService;
use App\Http\Requests\CreateSkipTracingRequest;
use App\Http\Requests\UpdateSkipTracingRequest;
use App\Http\Requests\BulkSkipTracingRequest;
use App\Http\Requests\FetchSkipTracingRequest;
use App\Jobs\SkipTracingJob;
use App\Services\CreditBallanceService;
use App\Services\CreditTransactionService;
use App\Services\OneSignalService;
use App\Services\TeamUserService;
use App\Services\UserService;

class SkipTracingController extends Controller
{
    protected $baseService;
    protected $skipTracingService;
    protected $propertyService;
    protected $propertyPhoneService;
    protected $propertyEmailService;
    protected $creditTransactionService;
    protected $oneSignalService;
    protected $creditBallanceService;
    protected $userService;
    protected $teamUserService;

    /**
     * constructor.
     *
     * @param SkipTracingService $skipTracingService
     */
    public function __construct(
        SkipTracingService $skipTracingService,
        PropertyService $propertyService,
        PropertyPhoneService $propertyPhoneService,
        PropertyEmailService $propertyEmailService,
        PropertyHistoryService $propertyHistoryService,
        OneSignalService $oneSignalService,
        CreditBallanceService $creditBallanceService,
        CreditTransactionService $creditTransactionService,
        UserService $userService,
        TeamUserService $teamUserService
    )
    {
        $this->baseService = $skipTracingService;
        $this->propertyService = $propertyService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyEmailService = $propertyEmailService;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->oneSignalService = $oneSignalService;
        $this->creditBallanceService = $creditBallanceService;
        $this->userService = $userService;
        $this->teamUserService = $teamUserService;
        $this->creditTransactionService = $creditTransactionService;
    }

    public function create(CreateSkipTracingRequest $request)
    {
        return $this->add($request);
    }

    public function update(UpdateSkipTracingRequest $request, $skipTracingId)
    {
        return $this->updateData($request, $skipTracingId);
    }

    public function fetchSkipTracing(FetchSkipTracingRequest $request, $propertyId)
    {
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $property = $this->propertyService->read($propertyId);

        if ($property) {
            $result = $this->baseService->skipTracing(
                array(
                    $property
                ),
                $teamId,
                $user['id']
            );

            $emails = [];
            $phones = [];
            $result = $result['result'];
            if (count($result)) {
                $emails = Arr::get($result[0], 'emails', []);
                $phones = Arr::get($result[0], 'phones', []);
            }

            $returnResult = array(
                'emails'    => $emails,
                'phones'    => $phones
            );

            $now = date("Y-m-d h:i:s", time());
            $returnResult['property_id'] = $propertyId;
            $returnResult['skip_tracing_date'] = $now;
            $returnResult['count'] = count($emails) + count($phones);

            return $this->responseWithSuccess($returnResult);
        }

        return $this->responseWithError(__('error.property.notfound'), 404);
    }

    public function allSkipTracing(Request $request)
    {
        $user = $request->user();
        $teamId = $this->getTeamId($user);
        $properties = $this->propertyService->findWhere(array('team_id' => $teamId));
        $propertiesToFetch = [];

        foreach ($properties as $property) {
            if (!$property['skip_tracing_date']) {
                $propertiesToFetch []= $property;
            }
        }

        $result = $this->baseService->skipTracing($propertiesToFetch, $teamId, $user['id']);

        return $this->responseWithSuccess(
            array(
                'fetched_count' => $result['count']
            )
        );
    }

    public function bulkSkipTracing(BulkSkipTracingRequest $request)
    {
        $user = $request->user();
        $userId = $user['id'];
        $teamId = $this->getTeamId($user);
        $data = $request->validated();
        $filter = Arr::get($data, 'filter', null);
        if (!$filter) {
            $filter = [];
        }
        $excludedPropertyIds = $data['excluded_property_ids'] ?? [];
        $propertyIds = Arr::get($data, 'properties', []);

        if ($propertyIds && count($propertyIds)) {
            $properties = [];
            foreach ($propertyIds as $propertyId) {
                $property = $this->propertyService->read($propertyId);
                if (!$property['skip_tracing_date']) {
                    $properties []= $property;
                }
            }

            $result = $this->baseService->skipTracing($properties, $teamId, $userId);

            return $this->responseWithSuccess(
                array(
                    'fetched_count' => $result['count']
                )
            );
        } else {
            $freeSkipTracingCount = $this->creditBallanceService->getFreeSkipTracingCount($user);
            $skipTracedCount = $this->creditBallanceService->getSkipTracedCount($teamId);
            SkipTracingJob::dispatch(
                $userId,
                $teamId,
                $filter,
                $excludedPropertyIds,
                $this->baseService,
                $this->propertyService,
                $this->propertyHistoryService,
                $this->propertyPhoneService,
                $this->propertyEmailService,
                $this->oneSignalService,
                $this->creditBallanceService,
                $this->creditTransactionService,
                $user,
                $freeSkipTracingCount,
                $skipTracedCount
            );
            return $this->responseWithSuccess('Success');
        }
    }
}
