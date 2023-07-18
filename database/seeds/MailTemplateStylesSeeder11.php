<?php

use Illuminate\Database\Seeder;
use App\Http\Helpers\MinifyHelper;
use Illuminate\Support\Facades\DB;

class MailTemplateStylesSeeder11 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/11';

        $frontHtml = '<html>
        <head>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;400;600;900&display=swap" rel="stylesheet">
            <style>
                html, body {
                    font-family: "Nunito Sans", sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #5F5F5F;
                    background-color: {{primary_color}};
                }
                .container {
                    height: calc(100% - 30px);
                    padding: 15px 15px;
                }
                table {
                    width: 100%;
                    height: 100%;
                    font-size: 15px;
                    line-height: 17px;
                }
                td {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr>
                        <td>
                            <div style="font-size: 24px; line-height: 24px;">
                                Third Notice
                            </div>
                            <div style="font-size: 17px; line-height: 17px;">
                                {{section_a}}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">
                            {{section_b}}
                        </td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; font-size: 12px; line-height: 15px; text-align: left;">
                            {{disclosure_agreement}}
                            <br><br>
                            I would appreciate you keeping this matter private.
                            <br><br>
                            {{signature_sign_off}}, {{signature_name}}
                        </td>
                    </tr>
                </table>
            </div>
        </body>
    </html>';
        $backHtml = '<html>
        <head>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;400;600;900&display=swap" rel="stylesheet">
            <style>
                html, body {
                    font-family: "Nunito Sans", sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #5F5F5F;
                    background-color: {{primary_color}};
                    font-size: 15px;
                    line-height: 17px;
                }
                .container {
                    height: calc(100% - 30px);
                    padding: 15px 15px;
                }
                table {
                    width: 100%;
                    height: 100%;
                }
                td {
                    text-align: center;
                    padding-left: 20px;
                    padding-right: 20px;
                    font-size: 13px;
                    line-height: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr>
                        <td colspan="2">
                            <div style="font-size: 24px; line-height: 24px;">
                                Third Notice
                            </div>
                            <div style="font-size: 17px; line-height: 17px;">
                                How much longer before I hear from you?!
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 40%; height: 70%; text-align: left; background-color: gray; color: white;">
                            {{owner_name}}<br>
                            {{owner_address}}<br />
                            {{owner_city}} {{owner_state}} {{owner_zip}}<br><br>
                            {{section_c}}<br>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
            </div>
        </body>
    </html>';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $backHtml = MinifyHelper::minify_html($backHtml);

        DB::table('mail_template_styles')->insert([
            'id'                        => 11,
            'name'                      => 'Postcard #11',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
            'primary_color'             => '#EEFF30'
        ]);
    }
}
