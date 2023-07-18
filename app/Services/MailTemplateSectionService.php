<?php

namespace App\Services;

use App\Repositories\MailTemplateSectionRepository;


/**
 * Class MailTemplateSectionService
 *
 * @package App\Http\Services
 */
class MailTemplateSectionService extends BaseService
{
    protected $repository;

    /**
     * MailTemplateSectionService constructor.
     *
     * @param MailTemplateSectionRepository $repository
     */
    public function __construct(MailTemplateSectionRepository $repository)
    {
        $this->repository = $repository;
    }

    public function removeAllByTemplateId($templateId)
    {
        $this->repository->removeAllByTemplateId($templateId);
    }
}
