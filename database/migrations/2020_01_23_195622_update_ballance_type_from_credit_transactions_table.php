<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateBallanceTypeFromCreditTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('credit_transactions', function (Blueprint $table) {
            $table->integer('credit_ballance_before_transaction')->change();
            $table->integer('credit_ballance_after_transaction')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('credit_transactions', function (Blueprint $table) {
            //
        });
    }
}
