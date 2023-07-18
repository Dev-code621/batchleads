<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class MailTemplateStylesSeeder4 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/4';

        $frontHtml = '<html>
            <head>
                <meta charset="utf-8">
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;0,900;1,700;1,800;1,900&display=swap" rel="stylesheet">
                <style>
                    html, body {
                        font-family: "Montserrat", sans-serif;
                        margin: 0;
                        padding: 0;
                        color: #1a1818;
                        line-height: 12px;
                        background-color: white;
                        font-size: 12px;
                        height: 100%;
                    }
                    body {
                        padding: 10px 10px;
                        height: calc(100% - 20px);
                    }
                    .container {
                        height: calc(100% - 30px);
                        border: 5px solid {{primary_color}};
                        padding: 10px 10px;
                    }
                    table {
                        height: calc(100%);
                        table-layout: fixed;
                        width: 100%;
                    }
                    .main-bg-color {
                        background-color: {{primary_color}};
                    }
                    .main-color {
                        color: {{primary_color}};
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .content {
                        text-align: left;
                    }
                    .main-content {
                        width: 380px;
                        height: 110px;
                        margin-bottom: 20px;
                        margin: auto;
                    }
                    .main-bg {
                        width: 150px;
                        height: 110px;
                        background-image: url({{street_view_image}});
                        background-size: cover;
                        float: left;
                    }
                    .property-info {
                        font-family: "Bebas Neue", sans-serif;
                        font-size: 3rem;
                        text-transform: uppercase;
                        font-stretch: normal;
                        font-style: normal;
                        line-height: 1.2;
                        letter-spacing: normal;
                        text-align: center;
                    }
                    p {
                        font-size: 0.8rem;
                        line-height: 1.6;
                    }
                    ul {
                        padding-left: 1rem;
                        list-style: none;
                        margin-left: 20px;
                        float: left;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }
                    li {
                        line-height: 1.2rem;
                        font-size: 0.8rem;
                    }
                    ul li::before {
                        content: "\2022";
                        color: {{primary_color}};
                        font-weight: bold;
                        display: inline-block;
                        width: 1em;
                        margin-left: -1em;
                        font-size: 1rem;
                    }
                    .contact-info {
                        font-family: "Bebas Neue", sans-serif;
                        font-size: 1.5rem;
                        text-align: center;
                        line-height: 1;
                    }
                    .clear {
                        clear: both;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <table>
                        <tr>
                            <td>
                                <div class="property-info main-color bold">Important property information</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="content">
                                    <p>
                                        {{section_a}}
                                        <br />
                                        <br />
                                        {{disclosure_agreement}}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="main-content">
                                    <div class="main-bg"></div>
                                    <ul class="bold">
                                        <li>We buy As-is</li>
                                        <li>We Pay CASH</li>
                                        <li>No Commissions Paid to us</li>
                                        <li>We pay most Standard Closing Costs</li>
                                        <li>No need to do Repairs</li>
                                        <li>Close on your Schedule</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="contact-info main-color">
                                    {{owner_name}} | {{owner_address}} | {{owner_city}} {{owner_state}} {{owner_zip}}
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
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,700;0,800;0,900;1,700;1,800;1,900&display=swap" rel="stylesheet">
                <style>
                    html, body {
                        font-family: "Montserrat", sans-serif;
                        margin: 0;
                        color: #1a1818;
                        line-height: 12px;
                        background-color: white;
                        font-size: 12px;
                        height: 100%;
                    }
                    body {
                        padding: 10px 10px;
                        height: calc(100% - 20px);
                    }
                    .main-bg-color {
                        background-color: {{primary_color}};
                    }
                    .main-color {
                        color: {{primary_color}};
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .container {
                        height: calc(100% - 30px);
                        border: 5px solid {{primary_color}};
                        padding: 10px 10px;
                    }
                    table {
                        height: calc(100%);
                        table-layout: fixed;
                        width: 100%;
                    }
                    tr, td {
                        text-align: left;
                    }
                    p {
                        font-size: 0.8rem;
                        line-height: 1.6;
                    }
                    .contact-info {
                        font-size: 2rem;
                        font-family: "BebasNeue", sans-serif;
                    }
                    .name {
                        line-height: 1;
                    }
                    .address {
                        font-size: 0.5em;
                        line-height: 1;
                        margin-top: 2rem;
                    }
                    .phone {
                        line-height: 1;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <table>
                        <tr>
                            <td style="vertical-align: top">
                                <p>
                                    {{section_b}}
                                    <br />
                                    <br />
                                    {{section_c}}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div>{{signature_sign_off}},</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="contact-info main-color">
                                    <div class="name bold">{{signature_name}}</div>
                                    <div class="address bold">{{signature_address}} <br />{{signature_city}} {{signature_state}} {{signature_zip}}</div>
                                    <div class="phone bold">{{signature_phone}}</div>
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
            'id'                        => 4,
            'name'                      => 'Style #4',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
        ]);
    }
}
