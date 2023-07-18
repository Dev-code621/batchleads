<?php
namespace App\Repositories;

use App\Models\DrivingRoute;
use App\Models\Property;
use Carbon\Carbon;

/**
 * Class DrivingRouteRepository
 *
 * @package App\Http\Repositories
 */
class DrivingRouteRepository extends BaseRepository
{
    /**
     * DrivingRouteRepository constructor.
     *
     * @param DrivingRoute $driverRoute
     */
    public function __construct(DrivingRoute $driverRoute)
    {
        $this->model = $driverRoute;
    }

    /**
     * @param array $data
     *
     * @return DrivingRoute|null
     */
    public function create(array $data): ?DrivingRoute
    {
        $driverRoute = $this->model->newInstance();
        $driverRoute->user_id = $data['user_id'] ?? null;
        $driverRoute->team_id = $data['team_id'] ?? null;
        $driverRoute->start_address = $data['start_address'] ?? null;
        $driverRoute->end_address = $data['end_address'] ?? null;
        $driverRoute->total_hours = $data['total_hours'] ?? null;
        $driverRoute->total_distance = $data['total_distance'] ?? null;
        $driverRoute->route_type = $data['route_type'] ?? 'Physical';

        $drivingRouteTempId = $data['driving_route_temp_id'] ?? null;

        $gps = $data['gps'];
        $gpsStr = '[';
        foreach ($gps as $key => $item) {
            $gpsStr .= '{';
            $gpsStr .= '"latitude":' . $item['latitude'] . ',"longitude":' . $item['longitude'];
            $gpsStr .= '}';
            if ($key !== count($gps) - 1) {
                $gpsStr .= ',';
            }
        }
        $gpsStr .= ']';
        $driverRoute->gps = $gpsStr ?? null;

        $result = $driverRoute->save();
        if ($result) {
            if ($drivingRouteTempId) {
                Property::where('driving_route_temp_id', $drivingRouteTempId)->update(['driving_route_id' => $driverRoute->id]);
            }

            return $driverRoute;
        }

        return null;
    }

    public function update(int $id, array $data)
    {
        $find = $this->find($id);

        if ($find) {
            $gps = $data['gps'];
            $gpsStr = '[';
            foreach ($gps as $key => $item) {
                $gpsStr .= '{';
                $gpsStr .= '"latitude":' . $item['latitude'] . ',"longitude":' . $item['longitude'];
                $gpsStr .= '}';
                if ($key !== count($gps) - 1) {
                    $gpsStr .= ',';
                }
            }
            $gpsStr .= ']';
            $data['gps'] = $gpsStr ?? null;

            return $find->update($data);
        }

        return false;
    }

    /**
     * @param array $params
     *
     * @return array DrivingRoute|null
     */
    public function search(array $params)
    {
        $orderBy = $params['order_by'] ?? 'id';
        $order = $params['order'] ?? 'asc';
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? '';
        $userId = $params['user_id'] ?? null;
        $teamId = $params['team_id'] ?? null;
        $date = $params['date'] ?? null;
        $milesFilter = $params['miles'] ?? null;
        $isProperties = $params['is_properties'] ?? null;
        $page = $params['page'] ?? null;
        $routeType = $params['route_type'] ?? null;
        $neLat = $params['ne_lat'] ?? null;
        $neLon = $params['ne_lon'] ?? null;
        $swLat = $params['sw_lat'] ?? null;
        $swLon = $params['sw_lon'] ?? null;

        $data = DrivingRoute::where(function ($query) use($search) {
            $query->whereRaw('lower(start_address) like (?)', '%' . strtolower($search) . '%')
                ->orWhereRaw('lower(end_address) like (?)', '%' . strtolower($search) . '%');
        });

        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($milesFilter) {
            $data = $data->where('total_distance', '<=', $milesFilter);
        }
        if ($routeType) {
            $data = $data->where('route_type', $routeType);
        }

        if ($date) {
            $data = $data->whereDate('created_at', $date)->with('user');
        } else {
            $data = $data->whereDate('created_at', '>', Carbon::now()->subDays(30))->with('user');
        }

        if ($isProperties) {
            $data = $data->whereHas('properties');
        }

        if ($neLat && $neLon && $swLat && $swLon) {
            $data = $data->where(function($query) use($neLat, $neLon, $swLat, $swLon) {
                $query->whereRaw('(
                    ((' . $swLat . ' < ' . $neLat . ' AND gps->"$[0].latitude" BETWEEN ' . $swLat . ' AND ' . $neLat . ') OR (' . $neLat . ' < ' . $swLat . ' AND gps->"$[0].latitude" BETWEEN ' . $neLat . ' AND ' . $swLat . '))
                    AND
                    ((' . $swLon . ' < ' . $neLon . ' AND gps->"$[0].longitude" BETWEEN ' . $swLon . ' AND ' . $neLon . ') OR (' . $neLon . ' < ' . $swLon . ' AND gps->"$[0].longitude" BETWEEN ' . $neLon . ' AND ' . $swLon . '))
                ) OR (
                    ((' . $swLat . ' < ' . $neLat . ' AND json_extract(`gps`, CONCAT("$[",JSON_LENGTH(`gps`)-1,"].latitude")) BETWEEN ' . $swLat . ' AND ' . $neLat . ') OR (' . $neLat . ' < ' . $swLat . ' AND json_extract(`gps`, CONCAT("$[",JSON_LENGTH(`gps`)-1,"].latitude")) BETWEEN ' . $neLat . ' AND ' . $swLat . '))
                    AND
                    ((' . $swLon . ' < ' . $neLon . ' AND json_extract(`gps`, CONCAT("$[",JSON_LENGTH(`gps`)-1,"].longitude")) BETWEEN ' . $swLon . ' AND ' . $neLon . ') OR (' . $neLon . ' < ' . $swLon . ' AND json_extract(`gps`, CONCAT("$[",JSON_LENGTH(`gps`)-1,"].longitude")) BETWEEN ' . $neLon . ' AND ' . $swLon . '))
                )
                ');
            });
        }

        $miles = $data->sum('total_distance');
        $trips = $data->count();

        $data = $data->orderBy($orderBy, $order)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $result = array(
            'trips' => $trips,
            'miles' => $miles,
            'data'  => $data,
        );

        return $result;
    }
}
