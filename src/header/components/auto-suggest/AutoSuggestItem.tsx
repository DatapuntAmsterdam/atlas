import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import escapeStringRegexp from 'escape-string-regexp'
import { LocationDescriptorObject } from 'history'
import { FunctionComponent, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import {
  toArticleDetail,
  toCollectionDetail,
  toDataDetail,
  toDatasetDetail,
  toPublicationDetail,
  toSpecialDetail,
} from '../../../app/links'
import { SearchType } from '../../../app/pages/SearchPage/constants'
import { routing } from '../../../app/routes'
import toSlug from '../../../app/utils/toSlug'
import { CmsType } from '../../../shared/config/cms.config'
import { getViewMode, ViewMode } from '../../../shared/ducks/ui/ui'
import PARAMETERS from '../../../store/parameters'
import { decodeLayers } from '../../../store/queryParameters'
import { extractIdEndpoint, getDetailPageData } from '../../../store/redux-first-router/actions'
import { AutoSuggestSearchContent } from '../../services/auto-suggest/auto-suggest'

export interface AutoSuggestItemProps {
  content: string
  suggestion: AutoSuggestSearchContent
  highlightValue: string
  inputValue: string
  label: string
}

const StyledLink = styled(Link)`
  font-weight: inherit;
  margin-left: ${themeSpacing(1)};
`

const AutoSuggestItem: FunctionComponent<AutoSuggestItemProps> = ({
  content,
  suggestion,
  highlightValue,
  inputValue,
  label,
}) => {
  const view = useSelector(getViewMode)
  const { trackEvent } = useMatomo()

  const openEditorialSuggestion = (
    { id, slug }: { id: string; slug: string },
    type: string,
    subType: string,
  ) => {
    switch (type) {
      case CmsType.Article:
        return toArticleDetail(id, slug)
      case CmsType.Collection:
        return toCollectionDetail(id, slug)
      case CmsType.Publication:
        return toPublicationDetail(id, slug)
      case CmsType.Special:
        return toSpecialDetail(id, subType, slug)
      default:
        throw new Error(`Unable to open editorial suggestion, unknown type '${type}'.`)
    }
  }

  const to: LocationDescriptorObject = useMemo(() => {
    if (suggestion.type === SearchType.Dataset) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = toSlug(suggestion.label)

      return {
        ...toDatasetDetail({ id, slug }),
        search: new URLSearchParams({
          [PARAMETERS.QUERY]: `${inputValue}`,
        }).toString(),
      }
    }

    if (
      // Suggestion coming from the cms
      suggestion.type === CmsType.Article ||
      suggestion.type === CmsType.Publication ||
      suggestion.type === CmsType.Collection ||
      suggestion.type === CmsType.Special
    ) {
      const [, , id] = extractIdEndpoint(suggestion.uri)
      const slug = toSlug(suggestion.label)

      let subType = ''

      if (suggestion.type === CmsType.Special) {
        const match = /\(([^()]*)\)$/.exec(suggestion.label)

        if (match) {
          ;[, subType] = match
        }
      }

      return {
        ...openEditorialSuggestion({ id, slug }, suggestion.type, subType),
        search: new URLSearchParams({
          [PARAMETERS.QUERY]: `${inputValue}`,
        }).toString(),
      }
    }

    if (suggestion.type === SearchType.Map) {
      const { searchParams } = new URL(suggestion.uri, window.location.origin)

      return {
        pathname: routing.data.path,
        search: new URLSearchParams({
          [PARAMETERS.VIEW]: ViewMode.Map,
          [PARAMETERS.QUERY]: `${inputValue}`,
          [PARAMETERS.LEGEND]: 'true',
          [PARAMETERS.LAYERS]: searchParams.get(PARAMETERS.LAYERS) || '',
        }).toString(),
      }
    }

    const { type, subtype, id } = getDetailPageData(suggestion.uri)
    const currentSearchParams = new URLSearchParams(window.location.search)

    // suggestion.category TRACK
    return {
      ...toDataDetail({ type, subtype, id }),
      search: new URLSearchParams({
        [PARAMETERS.VIEW]: view,
        [PARAMETERS.QUERY]: `${inputValue}`,
        [PARAMETERS.LAYERS]: currentSearchParams.get(PARAMETERS.LAYERS) || '',
      }).toString(),
    }
  }, [extractIdEndpoint, openEditorialSuggestion, decodeLayers, highlightValue])

  const htmlContent = useMemo(
    () => highlightSuggestion(content, highlightValue),
    [content, highlightValue],
  )

  return (
    <li>
      <StyledLink
        forwardedAs={RouterLink}
        inList
        className="auto-suggest__dropdown-item"
        onClick={() => {
          trackEvent({
            category: 'auto-suggest',
            name: content,
            action: label,
          })
        }}
        to={to}
      >
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: htmlContent,
          }}
        />
      </StyledLink>
    </li>
  )
}

function highlightSuggestion(content: string, highlightValue: string) {
  return content.replace(
    new RegExp(`(${escapeStringRegexp(highlightValue.trim())})`, 'gi'),
    '<span class="auto-suggest__dropdown__highlight">$1</span>',
  )
}

export default AutoSuggestItem
