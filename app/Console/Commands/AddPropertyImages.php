<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PropertyService;
use App\Services\PropertyImageService;
use App\Http\Helpers\UrlSignHelper;

class AddPropertyImages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'property:images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add Property StreetView Images';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(PropertyService $propertyService, PropertyImageService $propertyImageService)
    {
        parent::__construct();
        $this->propertyService = $propertyService;
        $this->propertyImageService = $propertyImageService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $properties = $this->propertyService->search(array(
            'is_all'    => 1
        ));

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
    }
}
