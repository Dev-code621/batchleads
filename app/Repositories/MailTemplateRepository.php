<?php
namespace App\Repositories;

use App\Models\MailTemplate;

/**
 * Class MailTemplateRepository
 *
 * @package App\Http\Repositories
 */
class MailTemplateRepository extends BaseRepository
{
    /**
     * MailTemplateRepository constructor.
     *
     * @param MailTemplate $model
     */
    public function __construct(MailTemplate $model)
    {
        $this->model = $model;
    }

    /**
     * @param array $data
     *
     * @return MailTemplate|null
     */
    public function create(array $data): ?MailTemplate
    {
        $model = $this->model->newInstance();
        $model->user_id = $data['user_id'] ?? null;
        $model->team_id = $data['team_id'] ?? null;
        $model->name = $data['name'] ?? null;
        $model->primary_color = $data['primary_color'] ?? null;
        $model->signature_id = $data['signature_id'] ?? null;
        $model->mail_template_style_id = $data['mail_template_style_id'] ?? null;
        $model->is_postcard = $data['is_postcard'];

        return $model->save() ? $model : null;
    }

    /**
     * @param array $params
     *
     * @return array
     */
    public function search(array $params)
    {
        $orderBy = $params['orderBy'] ?? 'created_at';
        $order = $params['order'] ?? 'desc';
        $perPage = $params['per_page'] ?? 10;
        $search = $params['search'] ?? '';
        $userId = $params['userId'] ?? null;
        $teamId = $params['team_id'] ?? null;
        $page = $params['page'] ?? null;

        $data = MailTemplate::with('mailSignature');
        $data = $data->with('mailTemplateSections');
        $data = $data->with('mailTemplateStyle');
        if ($userId) {
            $data = $data->where('user_id', $userId);
        }
        if ($teamId) {
            $data = $data->where('team_id', $teamId);
        }
        if ($search) {
            $data = $data->whereRaw('lower(name) like (?)', '%' . strtolower($search) . '%');
        }

        $total = $data->count();
        $templates = $data->orderBy($orderBy, $order)
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        $result = [];
        foreach ($templates as $template) {
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
            $result[] = $template;
        }

        $result = array(
            'total'          => $total,
            'page'           => $page,
            'count_per_page' => $perPage,
            'count'          => $templates->count(),
            'data'           => $result,
        );

        return $result;
    }

    public function getTemplatesBySignatureId($signatureId)
    {
        return $this->model->where('signature_id', $signatureId)->get();
    }
}
