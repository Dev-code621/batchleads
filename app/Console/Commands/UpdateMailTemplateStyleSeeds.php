<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\MailTemplateStyleService;
use App\Http\Helpers\MinifyHelper;

class UpdateMailTemplateStyleSeeds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'template:styles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Mail Template Styles';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(MailTemplateStyleService $mailTemplateStyleService)
    {
        parent::__construct();
        $this->mailTemplateStyleService = $mailTemplateStyleService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
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
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $this->mailTemplateStyleService->update(3, array(
            'front_content'             => $frontHtml,
        ));

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
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $this->mailTemplateStyleService->update(4, array(
            'front_content'             => $frontHtml,
        ));

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
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $this->mailTemplateStyleService->update(5, array(
            'front_content'             => $frontHtml,
        ));

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
        $frontHtml = MinifyHelper::minify_html($frontHtml);
        $this->mailTemplateStyleService->update(6, array(
            'front_content'             => $frontHtml,
        ));
    }
}
