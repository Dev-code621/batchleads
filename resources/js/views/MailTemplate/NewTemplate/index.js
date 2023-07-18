import React, { useState, useEffect } from 'react'
import cloneDeep from 'lodash.clonedeep'
import get from 'lodash.get'
import { FiEye } from 'react-icons/fi'
import Frame from 'react-frame-component'
import { toast } from '~common/helper'
import LoadingActivity from '~components/LoadingActivity'
import Button from '~components/Button'
import Input from '~components/Input'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ContainerRow from '~common/components/ContainerRow'
import ErrorMessage from '~common/components/ErrorMessage'
import BaseModal from '~components/BaseModal'
import TemplateTypeSelector from './layout/TemplateTypeSelector'
import TemplateStyleSelector from './layout/TemplateStyleSelector'
import PrimaryColorPicker from './layout/PrimaryColorPicker'
import SignatureSelector from './layout/SignatureSelector'
import './layout/style.scss'
import SectionEditor from './layout/SectionEditor'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'

export default (props) => {
  const {
    history,
    mailTemplate,
    editTemplate,
    getTemplates,
    setTemplate,
    createTemplate,
    updateTemplate,
    removeTemplate,
  } = props

  let selectedTemplate = null
  const { state } = history.location
  if (state) {
    selectedTemplate = cloneDeep(state.template)
  }

  const { template } = mailTemplate

  const {
    name,
    is_postcard: isPostCard,
    mail_template_style: mailTemplateStyle,
    mail_signature: mailSignature,
    mail_template_sections: mailTemplateSections,
    primary_color: primaryColor,
  } = template
  const mailTemplateStyleSections = mailTemplateStyle && get(mailTemplateStyle, 'mail_template_style_sections')
  const { loading, error, success } = template

  const [errorName, setErrorName] = useState('')
  const [errorStyle, setErrorStyle] = useState('')
  const [errorSectionA, setErrorSectionA] = useState('')
  const [errorSectionB, setErrorSectionB] = useState('')
  const [errorSectionC, setErrorSectionC] = useState('')
  const [errorSignature, setErrorSignature] = useState('')
  const [errorPrimaryColor, setErrorPrimaryColor] = useState('')
  const [isRemove, setIsRemove] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [frontPreviewContent, setFrontPreviewContent] = useState('')
  const [backPreviewContent, setBackPreviewContent] = useState('')
  const [postCard, setPostCard] = useState(isPostCard);

  if (error) {
    if (isRemove && error.status === 422) {
      alert(error.message)
    }
  }

  useEffect(() => {
    if (success) {
      if (selectedTemplate) {
        if (isRemove) {
          // initTemplates()
          getTemplates(1, '')
          toast.success('Template Removed')
        } else {
          toast.success('Template Updated')
        }
      } else {
        // initTemplates()
        getTemplates(1, '')
        toast.success('Template Added')
      }
      history.goBack()
    }
  }, [success])

  useEffect(() => {
    if (selectedTemplate) {
      setTemplate(selectedTemplate.toJS())
    }
  }, [])

  const onChangeName = (event) => {
    editTemplate({ name: event.target.value })
  }

  const onChangeTemplateType = (type) => {
    setPostCard(type);
    editTemplate({ is_postcard: type ? 1 : 0 })
  }

  const onEditSection = (content, index) => {
    mailTemplateSections[index].content = content
    editTemplate({ mail_template_sections: mailTemplateSections })
  }

  const onEditTemplateStyle = (item) => {
    if (item) {
      const style = item.toJS()
      const mailTemplateStyleSections_ = style.mail_template_style_sections
      mailTemplateSections[0].content = mailTemplateStyleSections_ && mailTemplateStyleSections_.length === 3 ? mailTemplateStyleSections_[0].content : ''
      mailTemplateSections[1].content = mailTemplateStyleSections_ && mailTemplateStyleSections_.length === 3 ? mailTemplateStyleSections_[1].content : ''
      mailTemplateSections[2].content = mailTemplateStyleSections_ && mailTemplateStyleSections_.length === 3 ? mailTemplateStyleSections_[2].content : ''

      editTemplate({
        primary_color: style.primary_color,
        mail_template_style: item,
        mail_template_sections: mailTemplateSections,
        is_postcard: postCard,
      })
    } else if (mailTemplateStyle) {
      editTemplate({
        mail_template_style: null,
        mail_template_sections: mailTemplateSections.map((section) => ({ ...section, content: '' })),
      })
    }
  }

  const getSectionError = (index) => {
    if (index === 0) {
      return errorSectionA
    } if (index === 1) {
      return errorSectionB
    } if (index === 2) {
      return errorSectionC
    }
    return null
  }

  const createNewTemplate = () => {
    setIsRemove(false)
    setErrorName('')
    setErrorStyle('')
    setErrorSignature('')
    setErrorSectionA('')
    setErrorSectionB('')
    setErrorSectionC('')
    setErrorSignature('')
    setErrorPrimaryColor('')

    let validated = true
    if (!name) {
      validated = false
      setErrorName('*Name Field is required.')
    }
    if (!mailSignature) {
      validated = false
      setErrorSignature('*Need to select Signature')
    }
    if (!mailTemplateStyle) {
      validated = false
      setErrorStyle('*Need to select Style')
    }
    if (!mailTemplateSections[0].content) {
      validated = false
      setErrorSectionA('Required')
    }
    if (!mailTemplateSections[1].content) {
      validated = false
      setErrorSectionB('Required')
    }
    if (!mailTemplateSections[2].content) {
      validated = false
      setErrorSectionC('Required')
    }
    if (!primaryColor) {
      validated = false
      setErrorPrimaryColor('Required')
    }

    if (validated) {
      if (selectedTemplate) {
        updateTemplate(template)
      } else {
        createTemplate(template)
      }
    }
  }

  const remove = () => {
    // eslint-disable-next-line no-alert
    if (confirm('Are you sure?')) {
      setIsRemove(true)
      removeTemplate(selectedTemplate.get('id'))
    }
  }

  // eslint-disable-next-line no-unused-vars
  const popupCenter = ({
    html, title,
  }) => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY

    let width = 0
    let height = 0
    if (window.innerWidth) {
      width = window.innerWidth
    } else if (document.documentElement.clientWidth) {
      width = document.documentElement.clientWidth
    } else {
      ({ width } = window.screen)
    }
    if (window.innerHeight) {
      height = window.innerHeight
    } else if (document.documentElement.clientHeight) {
      height = document.documentElement.clientHeight
    } else {
      ({ height } = window.screen)
    }

    const w = width * 0.3
    const h = width * 0.2

    const systemZoom = width / window.screen.availWidth
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open('', title,
      `
      scrollbars=yes,
      width=${w / systemZoom},
      height=${h / systemZoom},
      top=${top},
      left=${left}
      `)

    newWindow.document.body.innerHTML = html

    if (window.focus) {
      newWindow.focus()
    }
  }

  const preview = () => {
    if (mailTemplateStyle) {
      let frontContent = mailTemplateStyle.front_content
      frontContent = frontContent.replace(/{{section_a}}/g, mailTemplateSections[0].content)
      frontContent = frontContent.replace(/{{section_b}}/g, mailTemplateSections[1].content)
      frontContent = frontContent.replace(/{{section_c}}/g, mailTemplateSections[2].content)
      if (mailSignature) {
        frontContent = frontContent.replace(/{{signature_name}}/g, mailSignature.name)
        frontContent = frontContent.replace(/{{signature_sign_off}}/g, mailSignature.sign_off)
        frontContent = frontContent.replace(/{{signature_phone}}/g, mailSignature.contact_phone)
        frontContent = frontContent.replace(/{{signature_email}}/g, mailSignature.contact_email)
        frontContent = frontContent.replace(/{{signature_website}}/g, mailSignature.contact_website)
        frontContent = frontContent.replace(/{{signature_address}}/g, mailSignature.address_line1)
        frontContent = frontContent.replace(/{{signature_city}}/g, mailSignature.address_city)
        frontContent = frontContent.replace(/{{signature_state}}/g, mailSignature.address_state)
        frontContent = frontContent.replace(/{{signature_zip}}/g, mailSignature.address_zip)
        frontContent = frontContent.replace(/{{disclosure_agreement}}/g, mailSignature.disclosure_agreement)
      }
      frontContent = frontContent.replace(/{{primary_color}}/g, primaryColor)
      frontContent = frontContent.replace(/{{street_view_image}}/g, `${__CONFIG__.APP_URL}/style_images/3/default_background_3.jpg`)

      let backContent = mailTemplateStyle.back_content
      backContent = backContent.replace(/{{section_a}}/g, mailTemplateSections[0].content)
      backContent = backContent.replace(/{{section_b}}/g, mailTemplateSections[1].content)
      backContent = backContent.replace(/{{section_c}}/g, mailTemplateSections[2].content)
      backContent = backContent.replace(/{{street_view_image}}/g, `${__CONFIG__.APP_URL}/style_images/3/default_background_3.jpg`)
      if (mailSignature) {
        backContent = backContent.replace(/{{signature_name}}/g, mailSignature.name)
        backContent = backContent.replace(/{{signature_sign_off}}/g, mailSignature.sign_off)
        backContent = backContent.replace(/{{signature_phone}}/g, mailSignature.contact_phone)
        backContent = backContent.replace(/{{signature_email}}/g, mailSignature.contact_email)
        backContent = backContent.replace(/{{signature_website}}/g, mailSignature.contact_website)
        backContent = backContent.replace(/{{signature_address}}/g, mailSignature.address_line1)
        backContent = backContent.replace(/{{signature_city}}/g, mailSignature.address_city)
        backContent = backContent.replace(/{{signature_state}}/g, mailSignature.address_state)
        backContent = backContent.replace(/{{signature_zip}}/g, mailSignature.address_zip)
        backContent = backContent.replace(/{{disclosure_agreement}}/g, mailSignature.disclosure_agreement)
      }
      backContent = backContent.replace(/{{primary_color}}/g, primaryColor)
      setFrontPreviewContent(frontContent)
      setBackPreviewContent(backContent)
      setShowPreview(true)
    }
  }

  const closePreviewModal = () => {
    setShowPreview(false)
  }

  return (
    <Form className="new-template-form">
      <FormTitle
        title={selectedTemplate ? 'Edit Mail Template' : 'New Mail Template'}
        hasBack
        history={history}
        hasRemove={selectedTemplate && !selectedTemplate.get('mail_campaign_count')}
        onRemove={remove}
      >
        {
          mailTemplateStyle && (
            <FiEye
              className="eye-icon"
              onClick={preview}
              size={18}
            />
          )
        }
      </FormTitle>
      <ScrollContainer>
        <ContainerRow>
          <Input
            type="text"
            label="Template Name"
            value={name}
            onChange={onChangeName}
            placeholder="Template Name"
            error={
              errorName
              || (error && error.error && error.error.name)
            }
            noIcon
            fontSize={14}
            className="input-field"
          />
        </ContainerRow>
        <ContainerRow>
          <TemplateTypeSelector
            onSelect={onChangeTemplateType}
            isPostCard={isPostCard}
          />
        </ContainerRow>
        <ContainerRow title="Style">
          <TemplateStyleSelector
            selectedStyle={mailTemplateStyle}
            isPostCard={postCard}
            onSelect={(item) => {
              onEditTemplateStyle(item)
            }}
          />
          <ErrorMessage message={errorStyle} />
        </ContainerRow>
        {
          mailTemplateSections
          && mailTemplateSections.map((section, index) => {
            const sectionError = getSectionError(index)
            return (
              <ContainerRow>
                <SectionEditor
                  key={section.id}
                  index={index}
                  name={section.name}
                  content={section.content}
                  error={sectionError}
                  limit={mailTemplateStyleSections && mailTemplateStyleSections[index].limit}
                  onEdit={(content) => onEditSection(content, index)}
                />
              </ContainerRow>

            )
          })
        }
        <ContainerRow title="Primary Color">
          <PrimaryColorPicker
            color={primaryColor}
            onSelectColor={(color) => editTemplate({ primary_color: color.hex })}
          />
          <ErrorMessage message={errorPrimaryColor} />
        </ContainerRow>
        <ContainerRow title="Signature">
          <SignatureSelector
            selectedSignature={mailSignature}
            onSelect={(item) => editTemplate({ mail_signature: item })}
          />
          <ErrorMessage message={errorSignature} />
        </ContainerRow>
        <ContainerRow>
          <ErrorMessage message={error && `*${error.message}`} />
        </ContainerRow>
        {loading && (
          <ContainerRow>
            <LoadingActivity />
          </ContainerRow>
        )}
      </ScrollContainer>
      {!loading && (
        <ContainerRow>
          <Button
            label={selectedTemplate ? 'SAVE' : 'CREATE A NEW TEMPLATE'}
            height="40px"
            width="70%"
            style={{
              backgroundColor: '#3683bc',
              fontSize: '13px',
              borderRadius: '24px',
            }}
            onClick={createNewTemplate}
          />
        </ContainerRow>
      )}
      <BaseModal toggle={showPreview} onClose={closePreviewModal} transparent>
        <div>
          <div className="mail-template-preview-section">
            <Frame
              className={`preview-container ${!isPostCard && 'letter-preview-container'}`}
              initialContent="<!DOCTYPE html><html><head><style>.frame-content {height:100%}.frame-div{height:100%}</style></head><body><div class='frame-div'></div></body></html>"
            >
              <div dangerouslySetInnerHTML={{ __html: frontPreviewContent }} style={{ height: 'calc(100vh)' }} />
            </Frame>
          </div>
          {
            isPostCard ? (
              <div className="mail-template-preview-section">
                <Frame
                  className="preview-container"
                  initialContent="<!DOCTYPE html><html><head><style>.frame-content {height:100%}.frame-div{height:100%}</style></head><body><div class='frame-div'></div></body></html>"
                >
                  <div dangerouslySetInnerHTML={{ __html: backPreviewContent }} style={{ height: 'calc(100vh)' }} />
                </Frame>
              </div>
            ) : null
          }
        </div>
      </BaseModal>
    </Form>
  )
}
