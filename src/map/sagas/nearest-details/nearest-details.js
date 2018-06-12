import { call, put, takeLatest } from 'redux-saga/effects';

import fetchNearestDetail from '../../services/nearest-detail/nearest-detail';

import { MAP_HIGHLIGHT } from '../../ducks/map/map';

import ACTIONS from '../../../shared/actions';

export function* fetchNearestDetails(action) {
  const {
    location,
    layers,
    zoom
  } = action.payload;
  try {
    const uri = yield call(fetchNearestDetail, location, layers, zoom);
    if (uri) {
      yield put({
        type: MAP_HIGHLIGHT,
        payload: false
      });
      yield put({
        type: ACTIONS.FETCH_DETAIL,
        payload: uri,
        skippedSearchResults: true
      });
    } else {
      yield put({
        type: 'REQUEST_GEOSEARCH',
        payload: [location.latitude, location.longitude]
      });
    }
  } catch (error) {
    yield put({
      type: 'REQUEST_GEOSEARCH',
      payload: [location.latitude, location.longitude]
    });
  }
}

export default function* watchFetchNearestDetails() {
  yield takeLatest('REQUEST_NEAREST_DETAILS', fetchNearestDetails);
}
