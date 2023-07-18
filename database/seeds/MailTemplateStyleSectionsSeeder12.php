<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailTemplateStyleSectionsSeeder12 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mail_template_style_sections')->insert([
            'id'                        => 121,
            'name'                      => 'section A',
            'mail_template_style_id'    => 12,
            'content'                   => 'Dear {{owner_name}}<br>
            I am writing because I am a local investor and would like to provide you with an unconditional offer on your property at ({{property_address}}).<br>It is critical for me to stress that there is never any commitment when you call, even if you are simply curious. As professional investors, we are always happy to provide you with information regardless of the outcome.'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 122,
            'name'                      => 'section B',
            'mail_template_style_id'    => 12,
            'content'                   => 'Simply call today for a guaranteed offer in 72 hours or less. I’ll be glad to personally tell you more about my company and how we can work together. All calls are completely confidential and there is no obligation whatsoever.'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 123,
            'name'                      => 'section C',
            'mail_template_style_id'    => 12,
            'content'                   => 'Even if you are not interested in selling at this time, call <span class="main-color" style="font-size: 16px;">{{signature_phone}}</span>, so I can help you with determining the value of your property. Be sure to KEEP THIS LETTER. Thank you for your time and consideration and I look forward to speaking with you.'
        ]);
    }
}
