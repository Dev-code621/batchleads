import MyCampaigns from './MyCampaigns'
import NewCampaign from './NewCampaign'

const routes = [
  {
    path: '/dashboard/mailCampaign', exact: true, name: 'My Mail Campaigns', component: MyCampaigns,
  },
  {
    path: '/dashboard/mailCampaign/new', exact: true, name: 'New Campaign', component: NewCampaign,
  },
  {
    path: '/dashboard/mailCampaign/*', exact: true, name: 'My Mail Campaigns', component: MyCampaigns,
  },
];

export default routes
