import React, { useState, useEffect, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { FaArrowLeft, FaMobileAlt, FaRegTrashAlt } from 'react-icons/fa'
import { FiPlus } from 'react-icons/fi'
import { MdEmail } from 'react-icons/md'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import get from 'lodash.get'
import { GoogleMap, Marker } from '@react-google-maps/api'
import TagManager from 'react-gtm-module'
import { propertySelector } from '~redux/selectors/propertySelector'
import { actions as propertyActions } from '~redux/modules/property'
import { actions as creditActions } from '~redux/modules/credit'
import { actions as campaignActions } from '~redux/modules/smsCampaign'
import { actions as mailCampaignActions } from '~redux/modules/mailCampaign'
import { userSelector } from '~redux/selectors/userSelector';
import { folderSelector } from '~redux/selectors/folderSelector'
import { tagSelector } from '~redux/selectors/tagSelector'
import { creditSelector } from '~redux/selectors/creditSelector'
import { smsCampaignSelector } from '~redux/selectors/smsCampaignSelector'
import { mailCampaignSelector } from '~redux/selectors/mailCampaignSelector'
import { formatPhoneNumber, toast } from '~common/helper'
import { getDetails } from '~common/propertyParser'
import Form from '~common/components/Form'
import Print from '~common/components/Print'
import ContainerRow from '~common/components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import PropertyTagItem from '~components/PropertyTagItem'
import StatusFolderSelector from './layout/StatusFolderSelector'
import ImageSlider from './layout/ImageSlider'
import InfoItem from './layout/InfoItem'
import ContactModal from './layout/ContactModal'
import LandLineIcon from '~assets/icons/telephone.svg'
import { fetchZillowData } from '../../../common/api/module/property'
import FullScreenSlider from './layout/FullScreenSlider'
import PrintProperty from './layout/PrintProperty'
import MessageSelector from './layout/MessageSelector'
import './layout/style.scss'

const mapStateToProps = (state) => ({
  user: userSelector(state),
  property: propertySelector(state),
  folders: folderSelector(state),
  tags: tagSelector(state),
  credit: creditSelector(state),
  smsCampaign: smsCampaignSelector(state),
  mailCampaign: mailCampaignSelector(state),
})

const mapDispatchToProps = {
  ...propertyActions,
  ...creditActions,
  ...campaignActions,
  ...mailCampaignActions,
}

const reservedActions = {
  SMS: 'sms',
  MAIL: 'mail',
  SKIP_TRACING: 'skip_tracing',
  ADD_PHONE: 'add_phone',
  ADD_EMAIL: 'add_email',
  BACK: 'back',
};

const PropertyDetail = withRouter(({
  history,
  property,
  createProperty,
  updateProperty,
  deleteProperty,
  initProperty,
  initPropertySearch,
  getPropertyById,
  setPropertySelected,
  setAllPropertySelected,
  folders,
  tags,
  skipTracingItem,
  credit,
  endTrial,
  initEndTrial,
  smsCampaign,
  initNewCampaign,
  mailCampaign,
  initCampaign: initNewMailCampaign,
  initPropertyTag,
  updatePropertyTag,
  stopPropertyCampaigns,
  user,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showSale, setShowSale] = useState(false);
  const [showDemographics, setShowDemographics] = useState(false);
  const [status, setStatus] = useState('New')
  const [isUpdate, setIsUpdate] = useState(false);
  const [contactModal, showContactModal] = useState(false);
  const [contact, setContact] = useState({ type: 'Email', action: 'Add', data: null });
  const [folder, setFolder] = useState(null)
  const [images, setImages] = useState([])
  const [removedImageIds, setRemovedImageIds] = useState([])
  const [forceUpdate, setForceUpdate] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [errorFolder, setErrorFolder] = useState('')
  const item = get(property.selectedProperty, 'item')
  const skipTracing = get(property.selectedProperty, 'skipTracing') || {}
  const { loading, error, success } = property.selectedProperty
  const [reservedAction, setReservedAction] = useState(null);
  const endTrialSuccess = get(credit.endTrialResult, 'success')
  const [showSlider, setShowSlider] = useState(false)
  const { result: campaignResult } = smsCampaign
  const { success: campaignSuccess } = campaignResult
  const { result: mailCampaignResult } = mailCampaign
  const { success: mailCampaignSuccess } = mailCampaignResult
  const { tagResult } = property;
  const [zillowLink, setZillowLink] = useState(null);
  const [zillowFetching, setZillowFetching] = useState(false);
  const stopCampaignsResult = get(property, 'stopCampaignsResult') || {}
  const subscriptionDetails = get(user.result.user.user, 'subscription')

  const performReservedActions = () => {
    if (reservedAction === reservedActions.BACK) {
      history.goBack();
    } else if (reservedAction === reservedActions.SKIP_TRACING) {
      // eslint-disable-next-line no-use-before-define
      onClickSkipTracing()
    } else if (reservedAction === reservedActions.ADD_EMAIL) {
      // eslint-disable-next-line no-use-before-define
      onClickAddEmail()
    } else if (reservedAction === reservedActions.ADD_PHONE) {
      // eslint-disable-next-line no-use-before-define
      onClickAddPhone()
    } else if (reservedAction === reservedActions.SMS) {
      // eslint-disable-next-line no-use-before-define
      onStartSMS()
    } else if (reservedAction === reservedActions.MAIL) {
      // eslint-disable-next-line no-use-before-define
      onStartMail()
    }
    setReservedAction(null)
  }

  useEffect(() => {
    if (item.id) {
      initPropertyTag()
    }
  }, [])

  useEffect(() => {
    if (item.id) {
      getPropertyById(item.id)
    }
  }, [item.id])

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    setZillowLink(null);
    setZillowFetching(false);
  }, [item.address_hash])

  useEffect(() => {
    if (!item.id && !item.status) {
      setStatus('New')
    }
  }, [item])

  useEffect(() => {
    if (success) {
      initPropertySearch()
      if (item.id) {
        if (isUpdate) {
          initProperty()
        }
        toast.success(`Property ${isUpdate ? 'updated' : 'added'} successfully`)
        performReservedActions()
      } else {
        initProperty()
        toast.success('Property deleted successfully')
        history.push('/dashboard/properties')
      }
    }
  }, [success])

  useEffect(() => {
    if (loading) return;
    if (!item.id) {
      setImages(item.images || [])
    }
    if (!item.id && folders && folders.length > 0) {
      setFolder(folders[0])
    }
    if (item.id && folders && folders.length > 0) {
      setFolder(folders.find((fItem) => fItem.id === item.folder_id));
      setStatus(item.status)
      setImages(item.images)
    }
    setIsUpdate(!!item.id)
  }, [folders, item])

  useEffect(() => {
    if (!loading && error) {
      const statusCode = get(error, 'response.status')
      if (statusCode === 434) {
        if (confirm('You reached 250 trial properties. Do you want to end Trial and Continue?')) {
          endTrial()
        }
        return
      }
      const errMsg = get(error, 'response.data.message', 'Something wrong. Please try again later')
      toast.error(errMsg)
      initProperty()
    }
  }, [loading, error])

  useEffect(() => {
    if (endTrialSuccess) {
      const tagManagerArgs = {
        dataLayer: {
          event: 'user_subscribed',
          transactionTotal: subscriptionDetails.amount / 100,
          currencyCode: subscriptionDetails.currency,
        },
      }
      TagManager.dataLayer(tagManagerArgs)
      initEndTrial()
      // eslint-disable-next-line no-use-before-define
      save({})
    }
  }, [endTrialSuccess])

  useEffect(() => {
    if (
      skipTracing.success
      && (skipTracing.result.emails.length + skipTracing.result.phones.length) > 0
    ) {
      toast.success('Successfully fetched the contact informations')
      initProperty()
    } else if (
      skipTracing.success
      && (skipTracing.result.emails.length + skipTracing.result.phones.length) === 0
    ) {
      toast.info('Contact Information not found. Please try again later.')
      initProperty()
    }
    if (!skipTracing.loading && skipTracing.error) {
      const errMsg = get(skipTracing.error, 'response.data.message', 'Something wrong. Please try again later')
      toast.error(errMsg)
      initProperty()
    }
  }, [skipTracing])

  const [hasContacts, setHasContacts] = useState(false)
  useEffect(() => {
    if (item) {
      const { emails, phones } = item
      setHasContacts(item.id && emails && phones && (emails.length + phones.length) > 0)
    }
  }, [item])

  useEffect(() => {
    if (history.action === 'POP' && (campaignSuccess || mailCampaignSuccess)) {
      getPropertyById(item.id)
    }
  }, [history, campaignSuccess])

  const onSelectImages = (event) => {
    const { files } = event.target
    for (let i = 0; i < files.length; i += 1) {
      const file = files.item(i)
      images.push(file)
    }
    setImages(images)
    setSlideIndex(images.length - 1)
    setForceUpdate(!forceUpdate)
    if (item.id) {
      // eslint-disable-next-line camelcase
      const { location_latitude, location_longitude } = item
      updateProperty({
        id: item.id,
        status,
        folder_id: folder.id,
        location_latitude,
        location_longitude,
        images: images.filter((mItem) => !mItem.id),
      })
    }
  }

  const removeImage = () => {
    if (images[slideIndex].is_location_image || !item.id) {
      alert('Can\'t delete google street image')
      return
    }
    const confirmDelete = confirm('Are you sure to delete this image?');
    if (confirmDelete) {
      const imageId = images[slideIndex].id
      if (imageId) {
        setRemovedImageIds([...removedImageIds, imageId])
        // eslint-disable-next-line camelcase
        const { location_latitude, location_longitude } = item
        updateProperty({
          id: item.id,
          status,
          folder_id: folder.id,
          location_latitude,
          location_longitude,
          removedImageIds: [imageId],
        })
      }
      images.splice(slideIndex, 1)
      setImages(images)
      setSlideIndex(images.length - 1)
      setForceUpdate(!forceUpdate)
    }
  }

  const save = ({ newStatus, newFolder }) => {
    setErrorFolder(null)
    if (item) {
      if (!folder) {
        setErrorFolder('Need to select Folder.')
      } else {
        item.images = images.filter((mItem) => !mItem.id)
        item.status = newStatus || status
        item.folder_id = newFolder ? newFolder.id : folder.id
        if (!isUpdate) {
          createProperty(item)
        } else {
          const newItem = { ...item, removedImageIds }
          updateProperty(newItem)
        }
      }
    }
  }

  const goToActivities = () => {
    history.push('/dashboard/properties/detail/activities')
  }

  const goToZillow = () => {
    if (zillowFetching) {
      return;
    }
    if (zillowLink) {
      window.open(zillowLink, 'blank')
      return;
    }
    setZillowFetching(true);
    const address = item.Site_Address
    const citystatezip = `${item.Site_City} ${item.Site_State || item.CO_Mailing_State}`
    fetchZillowData({ address, citystatezip: citystatezip.trim() })
      .then(({ data }) => {
        const zLink = get(data, 'data.links.homedetails')
        setZillowLink(zLink);
        setZillowFetching(false);
        window.open(zLink, 'blank')
      })
      .catch(() => {
        setZillowLink(null);
        setZillowFetching(false);
        toast.error("Can't find zillow data on this property.")
      })
  }

  const onClickDelete = () => {
    // eslint-disable-next-line no-alert
    // eslint-disable-next-line no-restricted-globals
    const confirmDelete = confirm('Are you sure to delete this property?');
    if (confirmDelete) {
      deleteProperty(item.id)
    }
  }

  const onClickSkipTracing = () => {
    if (item.id) {
      if (item.skip_tracing_date) return
      skipTracingItem(item.id)
    } else {
      setReservedAction(reservedActions.SKIP_TRACING)
      save({})
    }
  }

  const onClickAddEmail = (data) => {
    if (item.id) {
      setContact({ type: 'Email', action: data ? 'Edit' : 'Add', data })
      showContactModal(true)
    } else {
      setReservedAction(reservedActions.ADD_EMAIL)
      save({})
    }
  }
  const onClickAddPhone = (data) => {
    if (item.id) {
      setContact({ type: 'Phone', action: data ? 'Edit' : 'Add', data })
      showContactModal(true)
    } else {
      setReservedAction(reservedActions.ADD_PHONE)
      save({})
    }
  }

  const onStartSMS = () => {
    initNewCampaign()
    if (item.id) {
      setAllPropertySelected(false)
      setPropertySelected(item)
      history.push('/dashboard/smsCampaign/new')
    } else {
      setAllPropertySelected(false)
      setPropertySelected(item)
      setReservedAction(reservedActions.SMS)
      save({})
    }
  }

  const onStartMail = () => {
    initNewMailCampaign()
    if (item.id) {
      setAllPropertySelected(false)
      setPropertySelected(item)
      history.push('/dashboard/mailCampaign/new')
    } else {
      setAllPropertySelected(false)
      setPropertySelected(item)
      setReservedAction(reservedActions.MAIL)
      save({})
    }
  }

  const onChangeStatus = (newStatus) => {
    setStatus(newStatus)
    if (item.id) {
      const {
        location_latitude: latitude,
        location_longitude: longitude,
        folder_id: folderId,
      } = item
      updateProperty({
        id: item.id,
        status: newStatus,
        folder_id: folderId,
        location_latitude: latitude,
        location_longitude: longitude,
      })
    } else {
      save({ newStatus })
    }
  }

  const onChangeFolder = (newFolder) => {
    setFolder(newFolder)
    if (item.id) {
      const { location_latitude: latitude, location_longitude: longitude } = item
      updateProperty({
        id: item.id,
        status: item.status,
        folder_id: newFolder.id,
        location_latitude: latitude,
        location_longitude: longitude,
      })
    } else {
      save({ newFolder })
    }
  }

  const onBack = () => {
    if (!item.id) {
      const confirmDelete = confirm('Do you want to save this property?');
      if (confirmDelete) {
        setReservedAction(reservedActions.BACK)
        save({})
      }
    } else {
      history.goBack()
    }
  }

  const onClickImage = () => {
    setShowSlider(true)
  }

  const iconClicked = (icon, value) => {
    if (icon === 'copy') {
      navigator.clipboard.writeText(value)
    }
  }

  const handleTagAction = (tagPrimaryId) => {
    if (tagResult.loading && !item.id) {
      return;
    }
    const addedTag = item.tags.find((tag) => tag.tag_id === tagPrimaryId)
    if (addedTag) {
      updatePropertyTag({ id: addedTag.id });
    } else {
      updatePropertyTag({ property_id: item.id, tag_id: tagPrimaryId });
    }
  }

  const onClickStopCampaigns = () => {
    if (item.id) {
      stopPropertyCampaigns(item.id)
    }
  }

  const onSelectMessage = (smsMasterId) => {
    history.push(`/dashboard/messages/${smsMasterId}`)
  }

  return (
    <Form className="new-property-form">
      <FormTitle title={item.address1}>
        <div
          onClick={onBack}
          onKeyPress={() => { }}
          role="button"
          tabIndex="0"
          className="back-btn"
        >
          <FaArrowLeft />
        </div>
        {!item.id && (
          <div
            onClick={save}
            className="property-action add"
          >
            <FiPlus />
          </div>
        )}
        {item.id && (
          <div
            onClick={onClickDelete}
            className="property-action delete"
          >
            <FaRegTrashAlt />
          </div>
        )}
      </FormTitle>
      <ImageSlider
        images={images}
        removeImage={removeImage}
        slideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
        onSelectImages={onSelectImages}
        onClickImage={onClickImage}
        user={user}
        isSaved={!!item.id}
      />
      <StatusFolderSelector
        status={status}
        setStatus={onChangeStatus}
        folder={folder}
        setFolder={onChangeFolder}
        errorFolder={errorFolder}
        setErrorFolder={setErrorFolder}
      />
      {
        item.id
        && (
          <MessageSelector
            propertyId={item.id}
            onSelect={(smsMaster) => onSelectMessage(smsMaster)}
          />
        )
      }
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="detail-title">Property Information</div>
          {getDetails(item).summary.map(({ label, value, icon }) => (
            <InfoItem
              key={label}
              title={label}
              value={value}
              icon={icon}
              onIconClick={iconClicked}
            />
          ))}
          <hr className="detail-separator" />
          {getDetails(item).information.map(({ label, value, icon }) => (
            <InfoItem
              key={label}
              title={label}
              value={value}
              icon={icon}
              onIconClick={iconClicked}
            />
          ))}
          {/* <hr className="detail-separator" />
          {Object.keys(additionalInfo).map((key) => (
            <InfoItem key={key} title={key} value={additionalInfo[key]} />
          ))} */}
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="contact-title-wrapper">
            <div className="detail-title">Contacts</div>
            {!skipTracing.loading && (
              <div
                className="detail-action-button"
                onClick={onClickSkipTracing}
                onKeyPress={() => { }}
                style={{ backgroundColor: item.skip_tracing_date ? 'gray' : '' }}
                role="button"
                tabIndex="0"
              >
                Skip Trace
              </div>
            )}
            {skipTracing.loading && (
              <div className="detail-action-button">
                <LoadingActivity width={10} height={10} color="white" />
              </div>
            )}
          </div>
          {item.phones && item.phones.map((phone) => (
            <InfoItem
              key={phone.id}
              className="contact"
              type="phone"
              title={phone.type === 'Mobile' ? <FaMobileAlt size={20} /> : <img src={LandLineIcon} alt="phone" />}
              value={formatPhoneNumber(phone.phone_number)}
              onClick={() => onClickAddPhone(phone)}
            />
          ))}
          {item.emails && item.emails.map((email) => (
            <InfoItem
              key={email.id}
              className="contact"
              type="email"
              title={<MdEmail size={20} />}
              value={email.email}
              onClick={() => onClickAddEmail(email)}
            />
          ))}
          {!hasContacts && <div className="no-contacts">No Contacts</div>}
          <div className="contact-title-wrapper bottom">
            <div className="detail-action-button" onClick={() => onClickAddPhone()}>
              Add Phone
            </div>
            <div className="detail-action-button" onClick={() => onClickAddEmail()}>
              Add Email
            </div>
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper campaign">
          <div className="contact-title-wrapper">
            <div className="detail-title">Campaigns</div>
            {Number(item.sms_campaign_count) + Number(item.mail_campaign_count) > 0 && (
              <Fragment>
                {!stopCampaignsResult.loading && (
                  <div
                    className="detail-action-button stop-campaign"
                    onClick={onClickStopCampaigns}
                  >
                    <div className="stop-campaign-rect" />
                    <div>Stop all</div>
                  </div>
                )}
                {stopCampaignsResult.loading && (
                  <div className="detail-action-button stop-campaign">
                    <LoadingActivity width={10} height={10} color="white" />
                  </div>
                )}
              </Fragment>
            )}
          </div>
          <InfoItem title="SMS Campaigns:" value={item.sms_campaign_count || 0} />
          <InfoItem title="Mail Campaigns:" value={item.mail_campaign_count || 0} />
          <div className="campaign-btn-wrapper">
            <div
              className="detail-action-button"
              onClick={onStartSMS}
            >
              Send SMS
            </div>
            <div
              className="detail-action-button"
              onClick={onStartMail}
            >
              Send Mail
            </div>
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="contact-title-wrapper property-detail" onClick={() => setShowTags(!showTags)}>
            <div className="detail-title">Property Tags</div>
            {showTags && <IoIosArrowUp size={24} />}
            {!showTags && <IoIosArrowDown size={24} />}
          </div>
          {showTags && item.id && (
            <div className="detail-tag-container">
              {tags.map((tag) => (
                <PropertyTagItem
                  key={tag.id}
                  selected={item.tags && !!item.tags.find((tagItem) => tagItem.tag_id === tag.id)}
                  tag={tag}
                  onClick={(tagId) => handleTagAction(tagId)}
                />
              ))}
              {tags.length === 0 && (
                <div className="tag-empty-text">No tags</div>
              )}
            </div>
          )}
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="contact-title-wrapper property-detail" onClick={() => setShowDetails(!showDetails)}>
            <div className="detail-title">Property Details</div>
            {showDetails && <IoIosArrowUp size={24} />}
            {!showDetails && <IoIosArrowDown size={24} />}
          </div>
          {showDetails && (
            <Fragment>
              {getDetails(item).details.map(({ label, value }) => (
                <InfoItem key={label} title={label} value={value} />
              ))}
              <hr className="detail-separator" />
              {getDetails(item).land.map(({ label, value }) => (
                <InfoItem key={label} title={label} value={value} />
              ))}
            </Fragment>
          )}
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="contact-title-wrapper property-detail" onClick={() => setShowAssessment(!showAssessment)}>
            <div className="detail-title">Assessment & Tax</div>
            {showAssessment && <IoIosArrowUp size={24} />}
            {!showAssessment && <IoIosArrowDown size={24} />}
          </div>
          {showAssessment && getDetails(item).assessment.map(({ label, value }) => (
            <InfoItem key={label} title={label} value={value} />
          ))}
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="contact-title-wrapper property-detail" onClick={() => setShowSale(!showSale)}>
            <div className="detail-title">Sale & Loan</div>
            {showSale && <IoIosArrowUp size={24} />}
            {!showSale && <IoIosArrowDown size={24} />}
          </div>
          {showSale && getDetails(item).sale.map(({ label, value }) => (
            <InfoItem key={label} title={label} value={value} />
          ))}
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="detail-wrapper">
          <div className="contact-title-wrapper property-detail" onClick={() => setShowDemographics(!showDemographics)}>
            <div className="detail-title">Demographics</div>
            {showDemographics && <IoIosArrowUp size={24} />}
            {!showDemographics && <IoIosArrowDown size={24} />}
          </div>
          {showDemographics && getDetails(item).demographics.map(({ label, value }) => (
            <InfoItem key={label} title={label} value={value} />
          ))}
        </div>
      </ContainerRow>
      <ContainerRow className="property-options">
        <div className="detail-wrapper" onClick={goToActivities}>Activity & Notes</div>
        <div className="detail-wrapper" onClick={goToZillow}>
          {zillowFetching && <LoadingActivity width={10} height={10} color="gray" />}
          {!zillowFetching && <div>Zillow</div>}
        </div>
        <Print buttonClass="detail-wrapper" title="Property" printId="printProperty">
          <PrintProperty
            id="printProperty"
            property={item}
            images={images}
            tags={tags}
          />
        </Print>
      </ContainerRow>
      <div className="location-title">Property Location</div>
      {item.location_latitude && item.location_longitude && (
        <ContainerRow className="property-map-container">
          <GoogleMap
            id="property-map"
            zoom={16}
            center={{
              lat: parseFloat(item.location_latitude),
              lng: parseFloat(item.location_longitude),
            }}
            mapContainerStyle={{
              height: '100%',
              width: '100%',
            }}
            options={{
              disableDefaultUI: false,
            }}
          >
            <Marker
              position={{
                lat: parseFloat(item.location_latitude),
                lng: parseFloat(item.location_longitude),
              }}
            />
          </GoogleMap>
        </ContainerRow>
      )}
      <ContactModal
        toggle={contactModal}
        contact={contact}
        onClose={() => showContactModal(false)}
      />
      <FullScreenSlider
        images={images}
        slideIndex={slideIndex}
        showSlider={showSlider}
        onClose={() => setShowSlider(false)}
      />
    </Form>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetail)
