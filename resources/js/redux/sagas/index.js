import { all } from 'redux-saga/effects'
import { userSaga } from './userSaga'
import { creditSaga } from './creditSaga'
import { propertySaga } from './propertySaga'
import { drivingRoutesSaga } from './drivingRoutesSaga'
import { smsCampaignSaga } from './smsCampaignSaga'
import { smsTemplateSaga } from './smsTemplateSaga'
import { mailTemplateSaga } from './mailTemplateSaga'
import { folderSaga } from './folderSaga'
import { templateStyleSaga } from './templateStyleSaga'
import { signatureSaga } from './signatureSaga'
import { mailCampaignSaga } from './mailCampaignSaga'
import { messageSaga } from './messageSaga'
import { kpiSaga } from './kpiSaga'
import { tagSaga } from './tagSaga'

export default function* sagas() {
  yield all([
    ...userSaga,
    ...creditSaga,
    ...propertySaga,
    ...drivingRoutesSaga,
    ...smsCampaignSaga,
    ...smsTemplateSaga,
    ...mailTemplateSaga,
    ...folderSaga,
    ...templateStyleSaga,
    ...signatureSaga,
    ...mailCampaignSaga,
    ...messageSaga,
    ...kpiSaga,
    ...tagSaga,
  ])
}
