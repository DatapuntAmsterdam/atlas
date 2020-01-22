const PAGES = {
  HOME: 'HOME',
  ADDRESSES: 'ADDRESSES',
  ESTABLISHMENTS: 'ESTABLISHMENTS',
  CADASTRAL_OBJECTS: 'CADASTRAL_OBJECTS',
  PANORAMA: 'PANORAMA',

  DATASETS: 'DATASETS',
  DATASET_DETAIL: 'DATASET_DETAIL',
  DATASET_SEARCH: 'DATASET_SEARCH',

  DATA: 'DATA',
  DATA_DETAIL: 'DATA_DETAIL',
  DATA_SEARCH: 'DATA_SEARCH',
  DATA_SEARCH_GEO: 'DATA_SEARCH_GEO',
  DATA_SEARCH_CATEGORY: 'SEARCH_DATA_CATEGORY',

  SEARCH: 'SEARCH',

  CONSTRUCTION_FILE: 'CONSTRUCTION_FILE',

  // cms pages
  ARTICLES: 'ARTICLES',
  ARTICLE_DETAIL: 'ARTICLE_DETAIL',
  ARTICLE_SEARCH: 'ARTICLE_SEARCH',
  SPECIAL_SEARCH: 'SPECIALS_SEARCH',
  SPECIALS: 'SPECIALS',
  SPECIAL_DETAIL: 'SPECIAL_DETAIL',
  PUBLICATIONS: 'PUBLICATIONS',
  PUBLICATION_DETAIL: 'PUBLICATION_DETAIL',
  PUBLICATION_SEARCH: 'PUBLICATION_SEARCH',

  // text pages
  ACTUALITY: 'ACTUALITY',
  LOGIN: 'LOGIN',

  MOVED: 'MOVED',
  NOT_FOUND: 'NOT_FOUND',
}

export default PAGES

export const isContentPage = page =>
  page === PAGES.ACTUALITY ||
  page === PAGES.LOGIN ||
  page === PAGES.MOVED ||
  page === PAGES.NOT_FOUND

export const isEditorialDetailPage = page =>
  page === PAGES.ARTICLE_DETAIL ||
  page === PAGES.PUBLICATION_DETAIL ||
  page === PAGES.SPECIAL_DETAIL

export const isEditorialOverviewPage = page =>
  page === PAGES.ARTICLES || page === PAGES.PUBLICATIONS || page === PAGES.SPECIALS

export const isEditorialPage = page => isEditorialDetailPage(page) || isEditorialOverviewPage(page)

export const isMapSplitPage = page =>
  page === PAGES.DATA ||
  page === PAGES.PANORAMA ||
  page === PAGES.DATA_DETAIL ||
  page === PAGES.ADDRESSES ||
  page === PAGES.ESTABLISHMENTS ||
  page === PAGES.DATA_SEARCH_GEO ||
  page === PAGES.CADASTRAL_OBJECTS

export const isSearchPage = page =>
  page === PAGES.SEARCH ||
  page === PAGES.DATA_SEARCH ||
  page === PAGES.DATASET_SEARCH ||
  page === PAGES.ARTICLE_SEARCH ||
  page === PAGES.PUBLICATION_SEARCH ||
  page === PAGES.SPECIAL_SEARCH

export const isDatasetPage = page => page === PAGES.DATASETS || page === PAGES.DATASET_SEARCH
