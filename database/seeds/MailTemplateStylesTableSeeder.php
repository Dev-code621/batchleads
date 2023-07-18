<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MailTemplateStylesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = 'https://batchdriven.com/style_images';

        DB::table('mail_template_styles')->insert([
            'id'                        => 1,
            'name'                      => 'Default1',
            'front_content'             => '
                <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            html, body {
                                padding: 0;
                                margin: 0;
                                color: white;
                                line-height: 12px;
                                font-size: 10px;
                            }
                            .left-container {
                                width: 60%;
                                height: 100%;
                                background-image: url(' . $STYLE_IMAGE_BASE_URL . '/default_background_1.jpg);
                                background-position: center center;
                                background-repeat: no-repeat;
                                background-attachment: fixed;
                                background-size: cover;
                                float: left;
                            }
                            .right-container {
                                width: 40%;
                                height: 100%;
                                float: left;
                                background-color: #408ff7;
                                position: relative;
                            }
                            .section-container {
                                position: absolute;
                                top: 50%;
                                height: 120px;
                                margin-top: -60px;
                            }
                            .section-a {
                                width: 80%;
                                text-align: center;
                                font-size: 12px;
                                text-transform: uppercase;
                                line-height: 15px;
                                margin: auto;
                                margin-bottom: 20px;
                            }
                            .section-b {
                                width: 80%;
                                text-align: center;
                                margin: auto;
                                margin-bottom: 20px;
                            }
                            .section-c {
                                width: 80%;
                                text-align: center;
                                margin: auto;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="left-container"></div>
                        <div class="right-container">
                            <div class="section-container">
                                <section class="section-a">{{section_a}}</section>
                                <section class="section-b">{{section_b}}</section>
                                <section class="section-c">(See reverse side for special offer)</section>
                            </div>
                        </div>
                    </body>
                </html>
            ',
            'back_content'              => '
                <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            html, body {
                                padding: 0;
                                margin: 0;
                                color: white;
                                line-height: 12px;
                                font-size: 10px;
                            }
                            .left-container {
                                width: 40%;
                                height: 100%;
                                background-color: #408ff7;
                                float: left;
                            }
                            .section-container {
                                top: 50%;
                                position: relative;
                                margin-top: -60px;
                            }
                            .section-c {
                                width: 80%;
                                margin: auto;
                                margin-bottom: 20px;
                            }
                            .sign-off {
                                font-size: 12px;
                                width: 80%;
                                line-height: 15px;
                                margin: auto;
                            }
                            .contact {
                                width: 80%;
                                margin: auto;
                            }
                            .right-container {
                                width: 60%;
                                height: 100%;
                                float: left;
                                color: black;
                            }
                            .address-1 {
                                width: 80%;
                                margin: auto;
                                position: relative;
                                top: 50%;
                                margin-top: -18px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="left-container">
                            <div class="section-container">
                                <div class="section-c">
                                    {{section_c}}
                                </div>
                                <div class="sign-off">
                                    {{signature_sign_off}}
                                </div>
                                <div class="contact">
                                    {{signature_name}}<br />
                                    {{signature_phone}}<br />
                                    {{signature_email}}
                                </div>
                            </div>
                        </div>
                        <div class="right-container">
                            <div class="address-1">
                                {{signature_name}}<br />
                                {{signature_address}}<br />
                                {{signature_city}}, {{signature_state}} {{signature_zip}}
                            </div>
                        </div>
                    </body>
                </html>
            ',
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_1.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_1.png',
        ]);
    }
}
