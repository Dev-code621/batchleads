<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailTemplateStyleSectionsSeeder8 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mail_template_style_sections')->insert([
            'id'                        => 81,
            'name'                      => 'section A',
            'mail_template_style_id'    => 8,
            'content'                   => 'I want to buy your house'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 82,
            'name'                      => 'section B',
            'mail_template_style_id'    => 8,
            'content'                   => 'If you have any interest in selling fast, as-is and with zero commissions or closing cost,'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 83,
            'name'                      => 'section C',
            'mail_template_style_id'    => 8,
            'content'                   => 'I would like to buy it.'
        ]);
    }
}
