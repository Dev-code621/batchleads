<?php

namespace App\Services;

use App\Repositories\FolderRepository;


/**
 * Class FolderService
 *
 * @package App\Http\Services
 */
class FolderService extends BaseService
{
    /**
     * FolderService constructor.
     *
     * @param FolderRepository     $folderRepository
     */
    public function __construct(FolderRepository $folderRepository)
    {
        $this->repository = $folderRepository;
    }
}
