<?php

namespace App\Services;

use App\Repositories\DrivingRouteRepository;


/**
 * Class DrivingRouteService
 *
 * @package App\Http\Services
 */
class DrivingRouteService extends BaseService
{
  /**
   * DrivingRouteService constructor.
   *
   * @param DrivingRouteRepository     $drivingRouteRepository
   */
  public function __construct(DrivingRouteRepository $drivingRouteRepository)
  {
    $this->repository = $drivingRouteRepository;
  }
}
