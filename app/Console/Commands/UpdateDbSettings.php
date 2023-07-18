<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Log;

class UpdateDbSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:resetting';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Database Settings';

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
        $host = env('DB_HOST', '127.0.0.1');
        $db = env('DB_DATABASE', 'laravel');
        $user = env('DB_USERNAME', 'root');
        $pass = env('DB_PASSWORD', 'root');
        $link = mysqli_connect($host, $user, $pass, $db);
        $result = mysqli_query($link, 'show tables');
        $data = [];

        while ($obj = $result->fetch_array()) {
            mysqli_query($link, 'ALTER TABLE ' . $obj[0] . ' CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin');
        }

        Log::info('Updated DB settings - Success');
    }
}
