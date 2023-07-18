<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDrivingRoutesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('driving_routes', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('start_address')->nullable();
            $table->string('end_address')->nullable();
            $table->timestamp('date_time')->nullable();
            $table->decimal('total_hours', 8, 2)->nullable();;
            $table->decimal('total_distance', 8, 2)->nullable();
            $table->string('gps')->nullable();
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
        Schema::dropIfExists('driver_routes');
    }
}
