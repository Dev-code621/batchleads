<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateMailTemplateStyleSectionsLimit extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('mail_template_style_sections')->where('id', 71)->update([
            'limit' => 24
        ]);
        DB::table('mail_template_style_sections')->where('id', 72)->update([
            'limit' => 114
        ]);
        DB::table('mail_template_style_sections')->where('id', 73)->update([
            'limit' => 60
        ]);

        DB::table('mail_template_style_sections')->where('id', 81)->update([
            'limit' => 24
        ]);
        DB::table('mail_template_style_sections')->where('id', 82)->update([
            'limit' => 90
        ]);
        DB::table('mail_template_style_sections')->where('id', 83)->update([
            'limit' => 23
        ]);

        DB::table('mail_template_style_sections')->where('id', 91)->update([
            'limit' => 24
        ]);
        DB::table('mail_template_style_sections')->where('id', 92)->update([
            'limit' => 114
        ]);
        DB::table('mail_template_style_sections')->where('id', 93)->update([
            'limit' => 60
        ]);

        DB::table('mail_template_style_sections')->where('id', 101)->update([
            'limit' => 24
        ]);
        DB::table('mail_template_style_sections')->where('id', 102)->update([
            'limit' => 114
        ]);
        DB::table('mail_template_style_sections')->where('id', 103)->update([
            'limit' => 60
        ]);

        DB::table('mail_template_style_sections')->where('id', 111)->update([
            'limit' => 112
        ]);
        DB::table('mail_template_style_sections')->where('id', 112)->update([
            'limit' => 526
        ]);
        DB::table('mail_template_style_sections')->where('id', 113)->update([
            'limit' => 142
        ]);

        DB::table('mail_template_style_sections')->where('id', 121)->update([
            'limit' => 416
        ]);
        DB::table('mail_template_style_sections')->where('id', 122)->update([
            'limit' => 226
        ]);
        DB::table('mail_template_style_sections')->where('id', 123)->update([
            'limit' => 313
        ]);

        DB::table('mail_template_style_sections')->where('id', 131)->update([
            'limit' => 232
        ]);
        DB::table('mail_template_style_sections')->where('id', 132)->update([
            'limit' => 266
        ]);
        DB::table('mail_template_style_sections')->where('id', 133)->update([
            'limit' => 154
        ]);
    }
}
