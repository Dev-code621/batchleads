import React, { Fragment } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api'
import { FaMobileAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import ContainerRow from '~common/components/ContainerRow'
import { getDetails } from '~common/propertyParser'
import { formatPhoneNumber, formatDateString } from '~common/helper'
import LandLineIcon from '~assets/icons/telephoneBlack.svg'
import InfoItem from '../InfoItem'
import './style.scss'

export default ({
  property,
  images,
}) => {
  return (
    <div className="property-print">
      <style>
        { `
          .property-print {
            color: #454545;
            font-family: Barlow;
            font-style: normal;
            width: 100%;
            top: 0px;
            padding: 10px;
            background-color: white;
            padding: 20px;
            display: block;
          }
          .property-print .content-row {
            margin-bottom: 10px;
            margin-top: 10px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            .content-title {
            width: 100%;
            font-size: rem(12);
            font-weight: 600;
            line-height: 1.17;
            color: $gray-color;
            margin-bottom: rem(10);
            }
          }
          .property-print .left {
            float: left;
            width: 47%;
            display: inline-block;
          }
          .property-print .right {
            float: right;
            width: 50%;
            display: inline-block;
          }
          .property-print .page-break {
            break-after: always;
          }
          .property-print .header {
            font-size: 18px;
            width: 100%;
            height: 25px;
            padding: 10px 20px 10px 0px;
          }
          .property-print .header .title {
            font-weight: bold;
          }
          .property-print .header .right {
            text-align: right;
          }
          .property-print .detail-title {
            font-weight: 600;
            font-size: 18px;
            line-height: 28px;
            padding-bottom: 15px;
          }
          .property-print .property-info-wrapper {
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: flex-start;
            font-size: 13px;
            line-height: 18px;
          }
          .property-print .property-info-wrapper.contact {
            align-items: left;
          }
          .property-print .property-info-wrapper .title-label {
            width: 38%;
            text-align: right;
          }
          .property-print .property-info-wrapper .title-label.contact {
            width: 20%;
            text-align: left;
            font-weight: 600;
          }
          .property-print .property-info-wrapper .title-label.contact svg {
            margin-top: 3px;
            height: 10px;
          }
          .property-print .property-info-wrapper .title-label.contact img {
            margin-top: 5px;
            height: 10px;
          }
          .property-print .property-info-wrapper .value-label {
            margin-left: 15px;
            max-width: 52%;
            font-weight: bold;
          }
          .property-print .property-info-wrapper .value-label.contact {
            width: 90%;
            font-weight: normal;
          }
          .property-print .details {
            min-width: 100%;
            display: block;
            min-height: 100%;
            padding: 10px 0px;
          }
          .property-print .details .detail-wrapper {
            display: flexbox;
            min-height: 100%;
          }
          .property-print .details .property-image {
            min-height: 200px;
            width: auto;
          }
          .property-print .details .property-image img {
            max-height: 200px;
            border-radius: 10px;
          }
          .property-print .details .property-map-container {
            height: 200px;
            overflow: hidden;
            width: 100%;
            margin-left: -18px;
            border-radius: 10px;
            padding-top: 20px;
          }
          .property-print .owner {
            font-size: 12px;
            line-height: 14px;
            width: 100%;
            display: block;
            padding: 10px 0px;
          }
          .property-print .owner .left {
            display: inline-block;
            text-align: left;
          }
          .property-print .owner .left .ownership {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
          }
          .property-print .owner .left .ownership .property-info-wrapper {
            display: block;
            width: 50%;
            min-width: 50%;
            padding-bottom: 10px;
          }
          .property-print .owner .left .ownership .property-info-wrapper .title-label {
            text-align: left;
            width: 100%;
            font-weight: bold;
            max-width: unset;
          }
          .property-print .owner .left .ownership .property-info-wrapper .value-label {
            margin-left: unset;
            font-weight: normal;
            width: 100%;
            max-width: unset;
            text-transform: uppercase;
          }
          .property-print .owner .right {
            border-left: 1px solid black;
            padding-left: 10px;
            display: inline-block;
          }
          .property-print .block {
            width: 100%;
            display: block;
            text-align: left;
            padding-top: 10px;
            font-size: 12px;
            line-height: 14px;
            display: block;
          }
          .property-print .block .property-info-wrapper {
            display: inline-block;
            padding-bottom: 10px;
          }
          .property-print .block .property-info-wrapper .title-label {
            text-align: left;
            font-weight: bold;
            max-width: unset;
          }
          .property-print .block .property-info-wrapper .value-label {
            margin-left: unset;
            max-width: unset;
            font-weight: normal;
          }
          .property-print .block .details {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
          }
          .property-print .block .details .property-info-wrapper {
            display: block;
            width: 25%;
            min-width: 25%;
            padding-bottom: 10px;
          }
          .property-print .block .details .property-info-wrapper .title-label {
            text-align: left;
            width: 100%;
            font-weight: bold;
            max-width: unset;
          }
          .property-print .block .details .property-info-wrapper .value-label {
            margin-left: unset;
            font-weight: normal;
            width: 100%;
            max-width: unset;
          }
          .property-print .campaign {
            width: 100%;
            display: block;
          }
          .property-print .campaign .total-campaign {
            display: flex;
          }
          .property-print .campaign .total-campaign div {
            margin-right: 15px;
          }
          .property-print .campaign .total-campaign .total {
            font-size: 30px;
            line-height: 107%;
          }
          .property-print .campaign .total-campaign .campaign-list {
            display: block;
            font-weight: normal;
          }
          .property-print .campaign .tags {
            display: flex;
            border-left: 1px solid black;
            padding-left: 15px;
            margin-left: -15px;
          }
          .property-print .campaign .tags div {
            margin-right: 15px;
          }
          .property-print .campaign .tags .total {
            font-size: 30px;
            line-height: 107%;
          }
          .property-print .campaign .tags .tag-list {
            display: block;
            font-weight: normal;
          }
          .property-print .tax .details .property-info-wrapper {
            width: 33%;
            min-width: 33%;
          }
          .property-print .additional,
          .property-print .additional .right .note-list .item {
            width: 100%;
            display: block;
          }
          .property-print .additional .notes {
            border-left: 1px solid black;
            padding-left: 15px;
            margin-left: -15px;
          }
          .property-print .additional .left .list,
          .property-print .additional .right .note-list {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
          }
          .property-print .mortgage {
            width: 100%;
            font-weight: 600;
            font-size: 12px;
            line-height: 14px;
            display: block;
          }
          .property-print .mortgage table {
            width: 100%;
            font-size: 10px;
            line-height: 12px;
          }
          .property-print .mortgage table th {
            border-bottom: 1px solid #454545;
            font-weight: normal;
            padding-bottom: 8px;
            text-align: left;
          }
          .property-print .mortgage table td {
            padding: 15px 5px;
          }
          .property-print .mortgage table td .bold {
            font-weight: bold;
          }
          .property-print .mortgage table td span {
            font-weight: normal;
            display: block;
          }
          .property-print .mortgage div {
            padding-top: 10px;
          }
          .property-print .mortgage .value {
            font-weight: bold;
            font-size: 20px;
            line-height: 20px;
            margin-left: 15px;
          }
          .property-print .transactions {
            width: 100%;
          }`
        }
      </style>
      <ContainerRow>
        <div className="header">
          <div className="title left">Property Details</div>
          <div className="right">{property.address2 || property.address1}</div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="details">
          <div className="left">
            <div className="property-image">
              {Array.isArray(images) && images.length > 0 && (
                <Fragment>
                  {images[0].url && (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <img
                      src={images[0].url}
                      alt="property"
                      key={images[0].id}
                    />
                  )}
                  {images[0] && !images[0].url && (
                    <div>
                      <img
                        src={URL.createObjectURL(images[0])}
                        alt="property"
                        key={URL.createObjectURL}
                      />
                    </div>
                  )}
                </Fragment>
              )}
            </div>
            <div className="property-map-container">
              <GoogleMap
                id="property-map"
                zoom={16}
                center={{
                  lat: parseFloat(property.location_latitude),
                  lng: parseFloat(property.location_longitude),
                }}
                mapContainerStyle={{
                  height: '200px',
                  width: '100%',
                }}
                options={{
                  disableDefaultUI: true,
                }}
              >
                <Marker
                  position={{
                    lat: parseFloat(property.location_latitude),
                    lng: parseFloat(property.location_longitude),
                  }}
                />
              </GoogleMap>
            </div>
          </div>
          <div className="detail-wrapper right">
            {getDetails(property).printDetails.map(({ label, value }) => (
              <InfoItem
                key={label}
                title={label}
                value={value}
              />
            ))}
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="owner">
          <hr className="detail-separator" />
          <div className="  left">
            <div className="detail-title">Ownership Information</div>
            <div className="ownership">
              {getDetails(property).printOwnership.map(({ label, value }) => (
                <InfoItem
                  key={label}
                  title={label}
                  value={value}
                />
              ))}
            </div>
          </div>
          <div className="contact-title-wrapper right">
            <div className="detail-title">Contact Information</div>
            {property.phones && property.phones.map((phone, index) => (
              <InfoItem
                key={phone.id}
                className="contact"
                type="phone"
                title={phone.type === 'Mobile'
                  ? (
                    <span>
                      <FaMobileAlt size={10} />
                      &nbsp;&nbsp;Phone
                      {index + 1}
                    </span>
                  )
                  : (
                    <span>
                      <img src={LandLineIcon} alt="phone" />
                      &nbsp;&nbsp;Phone
                      {index + 1}
                    </span>
                  )}
                value={formatPhoneNumber(phone.phone_number)}
              />
            ))}
            {property.emails && property.emails.map((email, index) => (
              <InfoItem
                key={email.id}
                className="contact"
                type="email"
                title={(
                  <span>
                    <MdEmail size={10} />
                    &nbsp;&nbsp;Email
                    {index + 1}
                  </span>
                )}
                value={email.email}
              />
            ))}
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="block page-break">
          <hr className="detail-separator" />
          <div className="detail-title">Property Characteristics</div>
          <div className="details">
            {getDetails(property).printCharacteristics.map(({ label, value }) => (
              <InfoItem
                key={label}
                title={label}
                value={value}
              />
            ))}
          </div>
          <hr className="detail-separator" />
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="block">
          <div className="detail-title">Land Information</div>
          <InfoItem
            key="legal"
            title="Legal Description"
            value={property.Legal_Description}
          />
          <div className="details">
            {getDetails(property).printLand.map(({ label, value }) => (
              <InfoItem
                key={label}
                title={label}
                value={value}
              />
            ))}
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="campaign">
          <hr className="detail-separator" />
          <div className="total-campaign left">
            <div className="detail-title">Campaigns</div>
            <div className="total">{property.sms_campaign_count + property.mail_campaign_count }</div>
            <div className="campaign-list">
              {property && property.sms_campaigns && property.sms_campaigns.map(({ title }) => (
                <div key={title}>{title}</div>
              ))}
              {property && property.mail_campaigns && property.mail_campaigns.map(({ title }) => (
                <div key={title}>{title}</div>
              ))}
            </div>
          </div>
          <div className="tags right">
            <div className="detail-title">Tags</div>
            <div className="total">{property.tags ? property.tags.length : 0 }</div>
            <div className="tag-list">
              {property && property.tags && property.tags.map(({ title }) => (
                <div key={title}>{title}</div>
              ))}
            </div>
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="block tax">
          <hr className="detail-separator" />
          <div className="detail-title">Assessment & Tax</div>
          <div className="details">
            {getDetails(property).printTax.map(({ label, value }) => (
              <InfoItem
                key={label}
                title={label}
                value={value}
              />
            ))}
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="additional">
          <hr className="detail-separator" />
          <div className="  left">
            <div className="detail-title">Additional Information</div>
            <div className="list">
              <InfoItem
                key="1"
                title="Custom field 1"
                value="--"
              />
            </div>
          </div>
          <div className="right notes">
            <div className="detail-title">Notes</div>
            <div className=".note-lis">
              <InfoItem
                key="1"
                title="--"
                value="--"
              />
            </div>
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="block page-break">
          <hr className="detail-separator" />
          <div className="detail-title">Demographics</div>
          <div className="details">
            {getDetails(property).printDemographics.map(({ label, value }) => (
              <InfoItem
                key={label}
                title={label}
                value={value}
              />
            ))}
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="mortgage">
          <hr className="detail-separator" />
          <div className="detail-title">Current Mortgages</div>
          <div className="details">
            <table cellSpacing="0" BORDER="0">
              <tr>
                <th>ID</th>
                <th>Sale Date</th>
                <th>Sale Amount</th>
                <th>Recording Date</th>
                <th>Document Type</th>
                <th>Loan Type</th>
                <th>Loan Amount</th>
                <th>Lender Name</th>
                <th>Loan Due Date</th>
                <th>Est. Loan Payment</th>
              </tr>
              <tr>
                <td className="bold">01</td>
                <td>{property.Sale_Date ? formatDateString(property.Sale_Date) : '--'}</td>
                <td className="bold">{property.Sale_Price || '--'}</td>
                <td>{property.LSale_Recording_Date ? formatDateString(property.LSale_Recording_Date) : '--'}</td>
                <td>{property.documentType || '--'}</td>
                <td>{property.Mtg01_loan_type || '--'}</td>
                <td className="bold">{property.Mtg01_Loan_Amount || '--'}</td>
                <td>{property.Mtg01_lender_name_beneficiar || '--'}</td>
                <td>{property.Mtg01_due_dat || '--'}</td>
                <td className="bold">{property.Sale_Date ? formatDateString(property.Sale_Date) : '--'}</td>
              </tr>
              <tr className="shade" bgcolor="#AAA">
                <td colSpan="3">
                  <span className="bold">Estimated Loan Balance</span>
                  <span>{property.Current_Est_Equity_Dollars || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Interest Rate</span>
                  <span>{property.Mtg01_interest_rate || '--'}</span>
                </td>
                <td colSpan="3">
                  <span className="bold">Lender Mailing Address</span>
                  <span>--</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Loan Due Date</span>
                  <span>{ property.Mtg01_due_dat ? formatDateString(property.Mtg01_due_dat) : '--'}</span>
                </td>
              </tr>
              <tr className="shade" bgcolor="#AAA">
                <td colSpan="3">
                  <span className="bold">Estimated Monthly Interest</span>
                  <span>{property.estimatedMonthlyInterest || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Estimated Monthly Principle</span>
                  <span>{property.estimatedMonthlyPrincipal || '--'}</span>
                </td>
                <td colSpan="3">
                  <span className="bold">Loan Term</span>
                  <span>{property.Mtg01_Loan_Term_Years || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Original Date of Contract</span>
                  <span>{property.originalDateOfContract ? formatDateString(property.originalDateOfContract) : '--'}</span>
                </td>
              </tr>
              <tr>
                <td className="bold">02</td>
                <td>{property.Sale_Date ? formatDateString(property.Sale_Date) : '--'}</td>
                <td className="bold">{property.Sale_Price || '--'}</td>
                <td>{property.LSale_Recording_Date ? formatDateString(property.LSale_Recording_Date) : '--'}</td>
                <td>{property.documentType || '--'}</td>
                <td>{property.Mtg02_loan_type || '--'}</td>
                <td className="bold">{property.Mtg02_Loan_Amount || '--'}</td>
                <td>{property.Mtg02_lender_name_beneficiary || '--'}</td>
                <td>{property.Mtg02_due_dat ? formatDateString(property.Mtg02_due_dat) : '--'}</td>
                <td className="bold">{property.Sale_Date ? formatDateString(property.Sale_Date) : '--'}</td>
              </tr>
              <tr className="shade" bgcolor="#AAA">
                <td colSpan="3">
                  <span className="bold">Estimated Loan Balance</span>
                  <span>{property.Current_Est_Equity_Dollars_1 || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Interest Rate</span>
                  <span>{property.Mtg02_interest_rate || '--'}</span>
                </td>
                <td colSpan="3">
                  <span className="bold">Lender Mailing Address</span>
                  <span>--</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Loan Due Date</span>
                  <span>{property.Mtg02_due_dat ? formatDateString(property.Mtg02_due_dat) : '--'}</span>
                </td>
              </tr>
              <tr className="shade" bgcolor="#AAA">
                <td colSpan="3">
                  <span className="bold">Estimated Monthly Interest</span>
                  <span>{property.estimatedMonthlyInterest || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Estimated Monthly Principle</span>
                  <span>{property.estimatedMonthlyPrincipal || '--'}</span>
                </td>
                <td colSpan="3">
                  <span className="bold">Loan Term</span>
                  <span>{property.Mtg02_Loan_Term_Years || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Original Date of Contract</span>
                  <span>{property.originalDateOfContract ? formatDateString(property.originalDateOfContract) : '--'}</span>
                </td>
              </tr>
            </table>
          </div>
          <div>
            Total Balance:
            <span className="value">
              $
              {property.Total_Open_Lien_Balance}
            </span>
          </div>
        </div>
      </ContainerRow>
      <ContainerRow>
        <div className="mortgage">
          <hr className="detail-separator" />
          <div className="detail-title">Past Transactions</div>
          <div className="details">
            <table cellSpacing="0" BORDER="0">
              <tr>
                <th>Sale Date</th>
                <th>Recording Date</th>
                <th>Finance Type</th>
                <th>Document No.</th>
                <th>Document Type</th>
                <th>Transaction</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>Sale Price</th>
              </tr>
              <tr>
                <td>{property.Sale_Date ? formatDateString(property.Sale_Date) : '--'}</td>
                <td>{property.Mtg01_recording_date ? formatDateString(property.Mtg01_recording_date) : '--'}</td>
                <td className="bold">{property.typeFinancing || '--'}</td>
                <td>{property.documentNumber || '--'}</td>
                <td>{property.documentType || '--'}</td>
                <td>{property.transaction || '--'}</td>
                <td>{property.buyers || '--'}</td>
                <td>{property.seller || '--'}</td>
                <td className="bold">{property.Sale_Price || '--'}</td>
              </tr>
              <tr className="shade" bgcolor="#AAA">
                <td colSpan="2">
                  <span className="bold">Estimated Loan Balance</span>
                  <span>{property.Current_Est_Equity_Dollars_2 || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Interest Rate</span>
                  <span>{property.Mtg01_interest_rate || '--'}</span>
                </td>
                <td colSpan="3">
                  <span className="bold">Title Company</span>
                  <span>--</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Maturity Date</span>
                  <span>{ property.Mtg01_due_dat ? formatDateString(property.Mtg01_due_dat) : '--'}</span>
                </td>
              </tr>
              <tr className="shade" bgcolor="#AAA">
                <td colSpan="2">
                  <span className="bold">Estimated Monthly Interest</span>
                  <span>{property.estimatedMonthlyInterest || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Estimated Monthly Principle</span>
                  <span>{property.estimatedMonthlyPrincipal || '--'}</span>
                </td>
                <td colSpan="3">
                  <span className="bold">Loan Term</span>
                  <span>{property.Mtg01_Loan_Term_Years || '--'}</span>
                </td>
                <td colSpan="2">
                  <span className="bold">Loan Due Date</span>
                  <span>{property.originalDateOfContract ? formatDateString(property.Mtg01_due_date) : '--'}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </ContainerRow>
    </div>
  )
}
