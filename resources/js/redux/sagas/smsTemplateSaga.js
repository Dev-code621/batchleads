import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects'
import {
  constants as smsTemplateConstants,
  actions as smsTemplateActions,
} from '../modules/smsTemplate'
import { actions as userActions } from '../modules/user'
import {
  getMyTemplates,
  newTemplate,
  updateTemplate,
  removeTemplate,
} from '~api/module/smsTemplate'

export function* getSmsTemplates({ payload }) {
  const { page, search } = payload;

  try {
    const response = yield call(getMyTemplates, { page, search });
    const { data } = response.data;

    if (response.status === 200) {
      yield put(
        smsTemplateActions.getTemplatesResult({
          error: null,
          loading: false,
          success: true,
          page: data.page,
          total: data.total,
          count: data.count,
          count_per_page: data.count_per_page,
          templates: data.data,
        })
      );
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(userActions.initUserResult());
      }
      yield put(
        smsTemplateActions.getTemplatesResult({
          error: error.response.data,
          success: false,
          status: 200,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          templates: [],
        })
      );
    } else {
      yield put(
        smsTemplateActions.getTemplatesResult({
          success: false,
          status: 200,
          loading: false,
          total: 0,
          page: 0,
          count: 0,
          count_per_page: 0,
          templates: [],
        })
      );
    }
  }
}

export function* create({ payload }) {
  const { template } = payload;

  try {
    const response = yield call(newTemplate, { template });
    const { data } = response.data;

    if (response.status === 200) {
      yield put(
        smsTemplateActions.createTemplateResult({
          error: null,
          loading: false,
          success: true,
          data,
        })
      );
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(userActions.initUserResult());
      }
      yield put(
        smsTemplateActions.createTemplateResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      );
    } else {
      yield put(
        smsTemplateActions.createTemplateResult({
          success: false,
          loading: false,
        })
      );
    }
  }
}

export function* update({ payload }) {
  const { template } = payload;

  try {
    const response = yield call(updateTemplate, { template });
    const { data } = response.data;

    if (response.status === 200) {
      yield put(
        smsTemplateActions.updateTemplateResult({
          error: null,
          loading: false,
          success: true,
          data,
        })
      );
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(userActions.initUserResult());
      }
      yield put(
        smsTemplateActions.updateTemplateResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      );
    } else {
      yield put(
        smsTemplateActions.updateTemplateResult({
          success: false,
          loading: false,
        })
      );
    }
  }
}

export function* remove({ payload }) {
  const { id } = payload;

  try {
    const response = yield call(removeTemplate, { id });
    const { data } = response.data;

    if (response.status === 200) {
      yield put(
        smsTemplateActions.removeTemplateResult({
          error: null,
          loading: false,
          success: true,
          data,
        })
      );
    }
  } catch (error) {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        yield put(userActions.initUserResult());
      }
      yield put(
        smsTemplateActions.removeTemplateResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      );
    } else {
      yield put(
        smsTemplateActions.removeTemplateResult({
          success: false,
          loading: false,
        })
      );
    }
  }
}

function* watchSmsTemplate() {
  yield takeLatest(smsTemplateConstants.GET_TEMPLATES, getSmsTemplates);
  yield takeLatest(smsTemplateConstants.CREATE_TEMPLATE, create);
  yield takeLatest(smsTemplateConstants.UPDATE_TEMPLATE, update);
  yield takeLatest(smsTemplateConstants.REMOVE_TEMPLATE, remove);
}

export const smsTemplateSaga = [fork(watchSmsTemplate)];
