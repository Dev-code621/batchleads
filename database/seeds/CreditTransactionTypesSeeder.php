<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CreditTransactionTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('credit_transaction_types')->insert([
            'name'              => 'SEND MAIL',
            'transaction_type'  => config('services.credit_transaction_type.send_mail'),
            'credit_amount'     => 1
        ]);
        DB::table('credit_transaction_types')->insert([
            'name'              => 'SEND SMS',
            'transaction_type'  => config('services.credit_transaction_type.send_sms'),
            'credit_amount'     => 1
        ]);
        DB::table('credit_transaction_types')->insert([
            'name'              => 'PURCHASE PHONE',
            'transaction_type'  => config('services.credit_transaction_type.purchase_phone'),
            'credit_amount'     => 1
        ]);
        DB::table('credit_transaction_types')->insert([
            'name'              => 'SKIP TRACING',
            'transaction_type'  => config('services.credit_transaction_type.skip_tracing'),
            'credit_amount'     => 1
        ]);
        DB::table('credit_transaction_types')->insert([
            'name'              => 'CHARGE CREDIT',
            'transaction_type'  => config('services.credit_transaction_type.charge'),
            'credit_amount'     => 0
        ]);
        DB::table('credit_transaction_types')->insert([
            'name'              => 'OTHER',
            'transaction_type'  => config('services.credit_transaction_type.other'),
            'credit_amount'     => 1
        ]);
    }
}
