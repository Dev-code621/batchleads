<?php

namespace App\Services;

use App\Repositories\MailTemplateStyleRepository;


/**
 * Class MailTemplateStyleService
 *
 * @package App\Http\Services
 */
class MailTemplateStyleService extends BaseService
{
    protected $repository;

    /**
     * MailTemplateStyleService constructor.
     *
     * @param MailTemplateStyleRepository $repository
     */
    public function __construct(MailTemplateStyleRepository $repository)
    {
        $this->repository = $repository;
    }
}
