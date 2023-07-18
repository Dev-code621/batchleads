<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class UpdateMailTemplateStyles200811 extends Seeder
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
                    .main-bg {
                        background-color: {{primary_color}};
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
                            <td class="main-bg" style="color: white; font-size: 24px; line-height: 40px; float: right; width: 120px; height: 150px; text-align: center; vertical-align: middle;">
                                SPECIAL<br>
                                OFFER
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{section_a}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div class="main-color" style="text-align: center; font-weight: bold;">Here is my commitment to you:</div>
                                <ul>
                                    <li>
                                        You will NOT be required to make any repairs - I will buy your property in “as-is” condition.
                                    </li>
                                    <li>
                                        You will NOT have to pay any realtor fees, points, or closing fees. I will make it simple, fast, and easy for you to turn your property into cash.
                                    </li>
                                    <li>
                                        The closing and move out date will be on YOUR schedule.
                                    </li>
                                    <li>
                                        I will buy your house for ANY reason: Divorce, Bad Tenants, Fire Damage, Excessive Repairs, Facing Foreclosure or just need to settle an estate.
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{section_b}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{signature_sign_off}}
                                <br><br><br>
                                {{signature_name}}
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="font-size: 10px; line-height: 10px;">
                                {{section_c}}
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        DB::table('mail_template_styles')->where('id', 13)->update([
            'front_content' => $frontHtml,
        ]);
    }
}
