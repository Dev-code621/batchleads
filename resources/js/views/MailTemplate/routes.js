import TemplateList from './TemplateList'
import NewTemplate from './NewTemplate'

const routes = [
  {
    path: '/dashboard/mailTemplates', exact: true, name: 'Mail Templates',
  },
  {
    path: '/dashboard/mailTemplates', exact: true, name: 'Mail Templates', component: TemplateList,
  },
  {
    path: '/dashboard/mailTemplates/new', exact: true, name: 'Mail Templates', component: NewTemplate,
  },
  {
    path: '/dashboard/mailTemplates/*', exact: true, name: 'Mail Templates', component: TemplateList,
  },
];

export default routes;
