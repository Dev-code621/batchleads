<?php

namespace App\Console\Commands;

use App\Services\TagService;
use App\Services\TeamService;
use App\Services\UserService;
use Illuminate\Console\Command;

class AddDefaultTags extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:add_tags';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add Default Tags';

    protected $userService;
    protected $tagService;
    protected $teamService;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        UserService $userService,
        TagService $tagService,
        TeamService $teamService
    )
    {
        parent::__construct();

        $this->userService = $userService;
        $this->tagService = $tagService;
        $this->teamService = $teamService;
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $users = $this->userService->getAllUsers();
        $defaultTags = array(
            "Tall Grass",
            "Overfilled Mailbox",
            "Window A/C Unit",
            "Vacant",
            "Handicap Ramp",
            "Code Enforcement Signs",
            "Broken Windows",
            "Boarded Up Windows",
            "Broken Gutters",
            "In Bad Shape",
            "Bad Roof",
            "Missing Siding",
            "Peeling Paint",
            "Trash In Yard",
        );

        foreach ($users as $user) {
            $userId = $user['id'];
            $teamId = $this->teamService->getTeamId($user);

            if ($teamId) {
                foreach ($defaultTags as $tag) {
                    $tagCount = $this->tagService->findWhereCount(
                        array(
                            'user_id'   => $userId,
                            'team_id'   => $teamId,
                            'name'      => $tag
                        )
                    );
                    if (!$tagCount) {
                        $this->tagService->create(
                            array(
                                'user_id'   => $userId,
                                'team_id'   => $teamId,
                                'name'      => $tag
                            )
                        );
                    }
                }
            }
        }
    }
}
