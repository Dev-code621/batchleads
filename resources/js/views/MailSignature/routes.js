import SignatureList from './SignatureList'
import NewSignature from './NewSignature'

const routes = [
  {
    path: '/dashboard/mailSignatures', exact: true, name: 'Mail Signatures',
  },
  {
    path: '/dashboard/mailSignatures', exact: true, name: 'Mail Signatures', component: SignatureList,
  },
  {
    path: '/dashboard/mailSignatures/new', exact: true, name: 'Mail Signature', component: NewSignature,
  },
  {
    path: '/dashboard/mailSignatures/*', exact: true, name: 'Mail Signatures', component: SignatureList,
  },
];

export default routes;
