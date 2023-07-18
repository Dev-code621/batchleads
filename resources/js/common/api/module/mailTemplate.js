import httpClient from '../httpClient'

export const getMyTemplates = ({ page, search }) => {
  return httpClient.get(`mail/campaign/template/${page}?search=${search}`)
}

export const newTemplate = ({ template }) => {
  const {
    primary_color: primaryColor,
    name,
    is_postcard: isPostcard,
    mail_template_sections: mailTemplateSections,
    mail_signature: mailSignature,
    mail_template_style: mailTemplateStyle,
  } = template

  return httpClient.post('mail/campaign/template/create', {
    name,
    primary_color: primaryColor,
    signature_id: mailSignature.id,
    section_a: mailTemplateSections[0].content,
    section_b: mailTemplateSections[1].content,
    section_c: mailTemplateSections[2].content,
    is_postcard: isPostcard,
    mail_template_style_id: mailTemplateStyle.id,
  })
}

export const updateTemplate = ({ template }) => {
  const {
    primary_color: primaryColor,
    name,
    is_postcard: isPostcard,
    mail_template_sections: mailTemplateSections,
    mail_signature: mailSignature,
    mail_template_style: mailTemplateStyle,
    id,
  } = template

  return httpClient.put(`mail/campaign/template/update/${id}`, {
    name,
    primary_color: primaryColor,
    signature_id: mailSignature.id,
    section_a: mailTemplateSections[0].content,
    section_b: mailTemplateSections[1].content,
    section_c: mailTemplateSections[2].content,
    is_postcard: isPostcard,
    mail_template_style_id: mailTemplateStyle.id,
  })
}

export const removeTemplate = ({ id }) => {
  return httpClient.delete(`mail/campaign/template/delete/${id}`)
}
