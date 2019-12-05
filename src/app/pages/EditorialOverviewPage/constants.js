import PAGES from '../../pages'
import {
  toArticleDetail,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../store/redux-first-router/actions'
import { TYPES } from '../../../shared/config/cms.config'
import { articleSearchQuery, publicationSearchQuery } from '../SearchPage/constants.config'

export const EDITORIAL_TYPES = {
  [PAGES.ARTICLES]: TYPES.ARTICLE,
  [PAGES.ARTICLE_SEARCH]: TYPES.ARTICLE,
  [PAGES.PUBLICATIONS]: TYPES.PUBLICATION,
  [PAGES.PUBLICATION_SEARCH]: TYPES.PUBLICATION,
  [PAGES.SPECIALS]: TYPES.SPECIAL,
}

export const EDITORIAL_TITLES = {
  [TYPES.ARTICLE]: 'Artikelen',
  [TYPES.PUBLICATION]: 'Publicaties',
  [TYPES.SPECIAL]: 'In beeld',
}

export const EDITORIAL_DETAIL_ACTIONS = {
  [TYPES.ARTICLE]: toArticleDetail,
  [TYPES.PUBLICATION]: toPublicationDetail,
  [TYPES.SPECIAL]: toSpecialDetail,
}

export const GRAPHQL_CONFIG = {
  [PAGES.ARTICLES]: {
    resolver: 'articleSearch',
    query: articleSearchQuery,
  },
  [PAGES.PUBLICATIONS]: {
    resolver: 'publicationSearch',
    query: publicationSearchQuery,
  },
}

// Logic is that we don't show metadata in an editorial detail page
export const EDITORIAL_FIELD_TYPE_VALUES = {
  CONTENT: 'content',
}
