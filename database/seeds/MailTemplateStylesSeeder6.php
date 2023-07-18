<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class MailTemplateStylesSeeder6 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/6';

        $frontHtml = '
            <html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://fonts.googleapis.com/css2?family=Sintony&display=swap" rel="stylesheet">
                    <style>
                        html, body {
                            font-family: "Sintony", sans-serif;
                            margin: 0;
                            color: #1a1818;
                            line-height: 10px;
                            font-size: 10px;
                            padding: 0 0;
                            margin: 0 0;
                            padding-right: 5px;
                            height: 100%;
                        }
                        body {
                        }
                        .bold {
                            font-weight: bold;
                        }
                        .main-color {
                            color: {{primary_color}};
                        }
                        .container {
                            width: 100%;
                            height: 100%;
                        }
                        .left {
                            width: 35%;
                            height: calc(100%);
                            float: left;
                        }
                        .main-bg {
                            width: 100%;
                            height: 100%;
                            background-image: url({{street_view_image}});
                            background-size: cover;
                            background-position: center center;
                        }
                        .right {
                            width: calc(65% - 50px);
                            margin-left: 50px;
                            float: left;
                            height: calc(100%);
                        }
                        .right-align {
                            text-align: right;
                        }
                        .contact-info {
                            font-size: 1.5rem;
                            line-height: 1.28;
                        }
                        .property-info {
                            font-size: 3.5rem;
                            line-height: 1;
                        }
                        p {
                            font-size: 0.8rem;
                        }
                        table {
                            height: calc(100%);
                            table-layout: fixed;
                            width: 100%;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="left">
                            <div class="main-bg"></div>
                        </div>
                        <div class="right">
                            <table>
                                <tr>
                                    <td>
                                        <div class="contact-info right-align">
                                            {{owner_name}}<br />
                                            {{owner_address}}<br />
                                            {{owner_city}} {{owner_state}} {{owner_zip}}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="property-info main-color right-align">
                                            Important<br />
                                            Property<br />
                                            Information<br />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>
                                            {{section_a}}
                                        </p>
                                        <p>
                                            {{disclosure_agreement}}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </body>
            </html>
        ';
        $backHtml = '<html>
            <head>
                <meta charset="utf-8">
                <link href="https://fonts.googleapis.com/css2?family=Sintony&display=swap" rel="stylesheet">
                <style>
                    html, body {
                        font-family: "Sintony", sans-serif;
                        margin: 0;
                        color: #1a1818;
                        line-height: 10px;
                        font-size: 10px;
                        padding: 0 0;
                        margin: 0 0;
                        height: 100%;
                    }
                    body {
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .main-color {
                        color: {{primary_color}};
                    }
                    .container {
                        width: calc(100% - 20px);
                        height: calc(100% - 20px);
                        padding: 10px 10px;
                    }
                    .list {
                        width: 100%;
                    }
                    ul {
                        padding: 0 0;
                        margin: 0 0;
                        list-style: none;
                        font-size: 0.8rem;
                        font-weight: bold;
                        float: left;
                        width: 50%;
                    }
                    li {
                        line-height: 1.5rem;
                        list-style: none;
                        white-space: nowrap;
                    }
                    .contact-info {
                        font-size: 1.5rem;
                        line-height: 1.28;
                    }
                    .property-info {
                        font-size: 3.5rem;
                        line-height: 1;
                    }
                    p {
                        font-size: 0.7rem;
                    }
                    .sincerely-container {
                    }
                    .sincerely {
                        font-size: 0.7rem;
                        float: left;
                    }
                    .name {
                        font-size: 1.5rem;
                        line-height: 1;
                        margin-left: 10px;
                        float: left;
                    }
                    .contact {
                    }
                    .name {
                        font-size: 1rem;
                        line-height: 1;
                    }
                    .phone {
                        font-size: 3rem;
                        line-height: 1;
                        margin-top: 10px;
                    }
                    .address {
                        white-space: nowrap;
                    }
                    table {
                        height: calc(100%);
                        table-layout: fixed;
                        width: 100%;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <table>
                        <tr>
                            <td>
                                <div class="list">
                                    <ul>
                                        <li>We buy As-Is</li>
                                        <li>We Pay CASH</li>
                                        <li>No Commissions Paid to us</li>
                                    </ul>
                                    <ul>
                                        <li>We pay most Standard Closing Costs</li>
                                        <li>No need to do Repairs</li>
                                        <li>Close on your Schedule</li>
                                    </ul>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>
                                    {{section_b}}
                                </p>
                                <p style="width: 30%">
                                    {{section_c}}
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="sincerely-container">
                                    <div class="sincerely">{{signature_sign_off}},</div>
                                    <div class="name">{{signature_name}}</div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="contact">
                                    <div class="address">{{signature_address}} | {{signature_city}} {{signature_state}} {{signature_zip}}</div>
                                    <div class="phone main-color">{{signature_phone}}</div>
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
            'id'                        => 6,
            'name'                      => 'Style #6',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
        ]);
    }
}
