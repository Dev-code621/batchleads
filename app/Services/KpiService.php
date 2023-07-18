<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Carbon\CarbonPeriod;
use App\Models\Property;
use App\Models\DrivingRoute;
use App\Models\MailCampaign;
use App\Models\SmsCampaign;
use App\Services\TeamService;

/**
 * Class KpiService
 *
 * @package App\Http\Services
 */
class KpiService
{
    /**
     * KpiService constructor.
     *
     */
    public function __construct(
        Property $property,
        DrivingRoute $drivingRoute,
        MailCampaign $mailCampaign,
        TeamService $teamService,
        SmsCampaign $smsCampaign
    )
    {
        $this->property = $property;
        $this->drivingRoute = $drivingRoute;
        $this->mailCampaign = $mailCampaign;
        $this->teamService = $teamService;
        $this->smsCampaign = $smsCampaign;
    }

    public function getKpis(array $params)
    {
        $start = $params['start'] ?? null;
        $end = $params['end'] ?? null;
        $prevStart = $params['prev_start'] ?? null;
        $userId = $params['user_id'] ?? null;
        $propertyStatus = $params['property_status'] ?? null;
        $requestUser = $params['request_user'] ?? null;
        $teamId = $this->teamService->getTeamId($requestUser);

        $start = Carbon::parse($start);
        $end = Carbon::parse($end);
        $now = Carbon::now();
        if ($end->gt($now)) {
            $end = $now;
        }
        $between = $start->diffInDays($end);
        $dateRange = CarbonPeriod::create($start, $end);

        $result = [];

        $propertyKpis = [];
        $drivingRouteKpis = [];
        $mailCampaignKpis = [];
        $smsCampaignKpis = [];
        $skipTracingKpis = [];
        foreach($dateRange as $date) {
            // get Property KPIs
            $propertyKpis[] = $this->getPropertyKpi($userId, $teamId, $date, $propertyStatus);
            // get DrivingRoute KPIs
            $drivingRouteKpis[] = $this->getDrivingRouteKpi($userId, $teamId, $date);
            // get MailCampaign KPIs
            $mailCampaignKpis[] = $this->getMailKpi($userId, $teamId, $date);
            // get SmsCampaign KPIs
            $smsCampaignKpis[] = $this->getSmsKpi($userId, $teamId, $date);
            // get SkipTracing KPIs
            $skipTracingKpis[] = $this->getSkipTracingKpi($userId, $teamId, $date);
        }

        $propertyKpisPrev = [];
        $drivingRouteKpisPrev = [];
        $mailCampaignKpisPrev = [];
        $smsCampaignKpisPrev = [];
        $skipTracingKpisPrev = [];
        if ($prevStart) {
            $prevStart = Carbon::parse($prevStart);
            $prevEnd = $prevStart->copy()->addDays($between);
            $prevDateRange = CarbonPeriod::create($prevStart, $prevEnd);

            foreach($prevDateRange as $date) {
                // get Property KPIs
                $propertyKpisPrev[] = $this->getPropertyKpi($userId, $teamId, $date, $propertyStatus);
                // get DrivingRoute KPIs
                $drivingRouteKpisPrev[] = $this->getDrivingRouteKpi($userId, $teamId, $date);
                // get MailCampaign KPIs
                $mailCampaignKpisPrev[] = $this->getMailKpi($userId, $teamId, $date);
                // get SmsCampaign KPIs
                $smsCampaignKpisPrev[] = $this->getSmsKpi($userId, $teamId, $date);
                // get SkipTracing KPIs
                $skipTracingKpisPrev[] = $this->getSkipTracingKpi($userId, $teamId, $date);
            }
            $result['prev_period'] = array(
                $prevStart->format('Y-m-d'),
                $prevEnd->format('Y-m-d'),
            );
        }

        $result['property'] = $propertyKpis;
        $result['driving_route'] = $drivingRouteKpis;
        $result['mail'] = $mailCampaignKpis;
        $result['sms'] = $smsCampaignKpis;
        $result['skip_tracing'] = $skipTracingKpis;

        $result['property_prev'] = $propertyKpisPrev;
        $result['driving_route_prev'] = $drivingRouteKpisPrev;
        $result['mail_prev'] = $mailCampaignKpisPrev;
        $result['sms_prev'] = $smsCampaignKpisPrev;
        $result['skip_tracing_prev'] = $skipTracingKpisPrev;

        $result['period'] = array(
            $start->format('Y-m-d'),
            $end->format('Y-m-d'),
        );

        return $result;
    }

    protected function getPropertyKpi($userId, $teamId, $date, $propertyStatus = null)
    {
        $kpi = $this->property->whereDay('created_at', '=', $date->day);
        $kpi = $kpi->whereMonth('created_at', '=', $date->month);
        $kpi = $kpi->whereYear('created_at', '=', $date->year);
        if ($userId) {
            $kpi = $kpi->where('user_id', $userId);
        } else if ($teamId) {
            $kpi = $kpi->where('team_id', $teamId);
        }

        if ($propertyStatus) {
            $kpi = $kpi->where(function($query) use($propertyStatus) {
                foreach ($propertyStatus as $propertyState) {
                    $query = $query->orWhere('status', $propertyState);
                }
            });
        }
        $count = $kpi->count();
        return
            array(
                'date'  => $date->format('Y-m-d'),
                'count' => $count
            );
    }

    protected function getDrivingRouteKpi($userId, $teamId, $date)
    {
        $kpi = $this->drivingRoute->whereDay('created_at', '=', $date->day);
        $kpi = $kpi->whereMonth('created_at', '=', $date->month);
        $kpi = $kpi->whereYear('created_at', '=', $date->year);
        if ($userId) {
            $kpi = $kpi->where('user_id', $userId);
        } else if ($teamId) {
            $kpi = $kpi->where('team_id', $teamId);
        }

        $count = $kpi->count();
        $kpi = $kpi->select(DB::raw('SUM(total_distance) as total_distances'), DB::raw('SUM(total_hours) as total_hours'))->first();

        return
            array(
                'date'  => $date->format('Y-m-d'),
                'count' => $count,
                'miles' => $kpi['total_distances'] ?? 0,
                'hours' => $kpi['total_hours'] ?? 0
            );
    }

    protected function getMailKpi($userId, $teamId, $date)
    {
        $kpi = $this->mailCampaign->whereDay('created_at', '=', $date->day);
        $kpi = $kpi->whereMonth('created_at', '=', $date->month);
        $kpi = $kpi->whereYear('created_at', '=', $date->year);
        $kpi = $kpi->where('finished', 1);
        if ($userId) {
            $kpi = $kpi->where('user_id', $userId);
        } else if ($teamId) {
            $kpi = $kpi->where('team_id', $teamId);
        }
        $count = $kpi->count();

        return
            array(
                'date'  => $date->format('Y-m-d'),
                'count' => $count
            );
    }

    protected function getSmsKpi($userId, $teamId, $date)
    {
        $kpi = $this->smsCampaign->whereDay('created_at', '=', $date->day);
        $kpi = $kpi->whereMonth('created_at', '=', $date->month);
        $kpi = $kpi->whereYear('created_at', '=', $date->year);
        $kpi = $kpi->where('finished', 1);
        if ($userId) {
            $kpi = $kpi->where('user_id', $userId);
        } else if ($teamId) {
            $kpi = $kpi->where('team_id', $teamId);
        }
        $count = $kpi->count();

        return
            array(
                'date'  => $date->format('Y-m-d'),
                'count' => $count
            );
    }

    protected function getSkipTracingKpi($userId, $teamId, $date, $propertyStatus = null)
    {
        $kpi = $this->property->whereDay('skip_tracing_date', '=', $date->day);
        $kpi = $kpi->whereMonth('skip_tracing_date', '=', $date->month);
        $kpi = $kpi->whereYear('skip_tracing_date', '=', $date->year);
        if ($userId) {
            $kpi = $kpi->where('user_id', $userId);
        } else if ($teamId) {
            $kpi = $kpi->where('team_id', $teamId);
        }

        if ($propertyStatus) {
            $kpi = $kpi->where(function($query) use($propertyStatus) {
                foreach ($propertyStatus as $propertyState) {
                    $query = $query->orWhere('status', $propertyState);
                }
            });
        }
        $count = $kpi->count();
        return
            array(
                'date'  => $date->format('Y-m-d'),
                'count' => $count
            );
    }
}
