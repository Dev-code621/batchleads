<?php

namespace App\Http\Resources;

use App\Models\DrivingRoute;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class DrivingRouteResource
 *
 * @package App\Http\Resources
 */
class DrivingRouteResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request $request
   *
   * @return array
   */
  public function toArray($request)
  {
    /** @var $this DriverRoute */
    return [
      'id'              => $this->id,
      'user_id'         => $this->user_id,
      'start_address'   => $this->start_address,
      'end_address'     => $this->end_address,
      'date_time'       => $this->date_time,
      'total_hours'     => $this->total_hours,
      'total_distance'  => $this->total_distance,
    ];
  }
}
