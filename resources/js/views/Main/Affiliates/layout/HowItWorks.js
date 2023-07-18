import React from 'react'
import './HowItWorks.style.scss'
import Step from './Step'
import Step1 from '~assets/icons/step1.svg'
import Step2 from '~assets/icons/step2.svg'
import Step3 from '~assets/icons/step3.svg'
import Step4 from '~assets/icons/step4.svg'
import Step5 from '~assets/icons/step5.svg'

const steps = [
  {
    id: 'step-1',
    icon: Step1,
    description: 'Pilot Driving<br />Routes',
    description_mobile: 'Pilot Driving Routes',
  },
  {
    id: 'step-2',
    icon: Step2,
    description: 'Tracking & Scalability',
    description_mobile: 'Tracking & Scalability',
  },
  {
    id: 'step-3',
    icon: Step3,
    description: 'Owner<br />Look Ups',
    description_mobile: 'Owner Look Ups',
  },
  {
    id: 'step-4',
    icon: Step4,
    description: 'Bulk Uploads -<br />Import & Export Data<br />from Spreadsheets',
    description_mobile: 'Bulk Uploads - Import & Export Data from Spreadsheets',
  },
  {
    id: 'step-5',
    icon: Step5,
    description: 'Data Lists -<br />Pre-Foreclosure, High<br />Equity, and Vacants',
    description_mobile: 'Data Lists - Pre-Foreclosure, High Equity, and Vacants',
  },
]

export default () => (
  <div className="how-it-works-container">
    <div className="title">
      Here&apos;s how it works:
    </div>
    <div className="description">
      Today, you can start a 7-day trial of our BatchDriven App for FREE.
    </div>
    <div className="flow">
      {
        steps.map((step, index) => <Step {...step} key={step.id} className={index % 2 === 0 ? 'top' : 'bottom'} />)
      }
    </div>
  </div>
)
