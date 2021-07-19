/* eslint-disable */
import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CmsLink = {
  __typename?: 'CMSLink';
  uri: Scalars['String'];
};

export type CmsResult = {
  __typename?: 'CMSResult';
  id?: Maybe<Scalars['ID']>;
  type: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  teaserImage?: Maybe<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  specialType?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  teaser?: Maybe<Scalars['String']>;
  dateLocale?: Maybe<Scalars['String']>;
  link?: Maybe<CmsLink>;
};

export type CmsSearchInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  types?: Maybe<Array<Scalars['String']>>;
  filters?: Maybe<Array<FilterInput>>;
  sort?: Maybe<CmsSortInput>;
};

export type CmsSearchResult = SearchResult & {
  __typename?: 'CMSSearchResult';
  totalCount: Scalars['Int'];
  results?: Maybe<Array<CmsResult>>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

export type CmsSortInput = {
  field: Scalars['String'];
  order: Scalars['String'];
};

export type CombinedDataResult = CombinedResult & {
  __typename?: 'CombinedDataResult';
  count: Scalars['Int'];
  type: Scalars['String'];
  label: Scalars['String'];
  results?: Maybe<Array<DataResult>>;
  reason?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type CombinedMapResult = CombinedResult & {
  __typename?: 'CombinedMapResult';
  count: Scalars['Int'];
  type: Scalars['String'];
  label: Scalars['String'];
  results: Array<MapResult>;
};

export type CombinedResult = {
  count: Scalars['Int'];
  type: Scalars['String'];
  label: Scalars['String'];
};

export type DataResult = {
  __typename?: 'DataResult';
  id?: Maybe<Scalars['ID']>;
  type: Scalars['String'];
  label?: Maybe<Scalars['String']>;
  subtype?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  datasetdataset?: Maybe<Scalars['String']>;
};

export type DataSearchInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  filters?: Maybe<Array<FilterInput>>;
};

export type DataSearchResult = SearchResult & {
  __typename?: 'DataSearchResult';
  totalCount: Scalars['Int'];
  results: Array<CombinedDataResult>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

export type DatasetFormats = {
  __typename?: 'DatasetFormats';
  name: Scalars['String'];
  count: Scalars['Int'];
};

export type DatasetResult = {
  __typename?: 'DatasetResult';
  header: Scalars['String'];
  description: Scalars['String'];
  teaser: Scalars['String'];
  modified: Scalars['String'];
  tags: Array<Scalars['String']>;
  id: Scalars['String'];
  formats: Array<DatasetFormats>;
  distributionTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type DatasetSearchInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  filters?: Maybe<Array<FilterInput>>;
};

export type DatasetSearchResult = SearchResult & {
  __typename?: 'DatasetSearchResult';
  totalCount: Scalars['Int'];
  results?: Maybe<Array<DatasetResult>>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

export type DetailParams = {
  __typename?: 'DetailParams';
  item?: Maybe<Scalars['String']>;
  datasets?: Maybe<Scalars['String']>;
};

export type Filter = {
  __typename?: 'Filter';
  type: Scalars['String'];
  label: Scalars['String'];
  options: Array<FilterOption>;
  filterType: Scalars['String'];
};

export type FilterInput = {
  type: Scalars['String'];
  values: Array<Scalars['String']>;
};

export type FilterOption = {
  __typename?: 'FilterOption';
  id: Scalars['String'];
  label: Scalars['String'];
  count?: Maybe<Scalars['Int']>;
};

export type LegendItem = {
  __typename?: 'LegendItem';
  id: Scalars['ID'];
  isVisible?: Maybe<Scalars['Boolean']>;
  title: Scalars['String'];
  iconUrl?: Maybe<Scalars['String']>;
  imageRule?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  notSelectable: Scalars['Boolean'];
  legendIconURI?: Maybe<Scalars['String']>;
};

export type MapCollection = {
  __typename?: 'MapCollection';
  id: Scalars['ID'];
  title: Scalars['String'];
  mapLayers: Array<MapGroup>;
  meta: Meta;
  href: Scalars['String'];
};

export type MapCollectionSearchResult = SearchResult & {
  __typename?: 'MapCollectionSearchResult';
  totalCount: Scalars['Int'];
  results: Array<MapCollection>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

export type MapGroup = {
  __typename?: 'MapGroup';
  id: Scalars['ID'];
  title: Scalars['String'];
  type: Scalars['String'];
  noDetail: Scalars['Boolean'];
  minZoom: Scalars['Int'];
  layers?: Maybe<Array<Scalars['String']>>;
  url?: Maybe<Scalars['String']>;
  params?: Maybe<Scalars['String']>;
  detailUrl?: Maybe<Scalars['String']>;
  detailParams?: Maybe<DetailParams>;
  detailIsShape?: Maybe<Scalars['Boolean']>;
  iconUrl?: Maybe<Scalars['String']>;
  imageRule?: Maybe<Scalars['String']>;
  notSelectable: Scalars['Boolean'];
  external?: Maybe<Scalars['Boolean']>;
  bounds?: Maybe<Array<Array<Scalars['Float']>>>;
  authScope?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  legendItems?: Maybe<Array<MapGroupLegendItem>>;
  meta: Meta;
  href: Scalars['String'];
  legendIconURI?: Maybe<Scalars['String']>;
};

export type MapGroupLegendItem = MapGroup | LegendItem;

export type MapLayerSearchResult = SearchResult & {
  __typename?: 'MapLayerSearchResult';
  totalCount: Scalars['Int'];
  results: Array<MapGroup>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

/** MapResult is a combination of MapGroups and MapCollection */
export type MapResult = {
  __typename?: 'MapResult';
  id: Scalars['ID'];
  title: Scalars['String'];
  mapLayers?: Maybe<Array<MapGroup>>;
  meta: Meta;
  href: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  noDetail?: Maybe<Scalars['Boolean']>;
  minZoom?: Maybe<Scalars['Int']>;
  layers?: Maybe<Array<Scalars['String']>>;
  url?: Maybe<Scalars['String']>;
  params?: Maybe<Scalars['String']>;
  detailUrl?: Maybe<Scalars['String']>;
  detailParams?: Maybe<DetailParams>;
  detailIsShape?: Maybe<Scalars['Boolean']>;
  iconUrl?: Maybe<Scalars['String']>;
  imageRule?: Maybe<Scalars['String']>;
  notSelectable?: Maybe<Scalars['Boolean']>;
  external?: Maybe<Scalars['Boolean']>;
  bounds?: Maybe<Array<Array<Scalars['Float']>>>;
  authScope?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  legendItems?: Maybe<Array<LegendItem>>;
};

export type MapSearchInput = {
  limit?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  filters?: Maybe<Array<FilterInput>>;
};

export type MapSearchResult = SearchResult & {
  __typename?: 'MapSearchResult';
  totalCount: Scalars['Int'];
  results: Array<CombinedMapResult>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

export type Meta = {
  __typename?: 'Meta';
  themes: Array<Theme>;
  thumbnail?: Maybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  totalPages: Scalars['Int'];
  hasLimitedResults?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  articleSearch?: Maybe<CmsSearchResult>;
  dataSearch?: Maybe<DataSearchResult>;
  datasetSearch?: Maybe<DatasetSearchResult>;
  publicationSearch?: Maybe<CmsSearchResult>;
  specialSearch?: Maybe<CmsSearchResult>;
  collectionSearch?: Maybe<CmsSearchResult>;
  mapCollectionSearch: MapCollectionSearchResult;
  mapLayerSearch: MapLayerSearchResult;
  mapSearch: MapSearchResult;
  filters?: Maybe<Array<Maybe<Filter>>>;
};


export type QueryArticleSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<CmsSearchInput>;
};


export type QueryDataSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<DataSearchInput>;
};


export type QueryDatasetSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<DatasetSearchInput>;
};


export type QueryPublicationSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<CmsSearchInput>;
};


export type QuerySpecialSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<CmsSearchInput>;
};


export type QueryCollectionSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<CmsSearchInput>;
};


export type QueryMapCollectionSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<MapSearchInput>;
};


export type QueryMapLayerSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<MapSearchInput>;
};


export type QueryMapSearchArgs = {
  q?: Maybe<Scalars['String']>;
  input?: Maybe<MapSearchInput>;
};

export type Results = DatasetResult | CmsResult | CombinedDataResult | MapGroup | MapCollection | CombinedMapResult;

export type SearchResult = {
  totalCount: Scalars['Int'];
  /** TODO: See if results can be made required. */
  results?: Maybe<Array<Results>>;
  filters?: Maybe<Array<Filter>>;
  pageInfo: PageInfo;
};

export type Theme = {
  __typename?: 'Theme';
  id: Scalars['ID'];
  title: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CMSLink: ResolverTypeWrapper<CmsLink>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CMSResult: ResolverTypeWrapper<CmsResult>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CMSSearchInput: CmsSearchInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  CMSSearchResult: ResolverTypeWrapper<CmsSearchResult>;
  CMSSortInput: CmsSortInput;
  CombinedDataResult: ResolverTypeWrapper<CombinedDataResult>;
  CombinedMapResult: ResolverTypeWrapper<CombinedMapResult>;
  CombinedResult: ResolversTypes['CombinedDataResult'] | ResolversTypes['CombinedMapResult'];
  DataResult: ResolverTypeWrapper<DataResult>;
  DataSearchInput: DataSearchInput;
  DataSearchResult: ResolverTypeWrapper<DataSearchResult>;
  DatasetFormats: ResolverTypeWrapper<DatasetFormats>;
  DatasetResult: ResolverTypeWrapper<DatasetResult>;
  DatasetSearchInput: DatasetSearchInput;
  DatasetSearchResult: ResolverTypeWrapper<DatasetSearchResult>;
  DetailParams: ResolverTypeWrapper<DetailParams>;
  Filter: ResolverTypeWrapper<Filter>;
  FilterInput: FilterInput;
  FilterOption: ResolverTypeWrapper<FilterOption>;
  LegendItem: ResolverTypeWrapper<LegendItem>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  MapCollection: ResolverTypeWrapper<MapCollection>;
  MapCollectionSearchResult: ResolverTypeWrapper<MapCollectionSearchResult>;
  MapGroup: ResolverTypeWrapper<Omit<MapGroup, 'legendItems'> & { legendItems?: Maybe<Array<ResolversTypes['MapGroupLegendItem']>> }>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  MapGroupLegendItem: ResolversTypes['MapGroup'] | ResolversTypes['LegendItem'];
  MapLayerSearchResult: ResolverTypeWrapper<MapLayerSearchResult>;
  MapResult: ResolverTypeWrapper<MapResult>;
  MapSearchInput: MapSearchInput;
  MapSearchResult: ResolverTypeWrapper<MapSearchResult>;
  Meta: ResolverTypeWrapper<Meta>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  Results: ResolversTypes['DatasetResult'] | ResolversTypes['CMSResult'] | ResolversTypes['CombinedDataResult'] | ResolversTypes['MapGroup'] | ResolversTypes['MapCollection'] | ResolversTypes['CombinedMapResult'];
  SearchResult: ResolversTypes['CMSSearchResult'] | ResolversTypes['DataSearchResult'] | ResolversTypes['DatasetSearchResult'] | ResolversTypes['MapCollectionSearchResult'] | ResolversTypes['MapLayerSearchResult'] | ResolversTypes['MapSearchResult'];
  Theme: ResolverTypeWrapper<Theme>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CMSLink: CmsLink;
  String: Scalars['String'];
  CMSResult: CmsResult;
  ID: Scalars['ID'];
  CMSSearchInput: CmsSearchInput;
  Int: Scalars['Int'];
  CMSSearchResult: CmsSearchResult;
  CMSSortInput: CmsSortInput;
  CombinedDataResult: CombinedDataResult;
  CombinedMapResult: CombinedMapResult;
  CombinedResult: ResolversParentTypes['CombinedDataResult'] | ResolversParentTypes['CombinedMapResult'];
  DataResult: DataResult;
  DataSearchInput: DataSearchInput;
  DataSearchResult: DataSearchResult;
  DatasetFormats: DatasetFormats;
  DatasetResult: DatasetResult;
  DatasetSearchInput: DatasetSearchInput;
  DatasetSearchResult: DatasetSearchResult;
  DetailParams: DetailParams;
  Filter: Filter;
  FilterInput: FilterInput;
  FilterOption: FilterOption;
  LegendItem: LegendItem;
  Boolean: Scalars['Boolean'];
  MapCollection: MapCollection;
  MapCollectionSearchResult: MapCollectionSearchResult;
  MapGroup: Omit<MapGroup, 'legendItems'> & { legendItems?: Maybe<Array<ResolversParentTypes['MapGroupLegendItem']>> };
  Float: Scalars['Float'];
  MapGroupLegendItem: ResolversParentTypes['MapGroup'] | ResolversParentTypes['LegendItem'];
  MapLayerSearchResult: MapLayerSearchResult;
  MapResult: MapResult;
  MapSearchInput: MapSearchInput;
  MapSearchResult: MapSearchResult;
  Meta: Meta;
  PageInfo: PageInfo;
  Query: {};
  Results: ResolversParentTypes['DatasetResult'] | ResolversParentTypes['CMSResult'] | ResolversParentTypes['CombinedDataResult'] | ResolversParentTypes['MapGroup'] | ResolversParentTypes['MapCollection'] | ResolversParentTypes['CombinedMapResult'];
  SearchResult: ResolversParentTypes['CMSSearchResult'] | ResolversParentTypes['DataSearchResult'] | ResolversParentTypes['DatasetSearchResult'] | ResolversParentTypes['MapCollectionSearchResult'] | ResolversParentTypes['MapLayerSearchResult'] | ResolversParentTypes['MapSearchResult'];
  Theme: Theme;
};

export type CmsLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSLink'] = ResolversParentTypes['CMSLink']> = {
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CmsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSResult'] = ResolversParentTypes['CMSResult']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teaserImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  specialType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  file?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  intro?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  teaser?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dateLocale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['CMSLink']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CmsSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CMSSearchResult'] = ResolversParentTypes['CMSSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['CMSResult']>>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedDataResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedDataResult'] = ResolversParentTypes['CombinedDataResult']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['DataResult']>>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedMapResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedMapResult'] = ResolversParentTypes['CombinedMapResult']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['MapResult']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CombinedResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CombinedResult'] = ResolversParentTypes['CombinedResult']> = {
  __resolveType: TypeResolveFn<'CombinedDataResult' | 'CombinedMapResult', ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type DataResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataResult'] = ResolversParentTypes['DataResult']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subtype?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endpoint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  datasetdataset?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DataSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataSearchResult'] = ResolversParentTypes['DataSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['CombinedDataResult']>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatasetFormatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetFormats'] = ResolversParentTypes['DatasetFormats']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatasetResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetResult'] = ResolversParentTypes['DatasetResult']> = {
  header?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teaser?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modified?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  formats?: Resolver<Array<ResolversTypes['DatasetFormats']>, ParentType, ContextType>;
  distributionTypes?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatasetSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DatasetSearchResult'] = ResolversParentTypes['DatasetSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['DatasetResult']>>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DetailParamsResolvers<ContextType = any, ParentType extends ResolversParentTypes['DetailParams'] = ResolversParentTypes['DetailParams']> = {
  item?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  datasets?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterResolvers<ContextType = any, ParentType extends ResolversParentTypes['Filter'] = ResolversParentTypes['Filter']> = {
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['FilterOption']>, ParentType, ContextType>;
  filterType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FilterOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FilterOption'] = ResolversParentTypes['FilterOption']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LegendItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['LegendItem'] = ResolversParentTypes['LegendItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isVisible?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notSelectable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  legendIconURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapCollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapCollection'] = ResolversParentTypes['MapCollection']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mapLayers?: Resolver<Array<ResolversTypes['MapGroup']>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapCollectionSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapCollectionSearchResult'] = ResolversParentTypes['MapCollectionSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['MapCollection']>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapGroup'] = ResolversParentTypes['MapGroup']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noDetail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  minZoom?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailParams?: Resolver<Maybe<ResolversTypes['DetailParams']>, ParentType, ContextType>;
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notSelectable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>;
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  legendItems?: Resolver<Maybe<Array<ResolversTypes['MapGroupLegendItem']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  legendIconURI?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapGroupLegendItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapGroupLegendItem'] = ResolversParentTypes['MapGroupLegendItem']> = {
  __resolveType: TypeResolveFn<'MapGroup' | 'LegendItem', ParentType, ContextType>;
};

export type MapLayerSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapLayerSearchResult'] = ResolversParentTypes['MapLayerSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['MapGroup']>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapResult'] = ResolversParentTypes['MapResult']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mapLayers?: Resolver<Maybe<Array<ResolversTypes['MapGroup']>>, ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['Meta'], ParentType, ContextType>;
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  noDetail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  minZoom?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  layers?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  params?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  detailParams?: Resolver<Maybe<ResolversTypes['DetailParams']>, ParentType, ContextType>;
  detailIsShape?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  iconUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageRule?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notSelectable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  external?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  bounds?: Resolver<Maybe<Array<Array<ResolversTypes['Float']>>>, ParentType, ContextType>;
  authScope?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  legendItems?: Resolver<Maybe<Array<ResolversTypes['LegendItem']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MapSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MapSearchResult'] = ResolversParentTypes['MapSearchResult']> = {
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Array<ResolversTypes['CombinedMapResult']>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']> = {
  themes?: Resolver<Array<ResolversTypes['Theme']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  totalPages?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  hasLimitedResults?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  articleSearch?: Resolver<Maybe<ResolversTypes['CMSSearchResult']>, ParentType, ContextType, RequireFields<QueryArticleSearchArgs, never>>;
  dataSearch?: Resolver<Maybe<ResolversTypes['DataSearchResult']>, ParentType, ContextType, RequireFields<QueryDataSearchArgs, never>>;
  datasetSearch?: Resolver<Maybe<ResolversTypes['DatasetSearchResult']>, ParentType, ContextType, RequireFields<QueryDatasetSearchArgs, never>>;
  publicationSearch?: Resolver<Maybe<ResolversTypes['CMSSearchResult']>, ParentType, ContextType, RequireFields<QueryPublicationSearchArgs, never>>;
  specialSearch?: Resolver<Maybe<ResolversTypes['CMSSearchResult']>, ParentType, ContextType, RequireFields<QuerySpecialSearchArgs, never>>;
  collectionSearch?: Resolver<Maybe<ResolversTypes['CMSSearchResult']>, ParentType, ContextType, RequireFields<QueryCollectionSearchArgs, never>>;
  mapCollectionSearch?: Resolver<ResolversTypes['MapCollectionSearchResult'], ParentType, ContextType, RequireFields<QueryMapCollectionSearchArgs, never>>;
  mapLayerSearch?: Resolver<ResolversTypes['MapLayerSearchResult'], ParentType, ContextType, RequireFields<QueryMapLayerSearchArgs, never>>;
  mapSearch?: Resolver<ResolversTypes['MapSearchResult'], ParentType, ContextType, RequireFields<QueryMapSearchArgs, never>>;
  filters?: Resolver<Maybe<Array<Maybe<ResolversTypes['Filter']>>>, ParentType, ContextType>;
};

export type ResultsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Results'] = ResolversParentTypes['Results']> = {
  __resolveType: TypeResolveFn<'DatasetResult' | 'CMSResult' | 'CombinedDataResult' | 'MapGroup' | 'MapCollection' | 'CombinedMapResult', ParentType, ContextType>;
};

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = {
  __resolveType: TypeResolveFn<'CMSSearchResult' | 'DataSearchResult' | 'DatasetSearchResult' | 'MapCollectionSearchResult' | 'MapLayerSearchResult' | 'MapSearchResult', ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  results?: Resolver<Maybe<Array<ResolversTypes['Results']>>, ParentType, ContextType>;
  filters?: Resolver<Maybe<Array<ResolversTypes['Filter']>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
};

export type ThemeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Theme'] = ResolversParentTypes['Theme']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CMSLink?: CmsLinkResolvers<ContextType>;
  CMSResult?: CmsResultResolvers<ContextType>;
  CMSSearchResult?: CmsSearchResultResolvers<ContextType>;
  CombinedDataResult?: CombinedDataResultResolvers<ContextType>;
  CombinedMapResult?: CombinedMapResultResolvers<ContextType>;
  CombinedResult?: CombinedResultResolvers<ContextType>;
  DataResult?: DataResultResolvers<ContextType>;
  DataSearchResult?: DataSearchResultResolvers<ContextType>;
  DatasetFormats?: DatasetFormatsResolvers<ContextType>;
  DatasetResult?: DatasetResultResolvers<ContextType>;
  DatasetSearchResult?: DatasetSearchResultResolvers<ContextType>;
  DetailParams?: DetailParamsResolvers<ContextType>;
  Filter?: FilterResolvers<ContextType>;
  FilterOption?: FilterOptionResolvers<ContextType>;
  LegendItem?: LegendItemResolvers<ContextType>;
  MapCollection?: MapCollectionResolvers<ContextType>;
  MapCollectionSearchResult?: MapCollectionSearchResultResolvers<ContextType>;
  MapGroup?: MapGroupResolvers<ContextType>;
  MapGroupLegendItem?: MapGroupLegendItemResolvers<ContextType>;
  MapLayerSearchResult?: MapLayerSearchResultResolvers<ContextType>;
  MapResult?: MapResultResolvers<ContextType>;
  MapSearchResult?: MapSearchResultResolvers<ContextType>;
  Meta?: MetaResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Results?: ResultsResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  Theme?: ThemeResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
