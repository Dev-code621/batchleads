<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class MailTemplateStylesSeeder3 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/3';

        $frontHtml = '<html>
            <head>
                <meta charset="utf-8">
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
                }
                body {
                    padding: 15px 15px;
                }
                .clear {
                    clear: both;
                }
                .container {
                }
                table {
                    border-width: 0px;
                    table-layout: fixed;
                    width: 100%;
                    height: 100%;
                }
                tr, td {
                    padding: 0;
                    margin: 0;
                    border-width: 0;
                }
                .left-container {
                    float: left;
                    width: calc(60% - 30px);
                    margin-right: 30px;
                }
                .left {
                    float: left;
                }
                .left tr td{
                    max-width: calc(60% - 80px);
                }
                .red-background {
                    background-color: {{primary_color}};
                }
                .red-color {
                    color: {{primary_color}};
                }
                .contact-info {
                    word-break: break-all;
                    width: 60%;
                    height: auto;
                    padding: 10px 15px;
                    border-radius: 7px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: italic;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: left;
                    color: #ffffff;
                    padding: 10px 14px;
                    display: flex;
                    align-items: center;
                }
                .property-info-title {
                    font-size: 1.84rem;
                    font-weight: 800;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.2;
                    letter-spacing: normal;
                    text-align: left;
                }
                .bold {
                    font-weight: bold;
                }
                .content {
                    font-weight: normal;
                    font-stretch: normal;
                    font-style: normal;
                    line-height: 1.4;
                    letter-spacing: normal;
                    text-align: left;
                    font-size: 0.84rem;
                }
                .property-mark {
                    font-size: 4.5rem;
                    font-weight: 800;
                    font-stretch: normal;
                    font-style: normal;
                    letter-spacing: normal;
                    text-align: left;
                    color: #ffffff;
                    text-transform: uppercase;
                    border-radius: 9px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    width: max-content;
                    height: max-content;
                    line-height: 3.2rem;
                    position: relative;
                    left: -15px;
                }
                .right-container {
                    width: calc(40% - 30px);
                    float: right;
                }
                .right {
                    width: 100%;
                }
                .vertical-top {
                    vertical-align: top;
                }
                .vertical-bottom {
                    vertical-align: bottom;
                }
                .red-rectangle {
                    border-radius: 6px;
                    width: 100%;
                    padding-top: 100%;
                    position: relative;
                }
                .white-rectangle {
                    background-color: white;
                    border-radius: 6px;
                    position: absolute;
                    top: 15px;
                    left: 0;
                    bottom: 0;
                    right: 15px;
                    padding-right: 15px;
                }
                .inner-rectangle {
                    position: absolute;
                    top: 15px;
                    left: 0;
                    bottom: 0;
                    right: 15px;
                    border-radius: 6px;
                    background-image: url({{street_view_image}});
                    background-size: cover;
                }
                ul {
                    padding-left: 1rem;
                    margin-bottom: 0;
                    list-style: none;
                }
                li {
                    line-height: 1.5rem;
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
                </style>
            </head>
            <body>
                <div class="left-container">
                    <table class="left container">
                        <tr>
                            <td>
                                <div class="contact-info red-background">
                                    {{owner_name}}<br />
                                    {{owner_address}}<br />
                                    {{owner_city}} {{owner_state}} {{owner_zip}}<br />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="property-info-title">
                                    IMPORTANT <span class="red-color">PROPERTY INFORMATION</span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="content">
                                    <p>
                                        {{section_a}}
                                    </p>
                                    <p>
                                        {{disclosure_agreement}}
                                    </p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="property-mark red-background">
                                    property
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="right-container">
                    <table class="right container">
                        <tr>
                            <td class="vertical-top">
                                <div class="red-rectangle red-background">
                                    <div class="white-rectangle">
                                        <div class="inner-rectangle"></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td class="vertical-bottom">
                                <ul class="bold">
                                    <li>We buy As-is</li>
                                    <li>We Pay CASH</li>
                                    <li>No Commissions Paid to us</li>
                                    <li>We pay most Standard Closing Costs</li>
                                    <li>No need to do Repairs</li>
                                    <li>Close on your Schedule</li>
                                </ul>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="clear"></div>
            </body>
        </html>';
        $backHtml = '<html>
        <head>
            <meta charset="utf-8">
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
                .container {
                    height: calc(100% - 30px);
                    padding: 15px 15px;
                }
                table {
                    height: calc(100%);
                    table-layout: fixed;
                    width: 100%;
                }
                tr, td {
                    padding: 0 0;
                    margin: 0 0;
                    border-width: 0;
                }
                .vertical-top {
                    vertical-align: top;
                }
                .vertical-middle {
                    vertical-align: middle;
                }
                .vertical-bottom {
                    vertical-align: bottom;
                }
                .red-background {
                    background-color: {{primary_color}};
                }
                .red-color {
                    color: {{primary_color}};
                }
                .bold {
                    font-weight: bold;
                }
                .square {
                    width: calc(100% - 30px);
                    border-radius: 15px;
                }
                .white-square {
                    background-color: white;
                    height: 40px;
                    position: relative;
                    top: -20px;
                    z-index: 99;
                }
                .red-square {
                    height: 60px;
                    border-top-left-radius: 0px;
                    border-top-right-radius: 0px;
                    position: relative;
                    top: -60px;
                    margin-bottom: -60px;
                }
                p {
                    font-size: 0.84rem;
                    line-height: 1.3;
                }
                .footer-container {
                    width: 100%;
                }
                .contact-info {
                    height: auto;
                    padding: 10px 15px;
                    border-radius: 7px;
                    font-weight: bold;
                    font-stretch: normal;
                    font-style: italic;
                    line-height: 1.5;
                    letter-spacing: normal;
                    text-align: left;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    float: left;
                    word-break: break-all;
                }
                .sincerely {
                    width: 100%;
                    text-align: right;
                    word-break: break-all;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <table padding=0>
                    <tr>
                        <td class="vertical-top">
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
                            {{signature_sign_off}},
                        </td>
                    </tr>
                    <tr>
                        <td class="vertical-bottom">
                            <div class="contact-info red-background">
                                {{signature_name}}<br />
                                {{signature_address}}<br />
                                {{signature_city}} {{signature_state}} {{signature_zip}}<br />
                                {{signature_phone}}<br />
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
            'id'                        => 3,
            'name'                      => 'Style #3',
            'front_content'             => $frontHtml,
            'back_content'              => $backHtml,
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
        ]);
    }
}
