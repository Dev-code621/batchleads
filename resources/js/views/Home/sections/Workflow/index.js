import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import './style.scss'
import WorkflowChartNode from './WorkflowChartNode'
import Img0 from '~assets/images/locate_a_property.svg'
import Img1 from '~assets/images/find_the_owner.svg'
import Img2 from '~assets/images/get_in_touch.svg'

const nodes = [
  {
    id: 'phase-1',
    image: Img0,
    title: 'Locate a Property',
    description:
      'Access hundreds of thousands of distressed properties in your area.',
  },
  {
    id: 'phase-2',
    image: Img1,
    title: 'Find the Owner',
    description:
      'Instantly discover the property owner information, mailing address, phone numbers and more.',
  },
  {
    id: 'phase-3',
    image: Img2,
    title: 'Get in Touch',
    description:
      'Click a button and instantly start sending direct mail or trigger an automated text messaging campaign and get a hold of the owner.',
  },
]
export default () => (
  <section className="workflow-section">
    <ScrollAnimation animateIn="fadeIn" animateOnce>
      <div className="container" id="howitworks">
        <h3>HOW IT WORKS</h3>
        <div className="workflow-chart">
          {
            nodes.map((node) => (
              <WorkflowChartNode {...node} key={node.id} />
            ))
          }
        </div>
      </div>
    </ScrollAnimation>
  </section>
);
