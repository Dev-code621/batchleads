<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailTemplateStyleSectionsSeeder11 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mail_template_style_sections')->insert([
            'id'                        => 111,
            'name'                      => 'section A',
            'mail_template_style_id'    => 11,
            'content'                   => 'Attention {{signature_name}}, I urgently Need to speak with you<br>about your property at: {{property_address}}.'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 112,
            'name'                      => 'section B',
            'mail_template_style_id'    => 11,
            'content'                   => 'I am hoping this card catches you in time. I’ve tried for hours to find your phone number using the Internet but was unable to <br><br>
            I have recorder a brief message about your property at {{property_address}}. So that you could at least hear me out and then decide if we should speak over the phone.<br><br>
            All you have to do is call me at {{signature_phone}} to listen to my pre-recorded message about this matter. Call 24 hours a day, 7 days a week, to listen to my message. (No one will answer).'
        ]);

        DB::table('mail_template_style_sections')->insert([
            'id'                        => 113,
            'name'                      => 'section C',
            'mail_template_style_id'    => 11,
            'content'                   => 'I have done all I can to get a hold you and this my last resort…<br><br>Please turn this card over… It’s  important that I hear from you ASAP.'
        ]);
    }
}
