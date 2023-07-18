<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailTemplateStyleSectionsSeeder10 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mail_template_style_sections')->insert([
            'id'                        => 101,
            'name'                      => 'section A',
            'mail_template_style_id'    => 10,
            'content'                   => 'I want to buy your house'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 102,
            'name'                      => 'section B',
            'mail_template_style_id'    => 10,
            'content'                   => 'If you have any interest in selling fast, as-is and with zero commissions or closing cost, I would like to buy it.'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 103,
            'name'                      => 'section C',
            'mail_template_style_id'    => 10,
            'content'                   => 'I am interested in buying your house at {{property_address}}'
        ]);
    }
}
