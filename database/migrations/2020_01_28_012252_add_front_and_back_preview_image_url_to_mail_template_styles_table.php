<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFrontAndBackPreviewImageUrlToMailTemplateStylesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_template_styles', function (Blueprint $table) {
            $table->string('front_preview_image_url');
            $table->string('back_preview_image_url');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mail_template_styles', function (Blueprint $table) {
            //
        });
    }
}
