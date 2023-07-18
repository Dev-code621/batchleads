<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCreditTransactionTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credit_transaction_types', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->enum('transaction_type', ['send_sms', 'send_mail', 'skip_tracing', 'charge', 'other'])->unique();
            $table->integer('credit_amount');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('credit_transaction_types');
    }
}
