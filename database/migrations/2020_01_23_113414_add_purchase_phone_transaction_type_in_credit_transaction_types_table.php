<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPurchasePhoneTransactionTypeInCreditTransactionTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('credit_transaction_types', function (Blueprint $table) {
            DB::statement("ALTER TABLE credit_transaction_types CHANGE COLUMN transaction_type transaction_type ENUM('send_sms', 'send_mail', 'purchase_phone', 'skip_tracing', 'charge', 'other') NOT NULL UNIQUE");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('credit_transaction_types', function (Blueprint $table) {
            //
        });
    }
}
