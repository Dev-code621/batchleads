import MyCampaigns from './MyCampaigns'
import NewCampaign from './NewCampaign'

const routes = [
  {
    path: '/dashboard/smsCampaign', exact: true, name: 'My Sms Campaigns', component: MyCampaigns,
  },
  {
    path: '/dashboard/smsCampaign/new', exact: true, name: 'New Campaign', component: NewCampaign,
  },
  {
    path: '/dashboard/smsCampaign/*', exact: true, name: 'My Sms Campaigns', component: MyCampaigns,
  },
];

export default routes
