<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreditPackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('credit_packages')->insert([
            'price'         => 10,
            'credit_amount' => 300,
        ]);
        DB::table('credit_packages')->insert([
            'price'         => 20,
            'credit_amount' => 600,
        ]);
    }
}
