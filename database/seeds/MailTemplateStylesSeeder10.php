<?php

use Illuminate\Database\Seeder;
use App\Http\Helpers\MinifyHelper;
use Illuminate\Support\Facades\DB;

class MailTemplateStylesSeeder10 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/10';

        $frontHtml = '<html>
        <head>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;400;600;900&display=swap" rel="stylesheet">
            <style>
                html, body {
                    font-family: "Nunito Sans", sans-serif;
                    margin: 0;
                    padding: 0;
                    color: white;
                    background-color: {{primary_color}};
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
                .bottom {
                    font-size: 12px;
                    line-height: 15px;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <table>
                <tr>
                    <td style="font-size: 40px; line-height: 38px;">
                        {{section_a}}
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 25px; line-height: 34px;">
                        <div style="width: 50%; margin: auto;">
                        {{section_b}}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div class="bottom">
                            <b>🏠 {{property_address}}, {{property_city}} {{property_state}} {{property_zip}}</b>
                        </div>
                        <div class="bottom">
                            📞 Call me today <b>{{signature_phone}}</b>
                        </div>
                        <div class="bottom">
                            📲 Or text <b>I want to sell</b> to <b>{{signature_phone}}</b> to see your fair offer.
                        </div>
                    </td>
                </tr>
            </table>
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
                    color: white;
                    background-color: white;
                    font-size: 15px;
                    line-height: 20px;
                }
                .container {
                    height: calc(100%);
                }
                table {
                    width: 100%;
                    height: 100%;
                }
                td {
                    text-align: left;
                    padding-left: 20px;
                    padding-right: 20px;
                }
                .main-bg {
                    background-color: {{primary_color}};
                    width: 40%;
                }
                .small {
                    font-size: 12px;
                    line-height: 15px;
                    margin-bottom: 50px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table class="main-bg">
                    <tr>
                        <td style="padding-top: 15px;">
                            {{section_b}}<br><br>
                            {{section_c}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="small">
                                <b>Call Us</b><br>
                                {{signature_phone}}
                            </div>
                            <div class="small">
                                <b>Address</b><br>
                                {{signature_address}}
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
    </html>';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $backHtml = MinifyHelper::minify_html($backHtml);

        DB::table('mail_template_styles')->insert([
            'id'                        => 10,
            'name'                      => 'Postcard #10',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
            'primary_color'             => '#AB2222'
        ]);
    }
}
