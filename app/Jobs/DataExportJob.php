<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;
use App\Models\Property;
use App\Models\User;
use App\Models\Team;
use App\Repositories\UserRepository;
use App\Services\OneSignalService;
use App\Models\OneSignal;
use App\Repositories\OneSignalRepository;
use App\Models\UserNotificationSetting;
use App\Repositories\UserNotificationSettingRepository;
use App\Repositories\PropertyRepository;

class DataExportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $type;
    protected $userId;
    protected $teamId;
    protected $filter;
    protected $stripeService;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($type, $userId, $teamId, $filter, $stripeService)
    {
        $this->type = $type;
        $this->userId = $userId;
        $this->teamId = $teamId;
        $this->filter = $filter;
        $this->stripeService = $stripeService;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $user = new User;
        $userRepository = new UserRepository($user);
        $oneSignal = new OneSignal;
        $oneSignalRepository = new OneSignalRepository($oneSignal);
        $userNotificationSetting = new UserNotificationSetting;
        $userNotificationSettingRepository = new UserNotificationSettingRepository($userNotificationSetting);
        $oneSignalService = new OneSignalService($userRepository, $oneSignalRepository, $userNotificationSettingRepository);
        $property = new Property;
        $propertyRepository = new PropertyRepository($property);

        $data = [
            'id'                            => 'id',
            'address1'                      => 'Property Address',
            'Site_Address'                  => 'Property Street',
            'Site_City'                     => 'Property City',
            'Site_State'                    => 'Property State',
            'Site_Zip5'                     => 'Property Zip',
            'Current_Owner_Name'            => 'Owner Name',
            'Owner1FirstName'               => 'Owner_First',
            'Owner1LastName'                => 'Owner_Last',
            'Owner_Status'                  => 'Owner Type',
            'CO_Mail_Street_Address'        => 'Mailing Address',
            'CO_Mailing_City'               => 'Mailing City',
            'CO_Mailing_State'              => 'Mailing State',
            'CO_Mailing_Zip_Code'           => 'Mailing Zip',
            'skip_traced'                   => 'Skip Traced',
            'Sale_Date'                     => 'Sale Date',
            'Sale_Price'                    => 'Sale Price',
            'Current_Est_Equity_Dollars'    => 'Equity',
            'Mortgage_Amount'               => 'Current_mortgage',
            'Assessed_Value'                => 'Assessed Value',
            'Year_Built'                    => 'Year Build',
            'Square_Footage'                => 'Square Footage',
            'user.name'                     => 'Created By',
            'status'                        => 'Status',
            'folder.name'                   => 'Folder',
        ];
        for ($i = 1; $i <= 10; $i++) {
            $data['phone' . $i] = 'Phone' . $i;
        }
        for ($i = 1; $i <= 10; $i++) {
            $data['email' . $i] = 'Email' . $i;
        }

        $team = Team::find($this->teamId);
        $propertyExportCount = $team['property_export_count'];
        $counts = array(
            config('services.plans.basic.name')             => 3000,
            config('services.plans.basic_new.name')         => 3000,
            config('services.plans.basic_yearly.name')      => 3000,
            config('services.plans.standard.name')          => 5000,
            config('services.plans.standard_yearly.name')   => 5000,
            config('services.plans.standard_new.name')      => 5000,
            config('services.plans.premium.name')           => 10000,
            config('services.plans.premium_new.name')       => 10000,
            config('services.plans.premium_yearly.name')    => 10000
        );
        $subscribedPlanName = $this->stripeService->getUserSubscribedPlanName(User::where('id', $this->userId)->first());
        $exportLimit = 0;
        if ($subscribedPlanName) {
            $exportLimit = $counts[$subscribedPlanName];
        }

        $orderBy = 'properties.created_at';
        $order = 'desc';
        $page = 1;
        $perPage = 500;
        $count = 0;

        $params = $this->filter;
        if (!$params['user_id']) {
            $params['user_id'] = $this->userId;
        }
        $params['team_id'] = $this->teamId;

        do {
            $perPage = 500;
            // if ($exportLimit >= ($propertyExportCount + $perPage)) {
            //     $perPage = 500;
            // } else {
            //     $perPage = $exportLimit - $propertyExportCount;
            // }
            $properties = $propertyRepository->buildSearchQuery($params);
            $properties = $properties->orderBy($orderBy, $order);
            $properties = $properties->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            if ($this->type === 'all' && count($properties)) {
                $csvExporter = new \Laracsv\Export();
                $csvExporter->beforeEach(function ($property) {
                    $property->Owner_Status = (
                        $property->Owner_Occupied === 'Y'
                        || $property->Owner_Occupied === 1
                        || $property->Owner_Occupied === "1"
                        || $property->Owner_Occupied === true
                        || $property->Owner_Occupied === "true"
                    ) ? 'Owner Occupied'
                    : 'Absentee Owner';
                    $property->skip_traced = $property->skip_tracing_date ? 'Yes' : 'No';

                    for ($i = 1; $i <= 10; $i++) {
                        $property['phone' . $i] = '';
                    }
                    $phones = $property->phones;
                    $i = 1;
                    foreach($phones as $phone) {
                        $property['phone' . $i] = $phone->phone_number;
                        $i++;
                    }

                    for ($i = 1; $i <= 10; $i++) {
                        $property['email' . $i] = '';
                    }
                    $emails = $property->emails;
                    $i = 1;
                    foreach($emails as $email) {
                        $property['email' . $i] = $email->email;
                        $i++;
                    }
                });
                $csvExporter->build(
                    $properties,
                    $data
                );
                $csvWriter = $csvExporter->getWriter();
                $csvString = $csvWriter->getContent();
                if ($page === 1) {
                    Storage::put('property_export_' . $this->userId . '.csv', $csvString);
                } else {
                    $csvString = preg_replace('/^.+\n/', '', $csvString);
                    Storage::append('property_export_' . $this->userId . '.csv', $csvString);
                }
            }
            $count += count($properties);
            $propertyExportCount += count($properties);
            Team::where('id', $this->teamId)->update(
                array(
                    'property_export_count' => $propertyExportCount
                )
            );
            $page ++;
        } while (count($properties));

        $oneSignalService->sendPropertyExportNotification($this->userId, $count);
    }
}
