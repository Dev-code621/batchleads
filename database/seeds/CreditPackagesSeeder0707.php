<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreditPackagesSeeder0707 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('credit_packages')->insert([
            'price'         => 50,
            'credit_amount' => 1500,
        ]);
        DB::table('credit_packages')->insert([
            'price'         => 100,
            'credit_amount' => 3000,
        ]);
        DB::table('credit_packages')->insert([
            'price'         => 250,
            'credit_amount' => 7500,
        ]);
        DB::table('credit_packages')->insert([
            'price'         => 500,
            'credit_amount' => 15000,
        ]);
    }
}
