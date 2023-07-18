import TemplateList from './TemplateList'
import NewTemplate from './NewTemplate'

const routes = [
  {
    path: '/dashboard/smsTemplates', exact: true, name: 'SMS Templates',
  },
  {
    path: '/dashboard/smsTemplates', exact: true, name: 'SMS Templates', component: TemplateList,
  },
  {
    path: '/dashboard/smsTemplates/new', exact: true, name: 'SMS Templates', component: NewTemplate,
  },
  {
    path: '/dashboard/smsTemplates/*', exact: true, name: 'SMS Templates', component: TemplateList,
  },
];

export default routes;
