<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\MinifyHelper;

class UpdateMailTemplateStyles200810 extends Seeder
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
                <meta charset="utf-8" />
                <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;400;600;900&display=swap" rel="stylesheet" />
                <style>
                    html,body{font-family:"Nunito Sans",sans-serif;margin:0;padding:20px 20px;color:#5F5F5F;background-color:white}.container{height:calc(100% - 30px);padding:15px 15px}table{width:100%;height:100%;font-size:14px;line-height:22px}.main-color{color:{{primary_color}}}
                </style>
            </head>
            <body>
                <div class="container">
                    <table>
                        <tr>
                            <td>&nbsp;</td>
                            <td class="main-color" style="font-size: 16px; line-height: 30px; float: right;">
                                ***<br />
                                IMPORTANT PROPERTY INFORMATION<br />
                                ***<br />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">{{section_a}}</td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <li>We buy "AS-IS"</li>
                                    <li>We Pay CASH</li>
                                    <li>No Realtor commissions</li>
                                </ul>
                            </td>
                            <td>
                                <li>We pay Most Closing Costs</li>
                                <li>No need to do Repairs</li>
                                <li>Close on your Schedule</li>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{section_b}} <br />
                                <br />
                                {{section_c}} <br />
                                <br />
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                {{signature_sign_off}} <br />
                                <br />
                                <br />
                                {{signature_name}}
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
        ';
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        DB::table('mail_template_styles')->where('id', 12)->update([
            'front_content' => $frontHtml,
        ]);
    }
}
