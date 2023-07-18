<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class UpdateMailTemplateStyles200917 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
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
                    font-size: 15px;
                    line-height: 17px;
                }
                td {
                    text-align: center;
                }
                .main-bg {
                    background-color: {{primary_color}};
                    color: white;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr>
                        <td class="main-bg" style="font-size: 20px; line-height: 20px;">
                        {{section_a}}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="width: 60%; margin: auto;">
                                {{section_b}}<br>
                                <b>{{section_c}}</b>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>{{property_address}}, {{property_city}} {{property_state}} {{property_zip}}</b>
                        </td>
                    </tr>
                    <tr>
                        <td class="main-bg" style="font-size: 12px; line-height: 15px;">
                            <div>
                                Call me today <b>{{signature_phone}}</b>
                            </div>
                            <div>
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
                    height: 100%;
                    font-size: 15px;
                    line-height: 17px;
                }
                td {
                    text-align: center;
                }
                .main-bg {
                    background-color: {{primary_color}};
                    font-weight: 800;
                    font-size: 20px;
                    line-height: 20px;
                    color: white;
                    width: 40%;
                }
                .main-image {
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
                    <tr>
                        <td class="main-image" colspan="2"></td>
                    </tr>
                    <tr>
                        <td>
                        {{section_b}}
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td class="main-bg">
                            <b>Call Me:</b><br>
                            {{signature_phone}}
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
            </div>
        </body>
    </html>';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $backHtml = MinifyHelper::minify_html($backHtml);

        DB::table('mail_template_styles')->where('id', 8)->update([
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
        ]);

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
                    background-color: white;
                    font-size: 10px;
                    line-height: 12px;
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
                .sub-container {
                    padding: 20px 20px;
                }
                td {
                    text-align: center;
                    width: 50%;
                }
                .main-bg {
                    background-color: {{primary_color}};
                    color: white;
                }
                .main-image {
                    background-image: url({{street_view_image}});
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: cover;
                    vertical-align: text-top;
                    padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr>
                        <td class="main-bg">
                            <table class="sub-container">
                                <tr>
                                    <td style="font-size: 20px; line-height: 20px;">
                                        {{section_a}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 15px; line-height: 15px;">
                                        {{section_b}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 11px; line-height: 15px;">
                                        Call me today <b>{{signature_phone}}</b>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align: left;">
                                        Or text <b>I want to sell</b> to<br> <b>{{signature_phone}}</b> to see your fair offer.
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td class="main-image">{{property_address}}, {{property_city}} {{property_state}} {{property_zip}}</td>
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
                    height: 100%;
                    font-size: 15px;
                    line-height: 17px;
                }
                td {
                    text-align: center;
                }
                .main-bg {
                    background-color: {{primary_color}};
                    color: white;
                    width: 40%;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table>
                    <tr>
                        <td style="font-size: 15px; line-height: 17px; font-weight: bold; width: 40%; height: 60%;">
                        {{section_b}}
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td class="main-bg">
                            <table style="color: white;">
                                <tr>
                                    <td style="width: 100%;">
                                        {{section_c}}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 100%;">
                                        Call me<br>
                                        {{signature_phone}}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>&nbsp;</td>
                    </tr>
                </table>
            </div>
        </body>
    </html>';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $backHtml = MinifyHelper::minify_html($backHtml);

        DB::table('mail_template_styles')->where('id', 9)->update([
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
        ]);
    }
}
