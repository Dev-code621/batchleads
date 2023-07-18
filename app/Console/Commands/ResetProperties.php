<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Property;
use App\Repositories\PropertyRepository;
use App\Services\PropertyService;
use Carbon\Carbon;
use Log;

class ResetProperties extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'property:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Property Infos manually';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $property = new Property;
        $propertyRepository = new PropertyRepository($property);
        $this->propertyService = new PropertyService($propertyRepository);
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $now = Carbon::now();
        echo 'reset properties start = ' . $now . PHP_EOL;

        $count = 0;
        $page = 1;
        $perPage = 500;

        do {
            $properties = $this->propertyService->search(array(
                'is_reset'  => 1,
                'per_page'  => $perPage,
                'page'      => $page
            ));

            $search = [];
            foreach ($properties as $property) {
                $search []= array(
                    'requestId'     => $property['id'],
                    'address'       => array (
                        'street'    => $property['Site_Address'],
                        'city'      => $property['Site_City'],
                        'state'     => $property['Site_State'],
                        'zip'       => $property['Site_Zip5']
                    )
                );
            }

            $request = array(
                'requests' => $search,
                'options'  => array(
                    'take'          => 1000,
                    'hideRequests'  => false
                )
            );

            $result = $this->propertyService->propertySearchByAddressBulk($request);
            if ($result !== 404) {
                foreach ($result as $item) {
                    $requestId = $item['request_id'];
                    $data = array(
                        'Sale_Date'                     => $item['Sale_Date'],
                        'Sale_Price'                    => $item['Sale_Price'],
                        'Current_Est_Equity_Dollars'    => $item['Current_Est_Equity_Dollars'],
                        'Mortgage_Amount'               => $item['Mortgage_Amount'],
                        'Assessed_Value'                => $item['Assessed_Value'],
                        'Year_Built'                    => $item['Year_Built'],
                        'Square_Footage'                => $item['Square_Footage'],
                    );
                    if ($requestId) {
                        $count++;
                        $this->propertyService->update(intval($requestId), $data);
                    } else {
                        Log::info('request id = ', $request);
                    }
                }
            } else {
                Log::info('404 = ', $request);
            }

            $page++;
            $now = Carbon::now();
            echo 'now = ' . $now  . PHP_EOL;
            echo 'resetted count = ' . $count . PHP_EOL;
        } while (count($properties));

        $now = Carbon::now();
        echo 'reset properties end = ' . $now . PHP_EOL;
    }
}
