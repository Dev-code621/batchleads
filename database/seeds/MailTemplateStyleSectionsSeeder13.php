<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailTemplateStyleSectionsSeeder13 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mail_template_style_sections')->insert([
            'id'                        => 131,
            'name'                      => 'section A',
            'mail_template_style_id'    => 13,
            'content'                   => 'Dear <b>{{owner_name}}</b><br>My name is <b>{{signature_name}}</b> and I am interested in buying your house at <span class="main-color">{{property_address}}, {{property_city}} {{property_state}} {{property_zip}}</span>.'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 132,
            'name'                      => 'section B',
            'mail_template_style_id'    => 13,
            'content'                   => 'Even if you’re unsure about selling, please, call me today. I’d be happy to talk you through the process, with no commitment or obligation whatsoever.<br><br>My personal phone number is {{signature_phone}}. If I don’t answer, I promise to call you back very quickly.'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 133,
            'name'                      => 'section C',
            'mail_template_style_id'    => 13,
            'content'                   => 'If your home is currently being marketed by a realtor, please put us in contact with your realtor. This is no way solicitation to other realtor’s clients.'
        ]);
    }
}
