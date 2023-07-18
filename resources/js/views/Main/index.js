import React, { Fragment, useEffect } from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'
import Home from '~views/Home'
import Pricing from '~views/Home/Pricing'
import Squad from '~views/Main/Affiliates/Squad'
import Gavin from '~views/Main/Affiliates/Gavin'
import Whft from '~views/Main/Affiliates/Whft'
import Matt from '~views/Main/Affiliates/Matt'
import Jamil from '~views/Main/Affiliates/Jamil'
import Ttp from '~views/Main/Affiliates/Ttp'
import Affiliate from '~views/Main/Affiliates/Affiliate'
import Missing from '~views/Main/Affiliates/Missing'
import Zach from '~views/Main/Affiliates/Zach'
import Teambc from '~views/Main/Affiliates/Teambc'
import Clever from '~views/Main/Affiliates/Clever'
import Titanium from '~views/Main/Affiliates/Titanium'
import Red from '~views/Main/Affiliates/Red'
import Millenialflippers from '~views/Main/Affiliates/Millenialflippers'
import Fliptalk from '~views/Main/Affiliates/Fliptalk'
import Dave from '~views/Main/Affiliates/Dave'
import Homerun from '~views/Main/Affiliates/Homerun'
import Valleyinvestmentclub from '~views/Main/Affiliates/Valleyinvestmentclub'
import Super from '~views/Main/Affiliates/Super'
import Flipempire from '~views/Main/Affiliates/Flipempire'
import Shutupinvest from '~views/Main/Affiliates/Shutupinvest'
import { addFreshChat } from '~common/useScript'
import Ceo from '~views/Main/Affiliates/Ceo'
import Tos from '../Home/Customer/Tos'
import Privacy from '../Home/Customer/Privacy'
import Personal from '../Home/Customer/Personal'
import CCPA from '../Home/Customer/CCPA'

export default () => {
  addFreshChat(true)
  const hideWindow = () => {
    if (window.UsersnapCX) {
      window.UsersnapCX.hideButton()
    } else {
      setTimeout(() => {
        hideWindow()
      }, 100)
    }
  }
  useEffect(() => {
    hideWindow()
    return () => {
      if (window.UsersnapCX) {
        window.UsersnapCX.showButton()
      }
    }
  }, [])
  return (
    <Fragment>
      <ScrollAnimation animateIn="fadeIn">
        <div className="main-container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/tos" component={Tos} />
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/personal" component={Personal} />
            <Route exact path="/ccpa" component={CCPA} />
            <Route exact path="/pricing" component={Pricing} />
            <Route exact path="/squad" component={Squad} />
            <Route exact path="/squadup" component={Squad} />
            <Route exact path="/jamil" component={Jamil} />
            <Route exact path="/gavin" component={Gavin} />
            <Route exact path="/whft" component={Whft} />
            <Route exact path="/matt" component={Matt} />
            <Route exact path="/ttp" component={Ttp} />
            <Route exact path="/flipman" component={Affiliate} />
            <Route exact path="/clever" component={Clever} />
            <Route exact path="/pace" component={Affiliate} />
            <Route exact path="/dataking" component={Affiliate} />
            <Route exact path="/anny" component={Affiliate} />
            <Route exact path="/ivo" component={Affiliate} />
            <Route exact path="/cody" component={Affiliate} />
            <Route exact path="/batch" component={Affiliate} />
            <Route exact path="/subto" component={Affiliate} />
            <Route exact path="/zach" component={Zach} />
            <Route exact path="/teambc" component={Teambc} />
            <Route exact path="/titanium" component={Titanium} />
            <Route exact path="/red" component={Red} />
            <Route exact path="/millennialflippers" component={Millenialflippers} />
            <Route exact path="/fliptalk" component={Fliptalk} />
            <Route exact path="/dave" component={Dave} />
            <Route exact path="/homerun" component={Homerun} />
            <Route exact path="/990" component={Affiliate} />
            <Route exact path="/valleyinvestmentclub" component={Valleyinvestmentclub} />
            <Route exact path="/super" component={Super} />
            <Route exact path="/flipempire" component={Flipempire} />
            <Route exact path="/shutupinvest" component={Shutupinvest} />
            <Route exact path="/ceo" component={Ceo} />
            <Route component={Missing} />
          </Switch>
        </div>
      </ScrollAnimation>
    </Fragment>
  )
}
