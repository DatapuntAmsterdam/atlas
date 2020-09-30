import NotificationLevel from '../../app/models/notification'
import { InfoBoxProps } from '../../app/pages/MapPage/detail/DetailInfoBox'

// TODO: Revisit the type information here once the map services have been made type safe (also come up with shorter names).

export interface DetailResult {
  title: string
  substring?: string
  subTitle?: string
  authScope?: string
  items: DetailResultItem[]
  notifications?: DetailResultNotification[]
  meta?: any[]
  infobox?: InfoBoxProps
}

export interface DetailResultNotification {
  value: string
  level: NotificationLevel
  canClose?: boolean
}

export enum DetailResultItemType {
  Default = 'default',
  DefinitionList = 'definition-list',
  Table = 'table',
  LinkList = 'link-list',
  DataProvider = 'data-provider',
  Heading = 'heading',
  PaginatedData = 'paginated-data',
  ShowInTable = 'show-in-table',
}

export type DetailResultItem =
  | DetailResultItemDefault
  | DetailResultItemDefinitionList
  | DetailResultItemLinkList
  | DetailResultItemTable
  | DetailResultItemHeading
  | DetailResultItemShowInTable
  | DetailResultItemPaginatedData

export type Link = { url: string; title: string; external?: boolean }

export type PaginatedData<T> = {
  data: T
  count: number
  next: string | null
  previous: string | null
}

export interface DefaultDetailResultItem {
  infoBox?: InfoBoxProps
  // Todo: remove gridArea when legacy map is removed
  gridArea?: string
  title?: string | null
}

// TODO: Drop 'DetailResultItemDefault' in favor of 'DetailResultItemDefinitionList'
export interface DetailResultItemDefault {
  type: DetailResultItemType.Default
  title?: string | null
  value?: string | number | boolean | Date | DetailResultItemDefault[]
  link?: string
  status?: string
}

export interface DetailResultItemDefinitionList extends DefaultDetailResultItem {
  type: DetailResultItemType.DefinitionList

  entries: DetailResultItemDefinitionListEntry[]
}

export interface DetailResultItemPaginatedData extends DefaultDetailResultItem {
  type: DetailResultItemType.PaginatedData
  getData: (url?: string, pageSize?: number) => Promise<PaginatedData<any> | null>
  pageSize: number
  toView: (data: any) => DetailResultItem
}

export interface DetailResultItemLinkList extends DefaultDetailResultItem {
  type: DetailResultItemType.LinkList
  links: Link[]
}

export interface DetailResultItemDefinitionListEntry {
  term: string
  description: string
  link?: string
}

export interface DetailResultItemTable extends DefaultDetailResultItem {
  type: DetailResultItemType.Table
  headings: DetailResultItemTableHeading[]
  values: DetailResultItemTableValue[]
}

export interface DetailResultItemTableHeading extends DefaultDetailResultItem {
  key: string
}

export type DetailResultItemTableValue = { [key: string]: any }

export interface DetailResultItemHeading extends DefaultDetailResultItem {
  type: DetailResultItemType.Heading
}

export interface DetailResultItemShowInTable extends DefaultDetailResultItem {
  type: DetailResultItemType.ShowInTable
  filters: {
    key: string
    value: string
  }
}

// Api

interface ApiLinkObject {
  self: {
    href: string
  }
}

interface ApiPaginateLinkObject extends ApiLinkObject {
  next: {
    href?: string
  }
  previous: {
    href?: string
  }
}

export interface BouwblokkenResolvedResult {
  count: number
  results: Array<{ dataset: string; id: string; _display: string; _links: ApiLinkObject }>
  _links: ApiPaginateLinkObject
}
