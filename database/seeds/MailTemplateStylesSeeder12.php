<?php

use Illuminate\Database\Seeder;
use App\Http\Helpers\MinifyHelper;
use Illuminate\Support\Facades\DB;

class MailTemplateStylesSeeder12 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $STYLE_IMAGE_BASE_URL = config('app.url') . '/style_images/12';
        $frontHtml = '<html>
            <head>
                <meta charset="utf-8">
                <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;400;600;900&display=swap" rel="stylesheet">
                <style>
                    html, body {
                        font-family: "Nunito Sans", sans-serif;
                        margin: 0;
                        padding: 20px 20px;
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
                        font-size: 14px;
                        line-height: 22px;
                    }
                    .main-color {
                        color: {{primary_color}};
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <table>
                        <tr>
                            <td>
                                &nbsp;
                            </td>
                            <td class="main-color" style="font-size: 16px; line-height: 30px; float: right; width: 145px;">
                                ***<br>
                                IMPORTANT PROPERTY INFORMATION<br>
                                ***<br>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{section_a}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <li>We buy "As-IS"</li>
                                    <li>We Pay CASH</li>
                                    <li>No Realtor Comssions</li>
                                </ul>
                            </td>
                            <td>
                                <li>We Pay Most Closing Costs</li>
                                <li>No need to do Repairs</li>
                                <li>Close on your Schedule</li>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{section_b}}
                                <br><br>{{section_c}}
                                <br><br>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{signature_sign_off}}
                                <br><br><br>
                                {{signature_name}}
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>';

        $frontHtml = MinifyHelper::minify_html($frontHtml);

        DB::table('mail_template_styles')->insert([
            'id'                        => 12,
            'name'                      => 'Letter #12',
            'front_content'             => $frontHtml,
            'back_content'              => '',
            'front_preview_image_url'   => $STYLE_IMAGE_BASE_URL . '/default_front_preview.png',
            'back_preview_image_url'    => $STYLE_IMAGE_BASE_URL . '/default_back_preview.png',
            'primary_color'             => '#FF0101',
            'is_post_card'              => 0
        ]);
    }
}
