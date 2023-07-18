<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Helpers\UrlSignHelper;

class UrlTestSign extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'url:sign';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Url sign';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $url = 'https://maps.googleapis.com/maps/api/streetview?location=31.543671669852433,-97.14987862263757&size=456x456&key=AIzaSyC_FWeQKfzUuWEarsF38d18O0YxtscOjO4';
        echo UrlSignHelper::signUrl($url, 'GIb6gxz5D5GERpsXByDQBbiixks=');
        echo PHP_EOL;
    }
}
