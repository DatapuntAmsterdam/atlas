import PAGES from './pages';
import PANORAMA_VIEW from '../shared/ducks/straatbeeld/panorama-view';
import { DETAIL_VIEW } from '../shared/ducks/detail/detail';

export const ROUTER_NAMESPACE = 'atlasRouter';

export const routing = {
  home: {
    title: 'Home',
    reduxRouter: {
      path: '/'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.HOME}`,
    page: PAGES.HOME
  },
  map: {
    title: 'Grote kaart',
    reduxRouter: {
      path: '/kaart'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART}`,
    page: PAGES.KAART
  },
  catalogus: {
    title: 'Datasets',
    reduxRouter: {
      path: '/datasets'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.CATALOGUS}`,
    page: PAGES.CATALOGUS
  },
  catalogusDetail: {
    title: '',
    reduxRouter: {
      path: '/datasets/detail/:id'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.CATALOGUS_DETAIL}`,
    page: PAGES.CATALOGUS_DETAIL
  },
  adressen: {
    title: '',
    reduxRouter: {
      path: '/datasets/bag/adressen'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.ADRESSEN}`,
    page: PAGES.ADRESSEN
  },
  vestigingen: {
    title: '',
    reduxRouter: {
      path: '/vestigingen'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.VESTIGINGEN}`,
    page: PAGES.VESTIGINGEN
  },
  searchCatalog: {
    reduxRouter: {
      path: '/search/catalog/:query'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.SEARCH_CATALOG}`,
    page: PAGES.SEARCH_CATALOG
  },
  searchData: {
    reduxRouter: {
      path: '/search/data/:query'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.SEARCH_DATA}`,
    page: PAGES.SEARCH_DATA
  },
  dataset: {
    title: '',
    reduxRouter: {
      path: '/dataset'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.DATASETS}`,
    page: PAGES.DATASETS
  },
  detail: {
    title: '',
    reduxRouter: {
      path: '/map/detail'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART_DETAIL}`,
    page: PAGES.KAART_DETAIL
  },
  panorama: {
    title: 'Panorama',
    reduxRouter: {
      path: '/datasets/panorama/:id'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`,
    page: PAGES.PANORAMA
  },
  mapSearch: {
    title: 'Map search',
    reduxRouter: {
      path: '/data'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART_SEARCH}`,
    page: PAGES.KAART_SEARCH
  },
  mapEmbed: {
    title: 'Embed',
    reduxRouter: {
      path: '/map/embed'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.KAART_EMBED}`,
    page: PAGES.KAART_EMBED
  },
  nieuws: {
    title: '',
    reduxRouter: {
      path: '/nieuws'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.NIEUWS}`,
    page: PAGES.NIEUWS
  },
  help: {
    title: '',
    reduxRouter: {
      path: '/help'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.HELP}`,
    page: PAGES.HELP
  },
  proclaimer: {
    title: '',
    reduxRouter: {
      path: '/proclaimer'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.PROCLAIMER}`,
    page: PAGES.PROCLAIMER
  },

  bediening: {
    title: '',
    reduxRouter: {
      path: '/bediening#:deeplink?'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.BEDIENING}`,
    page: PAGES.BEDIENING
  },
  gegevens: {
    title: '',
    reduxRouter: {
      path: '/gegevens'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.GEGEVENS}`,
    page: PAGES.GEGEVENS
  },
  apis: {
    title: '',
    reduxRouter: {
      path: '/apis'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.OVER_API}`,
    page: PAGES.OVER_API
  },
  privacy_beveiliging: {
    title: '',
    reduxRouter: {
      path: '/privacy-en-informatiebeveiliging'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.PRIVACY_BEVEILIGING}`,
    page: PAGES.PRIVACY_BEVEILIGING
  },
  beschikbaar_kwaliteit: {
    title: '',
    reduxRouter: {
      path: '/beschikbaarheid-en-kwaliteit-data'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.BESCHIKBAAR_KWALITEIT}`,
    page: PAGES.BESCHIKBAAR_KWALITEIT
  },
  beheer_werkwijze: {
    title: '',
    reduxRouter: {
      path: '/technisch-beheer-en-werkwijze'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.BEHEER_WERKWIJZE}`,
    page: PAGES.BEHEER_WERKWIJZE
  },
  statistieken: {
    title: '',
    reduxRouter: {
      path: '/statistieken'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.STATISTIEKEN}`,
    page: PAGES.STATISTIEKEN
  },

  dataDetail: {
    title: 'Data detail',
    reduxRouter: {
      path: '/datasets/:type/:subtype/:id'
    },
    type: `${ROUTER_NAMESPACE}/${PAGES.DATA_DETAIL}`,
    page: PAGES.DATA_DETAIL
  }
};

// e.g. { home: '/' }, to be used by redux-first-router/connectRoutes
const routes = Object.keys(routing).reduce((acc, key) => {
  acc[routing[key].type] = routing[key].reduxRouter;
  return acc;
}, {});


// Action creators
export const toDetail = (id, type, subtype, view) => {
  const action = {
    type: routing.dataDetail.type,
    payload: {
      type,
      subtype,
      id: `id${id}`
    },
    meta: {
      query: {
      }
    }
  };
  if (view === DETAIL_VIEW.MAP) {
    action.meta.query.kaart = '';
  }
  return action;
};

export const toDataLocationSearch = () => ({
  type: routing.mapSearch.type
});

export const toMap = () => ({
  type: routing.map.type
});

export const toPanorama = (id, heading, view) => {
  const action = {
    type: routing.panorama.type,
    payload: {
      id
    },
    meta: {
      query: {
        heading
      }
    }
  };
  if (view === PANORAMA_VIEW.MAP) {
    action.meta.query.kaart = '';
  }
  if (view === PANORAMA_VIEW.PANO) {
    action.meta.query.panorama = '';
  }
  return action;
};

// Detail page logic
// TODO: refactor unit test or remove all together
export const extractIdEndpoint = (endpoint) => {
  const matches = endpoint.match(/\/([\w-]+)\/?$/);
  return matches[1];
};

const getDetailPageData = (endpoint) => {
  const matches = endpoint.match(/(\w+)\/([\w]+)\/([\w\.-]+)\/?$/); // eslint-disable-line no-useless-escape
  return {
    type: matches[1],
    subtype: matches[2],
    id: matches[3]
  };
};

export const getPageActionEndpoint = (endpoint, view) => {
  const { type, subtype, id } = getDetailPageData(endpoint);
  return toDetail(id, type, subtype, view);
};


export const pageTypeToEndpoint = (type, subtype, id) => {
  let endpoint = 'https://acc.api.data.amsterdam.nl/';
  endpoint += `${type}/${subtype}/${id}/`; // TODO: refactor, get back-end to return detail as detail GET not listing!
  return endpoint;
};

export default routes;
