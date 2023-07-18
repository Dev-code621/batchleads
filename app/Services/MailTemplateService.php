<?php

namespace App\Services;

use App\Repositories\MailTemplateRepository;


/**
 * Class MailTemplateService
 *
 * @package App\Http\Services
 */
class MailTemplateService extends BaseService
{
    protected $repository;

    /**
     * MailTemplateService constructor.
     *
     * @param MailTemplateRepository $repository
     */
    public function __construct(MailTemplateRepository $repository)
    {
        $this->repository = $repository;
    }

    public function read($id, array $relationships = array('mailTemplateSections', 'mailSignature', 'mailTemplateStyle'))
    {
        $template = $this->repository->find($id, $relationships);
        if ($template) {
            $templateSections = $template->mailTemplateSections;
            if ($templateSections) {
                $signature = $template->mailSignature;
                $style = $template->mailTemplateStyle;

                $frontHtml = $style['front_content'];
                $backHtml = $style['back_content'];

                $frontHtml = str_replace('{{section_a}}', $templateSections[0]['content'], $frontHtml);
                $frontHtml = str_replace('{{section_b}}', $templateSections[1]['content'], $frontHtml);
                $frontHtml = str_replace('{{section_c}}', $templateSections[2]['content'], $frontHtml);

                $frontHtml = str_replace('{{signature_name}}', $signature['name'], $frontHtml);
                $frontHtml = str_replace('{{signature_sign_off}}', $signature['sign_off'], $frontHtml);
                $frontHtml = str_replace('{{signature_phone}}', $signature['contact_phone'], $frontHtml);
                $frontHtml = str_replace('{{signature_email}}', $signature['contact_email'], $frontHtml);
                $frontHtml = str_replace('{{signature_website}}', $signature['contact_website'], $frontHtml);
                $frontHtml = str_replace('{{signature_address}}', $signature['address_line1'], $frontHtml);
                $frontHtml = str_replace('{{signature_city}}', $signature['address_city'], $frontHtml);
                $frontHtml = str_replace('{{signature_state}}', $signature['address_state'], $frontHtml);
                $frontHtml = str_replace('{{signature_zip}}', $signature['address_zip'], $frontHtml);

                $backHtml = str_replace('{{section_a}}', $templateSections[0]['content'], $backHtml);
                $backHtml = str_replace('{{section_b}}', $templateSections[1]['content'], $backHtml);
                $backHtml = str_replace('{{section_c}}', $templateSections[2]['content'], $backHtml);

                $backHtml = str_replace('{{signature_name}}', $signature['name'], $backHtml);
                $backHtml = str_replace('{{signature_sign_off}}', $signature['sign_off'], $backHtml);
                $backHtml = str_replace('{{signature_phone}}', $signature['contact_phone'], $backHtml);
                $backHtml = str_replace('{{signature_email}}', $signature['contact_email'], $backHtml);
                $backHtml = str_replace('{{signature_website}}', $signature['contact_website'], $backHtml);
                $backHtml = str_replace('{{signature_address}}', $signature['address_line1'], $backHtml);
                $backHtml = str_replace('{{signature_city}}', $signature['address_city'], $backHtml);
                $backHtml = str_replace('{{signature_state}}', $signature['address_state'], $backHtml);
                $backHtml = str_replace('{{signature_zip}}', $signature['address_zip'], $backHtml);

                $template['front_html'] = $frontHtml;
                $template['back_html'] = $backHtml;
            }
            return $template;
        }

        return null;
    }

    public function getTemplatesBySignatureId($signatureId)
    {
        return $this->repository->getTemplatesBySignatureId($signatureId);
    }
}
