<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\PropertyPhoneService;
use App\Http\Helpers\PhoneNumberHelper;

class FormatPropertyPhones extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'format:propertyphones';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Format Property Phones';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(PropertyPhoneService $propertyPhoneService)
    {
        parent::__construct();
        $this->propertyPhoneService = $propertyPhoneService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $phones = $this->propertyPhoneService->getAll();
        foreach ($phones as $phone) {
            $phone['phone_number'] = PhoneNumberHelper::formatToSimple($phone['phone_number']);
            $this->propertyPhoneService->update($phone['id'], array('phone_number' => $phone['phone_number']));
        }
    }
}
