<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Services\PropertyService;
use App\Models\PropertyImage;
use App\Repositories\PropertyImageRepository;
use App\Services\PropertyImageService;
use App\Models\Team;
use App\Repositories\TeamRepository;
use App\Services\TeamService;

class CreateStreetViewImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $user;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(
        $user
    )
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $property = new Property;
        $propertyRepository = new PropertyRepository($property);
        $this->propertyService = new PropertyService($propertyRepository);

        $propertyImage = new PropertyImage;
        $propertyImageRepository = new PropertyImageRepository($propertyImage);
        $this->propertyImageService = new PropertyImageService($propertyImageRepository);

        $team = new Team;
        $teamRepository = new TeamRepository($team);
        $this->teamService = new TeamService($teamRepository);

        $teamId = $this->teamService->getTeamId($this->user);
        $page = 1;
        $perPage = 100;
        do {
            $properties = $property->where('team_id', $teamId)
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();
            foreach ($properties as $property) {
                $propertyImages = $this->propertyImageService->findWhere(
                    array(
                        'property_id'       => $property['id'],
                        'is_location_image' => 1
                    )
                );

                if (!count($propertyImages)) {
                    $lat = $property['location_latitude'];
                    $lon = $property['location_longitude'];
                    $this->propertyImageService->createStreetViewImage($property['id'], $lat, $lon);
                }
            }
            $page ++;
        } while (count($properties));
    }
}
