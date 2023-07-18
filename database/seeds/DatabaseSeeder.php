<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(CreditPackagesSeeder::class);
        $this->call(CreditPackagesSeeder0707::class);
        $this->call(CreditTransactionTypesSeeder::class);
        $this->call(MailTemplateStylesSeeder7::class);
        $this->call(MailTemplateStylesSeeder8::class);
        $this->call(MailTemplateStylesSeeder9::class);
        $this->call(MailTemplateStylesSeeder10::class);
        $this->call(MailTemplateStylesSeeder11::class);
        $this->call(MailTemplateStylesSeeder12::class);
        $this->call(MailTemplateStylesSeeder13::class);
        $this->call(MailTemplateStyleSectionsSeeder7::class);
        $this->call(MailTemplateStyleSectionsSeeder8::class);
        $this->call(MailTemplateStyleSectionsSeeder9::class);
        $this->call(MailTemplateStyleSectionsSeeder10::class);
        $this->call(MailTemplateStyleSectionsSeeder11::class);
        $this->call(MailTemplateStyleSectionsSeeder12::class);
        $this->call(MailTemplateStyleSectionsSeeder13::class);
        $this->call(UserSeeder::class);
    }
}
