import {
  put, fork, takeLatest, call,
} from 'redux-saga/effects';
import {
  constants as mailTemplateConstants,
  actions as mailTemplateActions,
} from '../modules/mailTemplate';
import { actions as userActions } from '../modules/user';
import {
  getMyTemplates,
  newTemplate,
  updateTemplate,
  removeTemplate,
} from '~api/module/mailTemplate';

export function* getMailTemplates({ payload }) {
  const { page, search } = payload;

  try {
    const response = yield call(getMyTemplates, { page, search });
    const { data } = response.data;

    if (response.status === 200) {
      yield put(
        mailTemplateActions.getTemplatesResult({
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
        mailTemplateActions.getTemplatesResult({
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
        mailTemplateActions.getTemplatesResult({
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
        mailTemplateActions.createTemplateResult({
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
        mailTemplateActions.createTemplateResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      );
    } else {
      yield put(
        mailTemplateActions.createTemplateResult({
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
        mailTemplateActions.updateTemplateResult({
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
        mailTemplateActions.updateTemplateResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      );
    } else {
      yield put(
        mailTemplateActions.updateTemplateResult({
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
        mailTemplateActions.removeTemplateResult({
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
        mailTemplateActions.removeTemplateResult({
          error: error.response.data,
          success: false,
          loading: false,
          status,
        })
      );
    } else {
      yield put(
        mailTemplateActions.removeTemplateResult({
          success: false,
          loading: false,
        })
      );
    }
  }
}

function* watchMailTemplate() {
  yield takeLatest(mailTemplateConstants.GET_MAIL_TEMPLATES, getMailTemplates);
  yield takeLatest(mailTemplateConstants.CREATE_MAIL_TEMPLATE, create);
  yield takeLatest(mailTemplateConstants.UPDATE_MAIL_TEMPLATE, update);
  yield takeLatest(mailTemplateConstants.REMOVE_MAIL_TEMPLATE, remove);
}

export const mailTemplateSaga = [fork(watchMailTemplate)];
