<?php

use Illuminate\Database\Seeder;
use App\Http\Helpers\MinifyHelper;
use Illuminate\Support\Facades\DB;

class MailTemplateStylesSeeder7 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/7';

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
                    background-color: white;
                }
                .container {
                    height: calc(100% - 30px);
                    padding: 15px 15px;
                }
                table {
                    width: 100%;
                    height: 100%;
                    font-size: 18px;
                    line-height: 25px;
                    table-layout: fixed;
                }
                td {
                    text-align: center;
                }
                .first-row {
                    height: 60%;
                    padding-bottom: 10%;
                }
                .left {
                    color: white;
                    width: 50%;
                    padding-right: 10%;
                }
                .gray-container {
                    background-color: {{primary_color}};
                    height: 100%;
                    color: white;
                }
                .section-a {
                    font-size: 25px;
                    font-weight: 800;
                    line-height: 25px;
                    padding: 20px;
                }
                .section-b {
                    font-size: 15px;
                    line-height: 15px;
                    padding: 20px;
                }
                .right {
                    width: 50%;
                    background-image: url({{street_view_image}});
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: cover;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr class="first-row">
                        <td class="left">
                            <table class="gray-container">
                                <tr>
                                    <td class="section-a">
                                        {{section_a}}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="section-b">
                                        {{section_b}}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td class="right">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div style="font-size: 22px;line-height: 30px; font-weight: bold; padding: 10px 10px;">
                                {{signature_address}}, {{signature_city}} {{signature_state}} {{signature_zip}}
                            </div>
                            <div style="font-size: 22px;line-height: 30px; padding: 10px 10px;">
                                Call me today <b>{{signature_phone}}</b>
                            </div>
                            <div style="font-size: 18px;line-height: 25px; padding: 10px 10px;">
                                Or text <b>I want to sell</b> to <b>{{signature_phone}}</b> to see your fair offer.
                            </div>
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
                    background-color: white;
                }
                .container {
                    height: calc(100% - 30px);
                    padding: 15px 15px;
                }
                table {
                    width: 100%;
                    height: calc(100%);
                    font-size: 18px;
                    line-height: 25px;
                    table-layout: fixed;
                }
                td {
                    text-align: left;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr>
                        <td>
                            <div>{{section_b}}</div>
                            <div style="margin-top: 30px;">{{section_c}}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div><b>Call Us</b></div>
                            <div>{{signature_phone}}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div><b>Address</b></div>
                            <div>{{signature_address}}</div>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
    </html>';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $backHtml = MinifyHelper::minify_html($backHtml);

        DB::table('mail_template_styles')->insert([
            'id'                        => 7,
            'name'                      => 'Postcard #7',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
            'primary_color'             => '#808080'
        ]);
    }
}
