import { routing } from '../../../app/routes';
import {
  getPage,
  isDataSelectionPage,
  isDatasetPage,
  isPanoPage
} from '../../redux-first-router/selectors';
import {
  DOWNLOAD_DATASET_RESOURCE,
  FETCH_DATASETS_SUCCESS
} from '../../../shared/ducks/datasets/data/data';
import {
  getNumberOfResults as getNumberOfDatasetsResults,
  getSearchText as getDatasetsSearchQuery
} from '../../../shared/ducks/datasets/datasets';
import { DOWNLOAD_DATA_SELECTION } from '../../../shared/ducks/data-selection/constants';
import { FETCH_QUERY_SEARCH_RESULTS_SUCCESS } from '../../../shared/ducks/data-search/constants';
import {
  getSearchQuery,
  getNumberOfResults
} from '../../../shared/ducks/data-search/selectors';
import {
  AUTHENTICATE_USER_REQUEST,
  AUTHENTICATE_USER_SUCCESS
} from '../../../shared/ducks/user/user';
import {
  ADD_FILTER,
  REMOVE_FILTER
} from '../../../shared/ducks/filters/filters';
import {
  getViewMode,
  SET_VIEW_MODE,
  SHOW_EMBED_PREVIEW,
  SHOW_PRINT,
  HIDE_PRINT,
  HIDE_EMBED_PREVIEW,
  VIEW_MODE
} from '../../../shared/ducks/ui/ui';
import {
  SET_MAP_BASE_LAYER,
  SET_MAP_CLICK_LOCATION,
  MAP_START_DRAWING
} from '../../../map/ducks/map/map';
import { getShapeMarkers } from '../../../map/ducks/map/map-selectors';
import {
  NAVIGATE_HOME_REQUEST,
  REPORT_PROBLEM_REQUEST
} from '../../../header/ducks/actions';
import {
  FETCH_PANORAMA_HOTSPOT_REQUEST,
  FETCH_PANORAMA_REQUEST_TOGGLE,
  FETCH_PANORAMA_REQUEST_EXTERNAL
} from '../../../panorama/ducks/constants';
import PAGES from '../../../app/pages';
import { PIWIK_CONSTANTS } from './piwikMiddleware';

const events = {
  // NAVIGATION
  // NAVIGATION -> NAVIGATE TO DATA DETAIL
  [routing.dataDetail.type]: function trackDataDetail({ query, tracking, state }) {
    return (tracking && tracking.event === 'auto-suggest') ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'auto-suggest', // NAVIGATION -> SELECT AUTOSUGGEST OPTION
      tracking.category,
      tracking.query
    ] : (getViewMode(state) === VIEW_MODE.MAP && query.view === VIEW_MODE.SPLIT) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM MAP
      'detail-volledig-weergeven',
      null
    ] : (getViewMode(state) === VIEW_MODE.SPLIT && query.view === VIEW_MODE.MAP) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM SPLITSCREEN
      'detail-kaart-vergroten',
      null
    ] : isPanoPage(state) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation', // NAVIGATION -> CLICK CLOSE FROM PANORAMA
      'panorama-verlaten',
      null
    ] : [];
  },
  // NAVIGATION -> NAVIGATE TO GEO SEARCH
  [routing.dataGeoSearch.type]: function trackGeoSearch({ state }) {
    return isPanoPage(state) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'navigation', // NAVIGATION -> CLICK CLOSE FROM PANORAMA
      'panorama-verlaten',
      null
    ] : [];
  },
  // NAVIGATION -> CLOSE PRINT VIEW
  [HIDE_PRINT]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'printversie-verlaten',
    null
  ],
  // NAVIGATION -> CLOSE EMBED VIEW
  [HIDE_EMBED_PREVIEW]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'embedversie-verlaten',
    null
  ],
  // NAVIGATION -> CLICK LOGO
  [NAVIGATE_HOME_REQUEST]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'navigation',
    'home',
    title
  ],
  // NAVIGATION -> CHANGE VIEW MODE
  [SET_VIEW_MODE]: ({ tracking, state }) => {
    const viewMode = getViewMode(state);
    switch (getPage(state)) {
      case PAGES.DATA_GEO_SEARCH:
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation', // NAVIGATION -> CLICK TOGGLE FULLSCREEN FROM MAP Or SPLITSCREEN
          `georesultaten-${(viewMode === VIEW_MODE.MAP) ? 'volledig-weergeven' : 'kaart-vergroten'}`,
          null
        ];

      case PAGES.PANORAMA: {
        let view = tracking;
        if (typeof tracking === 'boolean') {
          view = (viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten';
        }
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `panorama-${view}`,
          null
        ];
      }

      case PAGES.ADDRESSES:
      case PAGES.ESTABLISHMENTS:
      case PAGES.CADASTRAL_OBJECTS: {
        let view = tracking;
        if (typeof tracking === 'boolean') {
          view = (viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten';
        }
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `dataselectie-${view}`,
          null
        ];
      }

      default:
        return [
          PIWIK_CONSTANTS.TRACK_EVENT,
          'navigation',
          `page-${(viewMode === VIEW_MODE.MAP) ? 'kaart-verkleinen' : 'kaart-vergroten'}`,
          null
        ];
    }
  },
  // SITE SEARCH
  // SITE SEARCH -> DATA SWITCH TAB
  [routing.dataQuerySearch.type]: ({ firstAction = null, state }) => {
    const query = getSearchQuery(state);
    const numberOfResults = getNumberOfResults(state);
    return (firstAction && (query && query.length > 0)) ? [
      PIWIK_CONSTANTS.TRACK_SEARCH,
      query,
      'data',
      numberOfResults
    ] : [];
  },
  // SITE SEARCH -> DATA INITIAL LOAD
  [FETCH_QUERY_SEARCH_RESULTS_SUCCESS]: function trackDataSearch({ tracking, state }) {
    return (getPage(state) === PAGES.DATA_QUERY_SEARCH) ? [
      PIWIK_CONSTANTS.TRACK_SEARCH,
      tracking.query,
      'data',
      tracking.numberOfResults
    ] : [];
  },
  // SITE SEARCH -> DATASETS SWITCH TAB
  [routing.searchDatasets.type]: ({ firstAction = null, state }) => {
    const query = getDatasetsSearchQuery(state);
    const numberOfResults = getNumberOfDatasetsResults(state);
    return (firstAction && (query && query.length > 0)) ? [
      PIWIK_CONSTANTS.TRACK_SEARCH,
      query,
      'datasets',
      numberOfResults
    ] : [];
  },
  // SITE SEARCH -> DATASETS INITIAL LOAD
  [FETCH_DATASETS_SUCCESS]: function trackDatasetSearch({ tracking, state }) {
    return (getPage(state) === PAGES.SEARCH_DATASETS) ? [
      PIWIK_CONSTANTS.TRACK_SEARCH,
      tracking.query,
      'datasets',
      tracking.numberOfResults
    ] : [];
  },
  // DATASETS
  // DATASETS -> CLICK RESOURCE ON DATASETS_DETAIL
  [DOWNLOAD_DATASET_RESOURCE]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'Download',
    tracking.dataset,
    tracking.resourceUrl
  ],
  // DATA SELECTION
  // DATA SELECTION -> BUTTON "downloaden"
  [DOWNLOAD_DATA_SELECTION]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'Download-tabel',
    `dataselectie-download-${tracking.toLowerCase()}`,
    null
  ],
  // DRAW TOOL
  [MAP_START_DRAWING]: function trackDrawing({ tracking, state, title }) {
    const markers = getShapeMarkers(state);
    return (tracking === 'none' && markers === 2) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'kaart', // DRAW TOOL -> DRAW "line"
      'kaart-tekenlijn',
      title
    ] : (tracking === 'none' && markers > 2) ? [
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter', // DRAW TOOL -> DRAW "polygoon"
      'dataselectie-polygoon-filter',
      'Locatie ingetekend'
    ] : [];
  },
  // MAP
  // MAP -> TOGGLE BASE LAYER
  [SET_MAP_BASE_LAYER]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'achtergrond',
    (tracking.startsWith('lf') ? 'luchtfoto' : 'topografie'),
    tracking
  ],
  // MAP -> CLICK LOCATION
  [SET_MAP_CLICK_LOCATION]: function trackMapClick({ state }) {
    return isPanoPage(state) ? [   // PANORAMA -> CLICK MAP
      PIWIK_CONSTANTS.TRACK_EVENT,
      'panorama-navigatie',
      'panorama-kaart-klik',
      null
    ] : [ // GEOSEARCH -> CLICK MAP
      PIWIK_CONSTANTS.TRACK_EVENT,
      'kaart',
      'kaart-puntzoek',
      null
    ];
  },
  // MAP -> TOGGLE OVERLAYS
  TOGGLE_MAP_OVERLAY: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'kaartlaag',
    tracking.category.toLowerCase().replace(/[: ][ ]*/g, '_'),
    tracking.title
  ],
  // AUTHENTICATION
  // AUTHENTICATION BUTTON -> "inloggen" / "uitloggen"
  [AUTHENTICATE_USER_REQUEST]: ({ tracking, title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'login',
    tracking,
    title
  ],
  // AUTHENTICATION AFTER RETURN
  [AUTHENTICATE_USER_SUCCESS]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'login',
    'ingelogd',
    tracking
  ],
  // FILTERS
  // ADD FILTER -> "datasets" / "dataselectie"
  [ADD_FILTER]: ({ tracking, state }) => {
    const page = isDataSelectionPage(state) ? 'dataselectie-tabel'
      : isDatasetPage(state) ? 'datasets'
        : null;

    return page ? ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter',
      `${page}-filter`,
      Object.keys(tracking)[0]
    ]) : [];
  },
  // REMOVE FILTER -> "datasets" / "dataselectie"
  [REMOVE_FILTER]: ({ tracking, state }) => {
    const page = isDataSelectionPage(state) ? 'dataselectie'
      : isDatasetPage(state) ? 'dataset'
        : null;

    return page ? ([
      PIWIK_CONSTANTS.TRACK_EVENT,
      'filter',
      `${page}-tabel-filter-verwijder`,
      tracking
    ]) : [];
  },
  // PANORAMA
  // PANORAMA -> TOGGLE "missionType" / "missionYear"
  [FETCH_PANORAMA_REQUEST_TOGGLE]: ({ tracking }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-set',
    (tracking.year > 0) ? `panorama-set-${tracking.year}${tracking.missionType}` : 'panorama-set-recent',
    null
  ],
  // PANORAMA -> TOGGLE "external"
  [FETCH_PANORAMA_REQUEST_EXTERNAL]: () => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-set',
    'panorama-set-google',
    null
  ],
  // PANORAMA -> CLICK HOTSPOT
  [FETCH_PANORAMA_HOTSPOT_REQUEST]: () => ([
    PIWIK_CONSTANTS.TRACK_EVENT,
    'panorama-navigatie',
    'panorama-hotspot-klik',
    null
  ]),
  // MENU
  // MENU -> "terugmelden"
  [REPORT_PROBLEM_REQUEST]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-terugmelden',
    title
  ],
  // MENU
  // MENU -> "embedden"
  [SHOW_EMBED_PREVIEW]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-embedversie',
    title
  ],
  // MENU
  // MENU -> "printen"
  [SHOW_PRINT]: ({ title }) => [
    PIWIK_CONSTANTS.TRACK_EVENT,
    'menu',
    'menu-printversie',
    title
  ]
};

export default events;
