import Properties from '~views/Properties'
import Team from '~views/Team'
import KPIS from '~views/KPIS'
import SmsCampaign from '~views/SmsCampaign'
import DrivingRoutes from '~views/DrivingRoutes'
import Messages from '~views/Messages'
import UserSetting from '~views/UserSetting'
import SmsTemplates from '~views/SmsTemplates'
import MailTemplate from '~views/MailTemplate'
import MailSignature from '~views/MailSignature'
import MailCampaign from '~views/MailCampaign'
import Affiliates from '~views/Affiliates'

const routes = [
  {
    path: '/dashboard', exact: true, name: 'Properties',
  },
  {
    path: '/dashboard/properties', exact: true, name: 'Properties', component: Properties,
  },
  {
    path: '/dashboard/properties/:isSelect', exact: true, name: 'Properties', component: Properties,
  },
  {
    path: '/dashboard/properties/*', exact: true, name: 'Properties', component: Properties,
  },
  {
    path: '/dashboard/teams', exact: true, name: 'Team', component: Team,
  },
  {
    path: '/dashboard/teams/*', exact: true, name: 'Team', component: Team,
  },
  {
    path: '/dashboard/kpis', exact: true, name: 'KPIS', component: KPIS,
  },
  {
    path: '/dashboard/drivingRoutes', exact: true, name: 'DrivingRoutes', component: DrivingRoutes,
  },
  {
    path: '/dashboard/drivingRoutes/*', exact: true, name: 'DrivingRoutes', component: DrivingRoutes,
  },
  {
    path: '/dashboard/messages', exact: true, name: 'Messages', component: Messages,
  },
  {
    path: '/dashboard/messages/*', exact: true, name: 'Messages', component: Messages,
  },
  {
    path: '/dashboard/smsCampaign', exact: true, name: 'Sms Campaign', component: SmsCampaign,
  },
  {
    path: '/dashboard/smsCampaign/*', exact: true, name: 'Sms Campaign', component: SmsCampaign,
  },
  {
    path: '/dashboard/mailCampaign', exact: true, name: 'Mail Campaign', component: MailCampaign,
  },
  {
    path: '/dashboard/mailCampaign/*', exact: true, name: 'Mail Campaign', component: MailCampaign,
  },
  {
    path: '/dashboard/smsTemplates', exact: true, name: 'Sms Templates', component: SmsTemplates,
  },
  {
    path: '/dashboard/smsTemplates/:isSelect', exact: true, name: 'Sms Templates', component: SmsTemplates,
  },
  {
    path: '/dashboard/mailTemplates', exact: true, name: 'Mail Templates', component: MailTemplate,
  },
  {
    path: '/dashboard/mailTemplates/:isSelect', exact: true, name: 'Mail Templates', component: MailTemplate,
  },
  {
    path: '/dashboard/mailSignatures', exact: true, name: 'Mail Signature', component: MailSignature,
  },
  {
    path: '/dashboard/mailSignatures/*', exact: true, name: 'Mail Signature', component: MailSignature,
  },
  {
    path: '/dashboard/settings', exact: true, name: 'User Settings', component: UserSetting,
  },
  {
    path: '/dashboard/settings/*', exact: true, name: 'User Settings', component: UserSetting,
  },
  {
    path: '/dashboard/affiliates', exact: true, name: 'Affiliates', component: Affiliates,
  },
  {
    path: '/dashboard/*', exact: true, name: 'Properties', component: Properties,
  },
]

export default routes
