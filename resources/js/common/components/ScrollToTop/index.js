import { useEffect } from 'react'
import { withRouter } from 'react-router'


export const ScrollToTop = ({ children, location }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'BatchDriven'
  }, [location.pathname])
  return children
}

export default withRouter(ScrollToTop)
