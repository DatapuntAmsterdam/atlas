import { Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Alert, Button, List, ListItem, Paragraph, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import type { MapDetails } from '../../legacy/services/map'
import { fetchDetailData, getServiceDefinition, toMapDetails } from '../../legacy/services/map'
import type {
  DetailResultItem,
  DetailResultItemGroupedItems,
  DetailResultItemPaginatedData,
  InfoBoxProps,
  PaginatedData as PaginatedDataType,
} from '../../legacy/types/details'
import { DetailResultItemType } from '../../legacy/types/details'
import { AuthError, ForbiddenError } from '../../../../../shared/services/api/customError'
import AuthAlert from '../../../../components/Alerts/AuthAlert'
import PromiseResult from '../../../../components/PromiseResult/PromiseResult'
import Spacer from '../../../../components/Spacer/Spacer'
import type { DataDetailParams } from '../../../../links'
import useAuthScope from '../../../../utils/useAuthScope'
import AuthenticationWrapper from '../AuthenticationWrapper'
import PanoramaPreview from '../PanoramaPreview/PanoramaPreview'
import { useMapContext } from '../../MapContext'
import DetailDefinitionList from './DetailDefinitionList'
import DetailHeading from './DetailHeading'
import DetailInfoBox from './DetailInfoBox'
import DetailLinkList from './DetailLinkList'
import DetailTable from './DetailTable'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import useAsyncMapPanelHeader from '../../utils/useAsyncMapPanelHeader'
import GeneralErrorAlert from '../../../../components/Alerts/GeneralErrorAlert'
import AuthScope from '../../../../../shared/services/api/authScope'
import LoginLink from '../../../../components/Links/LoginLink/LoginLink'
import useLegacyDataselectionConfig from '../../../../components/DataSelection/useLegacyDataselectionConfig'

const Message = styled(Paragraph)`
  margin: ${themeSpacing(4)} 0;
`

const ShowMoreButton = styled(Button)`
  margin-top: ${themeSpacing(1)};
`

const StyledAuthAlert = styled(AuthAlert)`
  order: -1; // Make sure the alert is always on top and not pushed down because of grid
`

const StyledImage = styled.img`
  width: 100%;
`

// Todo: remove gridArea when legacy map is removed
const ItemWrapper = styled.div<{ gridArea?: string }>`
  display: flex;
  flex-direction: column;
  ${({ gridArea }) =>
    gridArea &&
    css`
      grid-area: ${gridArea} !important;
    `}
`
const HeadingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${themeSpacing(7)};
`

const DetailPanel: FunctionComponent = () => {
  const { setDetailFeature, detailFeature } = useMapContext()
  const { isUserAuthorized } = useAuthScope()
  const { type, subtype: subType, id: rawId } = useParams<DataDetailParams>()
  const { currentDatasetConfig } = useLegacyDataselectionConfig()
  const id = rawId.includes('id') ? rawId.substr(2) : rawId

  async function getDetailData() {
    if (!type) {
      return Promise.reject()
    }
    const serviceDefinition = getServiceDefinition(`${type}/${subType}`)
    // Todo: Redirect to 404?
    if (!serviceDefinition) {
      return Promise.resolve(null)
    }

    const userIsAuthorized = isUserAuthorized(serviceDefinition.authScopes)

    if (!userIsAuthorized && serviceDefinition.authScopeRequired) {
      const error = new AuthError(401, serviceDefinition.authExcludedInfo || '')
      return Promise.reject(error)
    }

    const data = await fetchDetailData(serviceDefinition, id)
    const details = await toMapDetails(serviceDefinition, data, { id, type, subType })

    if (details.geometry) {
      setDetailFeature({
        id,
        type: 'Feature',
        geometry: details.geometry,
        properties: null,
      })
    } else {
      setDetailFeature(null)
    }

    return {
      ...details,
      showAuthAlert: !userIsAuthorized,
      authExcludedInfo: serviceDefinition.authExcludedInfo,
    }
  }

  useEffect(() => {
    return () => {
      setDetailFeature(null)
    }
  }, [])

  const results = usePromise(() => getDetailData(), [type, subType, id])
  useAsyncMapPanelHeader(
    results,
    isFulfilled(results) ? results.value?.data?.subTitle : null,
    isFulfilled(results) ? results.value?.data.title : null,
  )

  if (isRejected(results)) {
    if (results.reason instanceof AuthError || results.reason instanceof ForbiddenError) {
      return (
        <Alert level="info" dismissible>
          <Paragraph>
            {currentDatasetConfig?.AUTH_SCOPE === AuthScope.BrkRsn
              ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken.`
              : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken. `}
          </Paragraph>
          <LoginLink />
        </Alert>
      )
    }
    return <GeneralErrorAlert />
  }

  if (isPending(results)) {
    return <LoadingSpinner />
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return <RenderDetails showNoMapObjectsAlert={!detailFeature} details={results.value} />
}

interface GroupedItemsProps {
  item: DetailResultItemGroupedItems
}

const GroupedItems: FunctionComponent<GroupedItemsProps> = ({ item }) => (
  <>
    {item.entries.map((groupedItem) => (
      <Fragment key={groupedItem?.title}>
        {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
        <Item item={groupedItem} subItem />
        <Spacer />
      </Fragment>
    ))}
  </>
)

interface HeaderProps {
  subItem?: boolean
  title: string
  infoBox?: InfoBoxProps
}

const Header: FunctionComponent<HeaderProps> = ({ title, subItem, infoBox }) => (
  <HeadingWrapper>
    <DetailHeading styleAs={subItem ? 'h6' : 'h4'}>{title}</DetailHeading>
    {infoBox && <DetailInfoBox {...infoBox} />}
  </HeadingWrapper>
)

export interface ItemProps {
  item: DetailResultItem
  /**
   * Indicate if the Item to render is inside of an other component and thus the header should be lower in hierarchy
   */
  subItem?: boolean
  /**
   * In case of rendering an Item from PaginatedData component, we want to hide the header otherwise
   * it will render 2 times
   */
  hideHeader?: boolean
}

const Item: FunctionComponent<ItemProps> = ({ item, subItem, hideHeader }) => {
  const component = (() => {
    switch (item?.type) {
      case DetailResultItemType.DefinitionList:
        return <DetailDefinitionList entries={item.entries} />
      case DetailResultItemType.Table:
        return <DetailTable item={item} />
      case DetailResultItemType.LinkList:
        return <DetailLinkList item={item} />
      case DetailResultItemType.PaginatedData:
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return <PaginatedData item={item} />
      case DetailResultItemType.GroupedItems:
        return <GroupedItems item={item} />
      case DetailResultItemType.Image:
        return item.src ? (
          <StyledImage alt={item.title} src={item.src} />
        ) : (
          <Paragraph>Geen rollaag beschikbaar</Paragraph>
        )
      case DetailResultItemType.BulletList:
        return item?.entries?.length ? (
          <List variant="bullet">
            {item.entries.map((entry) => (
              <ListItem key={entry}>{entry}</ListItem>
            ))}
          </List>
        ) : (
          <Paragraph>Geen resultaat gevonden</Paragraph>
        )
      default:
        throw new Error('Unable to render map detail pane, encountered unknown item type.')
    }
  })()

  return (
    <>
      {item.title && !hideHeader && (
        <Header title={item.title} infoBox={item.infoBox} subItem={subItem} />
      )}
      <AuthenticationWrapper
        authScopes={item?.authScopes}
        excludedResults={item?.authExcludedInfo || item.title}
        authScopeRequired={item.authScopeRequired}
        specialAuthLevel={item.specialAuthLevel}
      >
        {() => component}
      </AuthenticationWrapper>
    </>
  )
}

interface PaginatedResultProps {
  result: PaginatedDataType<any>
  pageSize: number
  setPaginatedUrl: (number: number) => void
  item: DetailResultItemPaginatedData
}

// Unfortunately we cannot use "-1", as apparently wont work for some API's
const INFINITE_PAGE_SIZE = 999

const PaginatedResult: FunctionComponent<PaginatedResultProps> = ({
  result,
  pageSize,
  setPaginatedUrl,
  item,
}) => {
  const resultItem = item.toView(result.data)
  const showMoreButton = result.count > result.data?.length ?? pageSize === INFINITE_PAGE_SIZE
  const showMoreText = `Toon alle ${result.count} ${
    resultItem?.title ? resultItem.title.toLocaleLowerCase() : 'resultaten'
  }`
  const showLessText = 'Toon minder'
  const showMore = pageSize !== INFINITE_PAGE_SIZE

  return (
    <>
      <Item item={resultItem} hideHeader />
      {showMoreButton && (
        <ShowMoreButton
          variant="textButton"
          iconSize={12}
          iconLeft={showMore ? <Enlarge /> : <Minimise />}
          onClick={() => {
            setPaginatedUrl(showMore ? INFINITE_PAGE_SIZE : item.pageSize)
          }}
        >
          {showMore ? showMoreText : showLessText}
        </ShowMoreButton>
      )}
    </>
  )
}

interface PaginatedDataProps {
  item: DetailResultItemPaginatedData
}

const PaginatedData: FunctionComponent<PaginatedDataProps> = ({ item }) => {
  const [pageSize, setPaginatedUrl] = useState(item.pageSize)

  return (
    <PromiseResult factory={() => item.getData(undefined, pageSize)} deps={[pageSize]}>
      {(result) => {
        if (!result.value) {
          return null
        }

        return (
          <PaginatedResult
            result={result.value}
            pageSize={pageSize}
            item={item}
            setPaginatedUrl={setPaginatedUrl}
          />
        )
      }}
    </PromiseResult>
  )
}

export interface RenderDetailsProps {
  details: (MapDetails & { showAuthAlert: boolean; authExcludedInfo?: string }) | null
  showNoMapObjectsAlert?: boolean
}

const RenderDetails: FunctionComponent<RenderDetailsProps> = ({
  details,
  showNoMapObjectsAlert,
}) => {
  const { setInfoBox } = useMapContext()
  useEffect(() => {
    if (details?.data.infoBox) {
      setInfoBox(details?.data.infoBox)
    }
    return () => {
      setInfoBox(undefined)
    }
  }, [details, setInfoBox])
  if (!details) {
    // Todo: redirect to 404?
    return <Message>Geen detailweergave beschikbaar.</Message>
  }
  return (
    <>
      {showNoMapObjectsAlert === true && (
        <Alert level="warning" dismissible>
          Er zijn geen resultaten op de kaart bij dit object
        </Alert>
      )}
      {details.showAuthAlert && <StyledAuthAlert excludedResults={details.authExcludedInfo} />}
      {/* eslint-disable-next-line no-nested-ternary */}
      {details.location && !details.data.noPanorama ? (
        <PanoramaPreview location={details.location} radius={180} aspect={2.5} />
      ) : null}
      <Spacer />
      {details.data.notifications?.map((notification) => (
        <Fragment key={notification.id}>
          <Alert level={notification.level} dismissible={notification.canClose}>
            {notification.value}
          </Alert>
          <Spacer />
        </Fragment>
      ))}
      {details.data.items.map((item) => {
        if (!item) {
          return null
        }

        return (
          <ItemWrapper key={item.title} className={item.type} gridArea={item.gridArea}>
            <Item item={item} />
            <Spacer />
          </ItemWrapper>
        )
      })}
    </>
  )
}

export default DetailPanel
