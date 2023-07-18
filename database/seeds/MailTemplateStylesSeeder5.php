<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class MailTemplateStylesSeeder5 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/5';

        $frontHtml = '
            <html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://fonts.googleapis.com/css2?family=Sintony&display=swap" rel="stylesheet">
                    <style>
                        html, body {
                            font-family: "Sintony", sans-serif;
                            margin: 0;
                            color: white;
                            line-height: 10px;
                            height: 100%;
                            font-size: 10px;
                        }
                        body {
                            background-color: {{primary_color}};
                        }
                        .bold {
                            font-weight: bold;
                        }
                        .container {
                            height: calc(100% - 20px);
                            display: flex;
                            flex-direction: row;
                            padding: 10px 10px;
                        }
                        table {
                            height: calc(100%);
                            table-layout: fixed;
                            width: 100%;
                        }
                        .left {
                            float: left;
                            height: calc(100%);
                        }
                        .property-info {
                            font-size: 4rem;
                            line-height: 1;
                        }
                        p {
                            font-size: 0.8rem;
                            line-height: 1.6;
                        }
                        .list {
                            width: 100%;
                        }
                        ul {
                            padding: 0 0;
                            margin: 0 0;
                            list-style: none;
                            width: 50%;
                            float: left;
                        }
                        li {
                            line-height: 1.5rem;
                            list-style: none;
                        }
                        .right {
                            height: calc(100%);
                        }
                        .contact-info {
                            font-size: 1.3rem;
                            line-height: 1.3;
                            text-align: right;
                            min-width: 150px;
                        }
                        .main-bg {
                            width: 100%;
                            height: 100%;
                            background-image: url({{street_view_image}});
                            background-size: cover;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <table>
                            <tr>
                                <td>
                                    <div class="left">
                                        <table>
                                            <tr>
                                                <td>
                                                    <div class="property-info">Important Property Information</div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <p>
                                                        {{section_a}}
                                                        <br />
                                                        <br />
                                                        {{disclosure_agreement}}
                                                    </p>
                                                </td>
                                            </tr>
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
                                        </table>
                                    </div>
                                </td>
                                <td style="width: 30%">
                                    <div class="right">
                                        <table>
                                            <tr>
                                                <td>
                                                    <div class="contact-info">
                                                        {{owner_name}}<br />
                                                        {{owner_address}}<br />
                                                        {{owner_city}} {{owner_state}} {{owner_zip}}<br/>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height: 200%;">
                                                    <div class="main-bg"></div>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>

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
                        color: white;
                        line-height: 10px;
                        font-size: 10px;
                        height: 100%;
                    }
                    body {
                        background-color: {{primary_color}};
                    }
                    .bold {
                        font-weight: bold;
                    }
                    .container {
                        height: calc(100% - 20px);
                        padding: 10px 10px;
                    }
                    p {
                        font-size: 0.8rem;
                        line-height: 1.6;
                    }
                    table {
                        height: calc(100%);
                        table-layout: fixed;
                        width: 100%;
                    }
                    .left {
                        width: 35%;
                        float: left;
                    }
                    .right {
                        width: calc(65% - 130px);
                        float: left;
                        margin-left: 30px;
                        margin-right: 100px;
                    }
                    .sincerely-container {
                        margin-top: 15px;
                    }
                    .sincerely {
                        float: left;
                        font-size: 1rem;
                        margin-top: 10px;
                    }
                    .name {
                        font-size: 2rem;
                        margin-left: 20px;
                        float: left;
                    }
                    .contact-info {
                        width: 100%;
                    }
                    .address {
                        font-size: 1.5rem;
                        line-height: 1;
                    }
                    .name {
                        font-size: 2rem;
                        line-height: 1.3;
                    }
                    .phone {
                        margin-top: 20px;
                        font-size: 2.5rem;
                        line-height: 1;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <table>
                        <tr>
                            <td style="vertical-align: top">
                                <div>
                                    <p>
                                        {{section_b}}
                                        <br />
                                        <br />
                                        {{section_c}}
                                    </p>
                                </div>
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
                                <div class="contact-info">
                                    <div class="address">
                                        {{signature_address}}<br />
                                        {{signature_city}} {{signature_state}} {{signature_zip}}
                                    </div>
                                    <div class="phone">
                                        {{signature_phone}}
                                    </div>
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
            'id'                        => 5,
            'name'                      => 'Style #5',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
        ]);
    }
}
