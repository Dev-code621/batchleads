/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
import React, { useEffect, useState } from 'react'
import Slider from 'infinite-react-carousel'
import TestimonialCard from './TestimonialCard'
import Avatar0 from '~assets/images/avatar0.jpg'
import Avatar1 from '~assets/images/avatar1.jpg'
import Avatar2 from '~assets/images/avatar2.jpg'
import Avatar3 from '~assets/images/avatar3.jpg'
import './style.scss'

function debounce(fn, ms) {
  let timer
  return (_) => {
    clearTimeout(timer)
    timer = setTimeout((_) => {
      timer = null
      // eslint-disable-next-line prefer-rest-params
      fn.apply(this, arguments)
    }, ms)
  };
}

const testimonials = [
  {
    id: 'testimonial-0',
    picture: Avatar0,
    name: 'Ericia Garza',
    role: 'Real Estate Investor',
    description:
      `
      BatchDriven had completely changed the way I find leads! While out "driving for dollars" I scoped out a vacant property and was able to pull up the map on BatchDriven and find the owners mailing address and phone number through skip tracing. It has really helped me find properties I might have never come across and I'm able to stay so organized. Love this app.
      `,
  },
  {
    id: 'testimonial-3',
    picture: Avatar3,
    name: 'Josh Lockwood',
    role: 'Real Estate Consultant',
    description:
      `
      It makes picking driving for dollars easy because you literally type in a zip code to search...it finds foreclosures and i start driving in those neighborhoods...the truly best part is being able to drive down the street...see a vacant house that may not be on the list and pull the house up, press SKIP trace and try and reach the homeowner literally while sitting in their driveway...Absolutely Game Changing!
      `,
  },
  {
    id: 'testimonial-1',
    picture: Avatar1,
    name: 'Trystan Trenberth',
    role: 'Managing Director',
    // role: 'Managing Director at Bramhall Investments Inc',
    description:
      `My favorite thing about BatchDriven is out team ❤️❤️❤️ <br />
      I've been able to find homes out on the go and immediately skip trace, even in Flagstaff on a camping trip!! <br />
      I've found several leads and I'm working with a Foreclosure I found within my own zip code!!
      `,
  },
  {
    id: 'testimonial-2',
    picture: Avatar2,
    name: 'Charles Campbell',
    role: 'Owner-operator',
    // role: 'Owner-operator at Florida Reef Properties LLC',
    description:
      `
      So the BatchDriven app gave me owners address and phone numbers...drove to owners house and this is what I found...got work cut out for me but...wouldn't have found this without this app!!! LOVE IT!!
      `,
  },
]

export default () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  })

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return (_) => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  }, [])

  const width = dimensions.width * 1

  return (
    <section className="testimonial-section">
      <div className="container" id="feedback">
        <h3>WHAT OUR CUSTOMERS HAVE TO SAY</h3>
        <p>See why so many Real Estate Investors are joining us every day</p>
      </div>
      <Slider
        dots
        autoplay
        autoplaySpeed={10000}
        arrows={false}
        centerMode={width > 767}
        centerPadding={width > 1200 ? (width - 1000) / 2 : 140}
      >
        {
        testimonials.map((testimonial) => (
          <TestimonialCard {...testimonial} key={testimonial.id} />
        ))
      }
      </Slider>
    </section>
  )
}
