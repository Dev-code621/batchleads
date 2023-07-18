<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\TagService;
use App\Models\User;

class ResetTags extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reset:tags';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove non-owner user tags';
    protected $userService;
    protected $tagService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        TagService $tagService
    )
    {
        parent::__construct();
        $this->tagService = $tagService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = User::where('role', '!=', 'owner')->get();
        foreach ($users as $user) {
            $this->tagService->findAndDelete(
                array (
                    'user_id' => $user['id']
                )
            );
        }
    }
}
