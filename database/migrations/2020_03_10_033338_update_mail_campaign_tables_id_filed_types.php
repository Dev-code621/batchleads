<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMailCampaignTablesIdFiledTypes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('mail_campaigns', function (Blueprint $table) {
            DB::statement("ALTER TABLE `mail_campaigns` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
            DB::statement("ALTER TABLE `mail_campaigns` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_campaigns` CHANGE `team_id` `team_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_campaigns` CHANGE `template_id` `template_id` BIGINT(20) UNSIGNED NOT NULL");

            DB::statement("ALTER TABLE `mail_campaign_properties` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
            DB::statement("ALTER TABLE `mail_campaign_properties` CHANGE `mail_campaign_id` `mail_campaign_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_campaign_properties` CHANGE `property_id` `property_id` BIGINT(20) UNSIGNED NOT NULL");

            DB::statement("ALTER TABLE `mail_signatures` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
            DB::statement("ALTER TABLE `mail_signatures` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_signatures` CHANGE `team_id` `team_id` BIGINT(20) UNSIGNED NOT NULL");

            DB::statement("ALTER TABLE `mail_templates` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
            DB::statement("ALTER TABLE `mail_templates` CHANGE `team_id` `team_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_templates` CHANGE `user_id` `user_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_templates` CHANGE `signature_id` `signature_id` BIGINT(20) UNSIGNED NOT NULL");
            DB::statement("ALTER TABLE `mail_templates` CHANGE `mail_template_style_id` `mail_template_style_id` BIGINT(20) UNSIGNED NOT NULL");

            DB::statement("ALTER TABLE `mail_template_sections` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
            DB::statement("ALTER TABLE `mail_template_sections` CHANGE `template_id` `template_id` BIGINT(20) UNSIGNED NOT NULL");

            DB::statement("ALTER TABLE `mail_template_styles` CHANGE `id` `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('mail_campaigns', function (Blueprint $table) {
            //
        });
    }
}
