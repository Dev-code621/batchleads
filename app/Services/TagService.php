<?php

namespace App\Services;

use App\Repositories\TagRepository;


/**
 * Class TagService
 *
 * @package App\Http\Services
 */
class TagService extends BaseService
{
    protected $repository;

    /**
     * TagService constructor.
     *
     * @param repository
     */
    public function __construct(TagRepository $repository)
    {
        $this->repository = $repository;
    }
}
