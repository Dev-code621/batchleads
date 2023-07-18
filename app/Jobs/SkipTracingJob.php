<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SkipTracingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $userId;
    protected $teamId;
    protected $filter;
    protected $excludedPropertyIds;
    protected $propertyService;
    protected $propertyHistoryService;
    protected $skipTracingService;
    protected $propertyPhoneService;
    protected $propertyEmailService;
    protected $oneSignalService;
    protected $creditBallanceService;
    protected $creditTransactionService;
    protected $user;
    protected $freeSkipTracingCount;
    protected $skipTracedCount;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        $userId,
        $teamId,
        $filter,
        $excludedPropertyIds,
        $skipTracingService,
        $propertyService,
        $propertyHistoryService,
        $propertyPhoneService,
        $propertyEmailService,
        $oneSignalService,
        $creditBallanceService,
        $creditTransactionService,
        $user,
        $freeSkipTracingCount,
        $skipTracedCount
    )
    {
        $this->userId = $userId;
        $this->teamId = $teamId;
        $this->filter = $filter;
        $this->excludedPropertyIds = $excludedPropertyIds;
        $this->skipTracingService = $skipTracingService;
        $this->propertyService = $propertyService;
        $this->propertyHistoryService = $propertyHistoryService;
        $this->propertyPhoneService = $propertyPhoneService;
        $this->propertyEmailService = $propertyEmailService;
        $this->oneSignalService = $oneSignalService;
        $this->creditBallanceService = $creditBallanceService;
        $this->creditTransactionService = $creditTransactionService;
        $this->user = $user;
        $this->freeSkipTracingCount = $freeSkipTracingCount;
        $this->skipTracedCount = $skipTracedCount;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $page = 1;
        $perPage = 500;
        $count = 0;
        $this->filter['team_id'] = $this->teamId;

        do {
            $properties = $this->propertyService->searchAndGet($this->filter, $this->excludedPropertyIds, $page, $perPage);
            $propertiesToSkipTrace = [];
            foreach ($properties as $property) {
                if (!$property['skip_tracing_date']) {
                    $propertiesToSkipTrace []= $property;
                }
            }
            $page++;
            $result = $this->skipTracingService->skipTracing($propertiesToSkipTrace, $this->teamId, $this->userId);
            $count += $result['count'];
        } while (count($properties));

        if ($count > 0) {
            $propertyCountToAdd = $count;
            $referenceId = $this->userId;
            if ($this->freeSkipTracingCount >= $this->skipTracedCount) {
                $propertyCountToAdd = $count - ($this->freeSkipTracingCount - $this->skipTracedCount);
            }
            $creditCount = $this->creditBallanceService->getSkipTracingPrice($propertyCountToAdd, $this->user);
            $this->creditTransactionService->addTransactionByTransactionType(
                $this->user['id'],
                config('services.credit_transaction_type.skip_tracing'),
                $creditCount,
                $referenceId,
                $this->userId,
                'Skip Tracing'
            );
        }

        $this->oneSignalService->sendSkipTracedNotification($this->userId, $count);
    }
}
