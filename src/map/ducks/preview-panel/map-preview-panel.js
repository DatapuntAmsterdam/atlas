import { FETCH_SEARCH_RESULTS_BY_LOCATION } from '../../../shared/ducks/search/search';
import { UPDATE_MAP } from '../map/map';
import { routing } from '../../../app/routes';

export const OPEN_MAP_PREVIEW_PANEL = 'OPEN_MAP_PREVIEW_PANEL';
export const CLOSE_MAP_PREVIEW_PANEL = 'CLOSE_MAP_PREVIEW_PANEL';

const initialState = {};

export default function MapPreviewPanelReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN_MAP_PREVIEW_PANEL:
      return {
        ...state,
        isMapPreviewPanelVisible: true
      };

    case CLOSE_MAP_PREVIEW_PANEL:
      return {
        ...state,
        isMapPreviewPanelVisible: false
      };

    default:
      return state;
  }
}


// selectors
export const previewDataAvailable = (state) => {
  // If either an object is selected or a point search is in progress, show preview panel
  return Boolean(state.detail && state.detail.endpoint)
          || Boolean(state.search && state.search.mapSearchResultsByLocation && Object.keys(state.search.mapSearchResultsByLocation).length);
};

export const closeMapPreviewPanel = () => ({ type: CLOSE_MAP_PREVIEW_PANEL });

// Todo: is this used in a reducer?
export const fetchSearchResultsByLocation = (location) => ({
  type: FETCH_SEARCH_RESULTS_BY_LOCATION,
  payload: [location.latitude, location.longitude]
});

export const showDetailView = () => ({
  type: UPDATE_MAP,
  payload: {
    noRedirect: true,
    route: routing.detail.type
  }
});

export const showSearchView = () => ({
  type: UPDATE_MAP,
  payload: {
    noRedirect: true,
    route: routing.mapSearch.type
  }
});
