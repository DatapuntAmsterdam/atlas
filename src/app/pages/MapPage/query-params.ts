import { constants } from '@amsterdam/arm-core'
import type { LatLngLiteral, LatLngTuple } from 'leaflet'
import { PANO_LABELS } from './components/PanoramaViewer/constants'
import { normalizeCoordinate } from '../../../shared/services/coordinate-reference-system'
import type { UrlParam } from '../../utils/useParam'

// TODO: Refactor this default export once this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
const { DEFAULT_AMSTERDAM_MAPS_OPTIONS } = constants

export type BaseLayer =
  | 'topografie'
  | 'topo_rd_light'
  | 'topo_rd_zw'
  | 'lf2019'
  | 'lf2018'
  | 'ir2018'
  | 'lf2017'
  | 'lf2016'
  | 'lf2015'
  | 'lf2014'
  | 'lf2013'
  | 'lf2012'
  | 'lf2011'
  | 'lf2010'
  | 'lf2009'
  | 'lf2008'
  | 'lf2007'
  | 'lf2006'
  | 'lf2005'
  | 'lf2004'
  | 'lf2003'

export interface MapLayer {
  id: string
  isVisible: boolean
}

export interface Pano {
  heading: number
  pitch: number
  fov: number
}

export const isEmbeddedParam: UrlParam<boolean> = {
  name: 'embed',
  defaultValue: false,
  decode: (value) => value === 'true',
  encode: (value) => value.toString(),
}

export const COORDINATE_PRECISION = 7

function encodeLatLngLiteral(value: LatLngLiteral) {
  return [value.lat, value.lng]
    .map((coordinate) => normalizeCoordinate(coordinate, COORDINATE_PRECISION))
    .join(',')
}

function decodeLatLngLiteral(value: string): LatLngLiteral {
  const [lat, lng] = value.split(',').map((part) => parseFloat(part))

  return {
    lat,
    lng,
  }
}

// TODO: Remove this cast when this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
const defaultCenter = DEFAULT_AMSTERDAM_MAPS_OPTIONS.center as LatLngTuple

export const centerParam: UrlParam<LatLngLiteral> = {
  name: 'center',
  defaultValue: { lat: defaultCenter[0], lng: defaultCenter[1] },
  decode: decodeLatLngLiteral,
  encode: encodeLatLngLiteral,
}

export const zoomParam: UrlParam<number> = {
  name: 'zoom',
  // TODO: Remove this cast when this issue is resolved: https://github.com/Amsterdam/amsterdam-react-maps/issues/727
  defaultValue: DEFAULT_AMSTERDAM_MAPS_OPTIONS.zoom as number,
  decode: (value) => parseInt(value, 10),
  encode: (value) => value.toString(),
}

export const locationParam: UrlParam<LatLngLiteral | null> = {
  name: 'locatie',
  defaultValue: null,
  decode: decodeLatLngLiteral,
  encode: (value) => encodeLatLngLiteral(value),
}

export const mapLayersParam: UrlParam<string[]> = {
  name: 'lagen',
  defaultValue: [],
  decode: (value) => {
    const cleanedValue = value.replaceAll(':1', '')
    return cleanedValue.split('|')
  },
  encode: (value) => value.join('|'),
}

export const legendOpenParam: UrlParam<boolean> = {
  name: 'legenda',
  defaultValue: false,
  decode: (value) => Boolean(value),
  encode: (value) => value.toString(),
}

export const baseLayerParam: UrlParam<BaseLayer> = {
  name: 'achtergrond',
  defaultValue: 'topografie',
  decode: (value) => value as BaseLayer,
  encode: (value) => value,
}

export const panoPitchParam: UrlParam<number | null> = {
  name: 'pitch',
  defaultValue: null,
  initialValue: 10,
  decode: (value) => parseFloat(value),
  encode: (value) => value.toString(),
}

export const panoFovParam: UrlParam<number | null> = {
  name: 'fov',
  defaultValue: null,
  initialValue: 30,
  decode: (value) => parseInt(value, 10),
  encode: (value) => value.toFixed(0).toString(),
}

export const panoHeadingParam: UrlParam<number | null> = {
  name: 'heading',
  defaultValue: null,
  initialValue: 24,
  decode: (value) => parseFloat(value),
  encode: (value) => value.toString(),
}

export const panoTagParam: UrlParam<string> = {
  name: 'tags',
  defaultValue: PANO_LABELS[0].id,
  decode: (value) => {
    // Attempt to find the entry with a matching id.
    const matched = PANO_LABELS.find(({ id }) => id === value)

    if (matched) {
      return matched.id
    }

    // If no matching id was found, handle legacy values which are based on a collection of tags
    // and find the matching label definition.
    const legacyTags = value.split(',')
    const legacyMatched = PANO_LABELS.find(({ tags }) =>
      legacyTags.every((tag) => tags.includes(tag)),
    )

    if (legacyMatched) {
      return legacyMatched.id
    }

    // If value is not found or not correct, fall back to default value.
    return panoTagParam.defaultValue
  },
  encode: (value) => value,
}

export interface PolyDrawing {
  id: string
  polygon: LatLngLiteral[]
}

export const polygonParam: UrlParam<PolyDrawing | null> = {
  name: 'geo',
  defaultValue: null,
  decode: decodePolyDrawing,
  encode: (value) => encodePolyDrawing(value),
}

export const polylineParam: UrlParam<PolyDrawing | null> = {
  name: 'meten',
  defaultValue: null,
  decode: decodePolyDrawing,
  encode: (value) => encodePolyDrawing(value),
}

interface RawPolyDrawing {
  id: string
  polygon: LatLngTuple[]
}

interface RawPolyDrawingLegacy {
  description: string
  markers: string
}

function decodePolyDrawing(value: string): PolyDrawing {
  const parsedValue: RawPolyDrawing | RawPolyDrawingLegacy = JSON.parse(value)

  if ('markers' in parsedValue) {
    return decodeLegacyPolyDrawing(parsedValue)
  }

  return {
    id: parsedValue.id,
    polygon: parsedValue.polygon.map(([lat, lng]) => ({ lat, lng })),
  }
}

function encodePolyDrawing(value: PolyDrawing) {
  const encodedValue: RawPolyDrawing = {
    id: value.id,
    polygon: value.polygon.map(({ lat, lng }) => [lat, lng]),
  }

  return JSON.stringify(encodedValue)
}

function decodeLegacyPolyDrawing(value: RawPolyDrawingLegacy): PolyDrawing {
  // We need a consistent ID when decoding legacy parameters.
  // Since no ID exists we'll base it on the Base64 of the description.
  const id = btoa(value.description)
  const polygon: LatLngLiteral[] = value.markers.split('|').map((coordinate) => {
    const [lat, lng] = coordinate.split(':').map(parseFloat)

    return { lat, lng }
  })

  return {
    id,
    polygon,
  }
}

export const panoFullScreenParam: UrlParam<boolean> = {
  name: 'panoFullScreen',
  defaultValue: false,
  decode: (value) => Boolean(value),
  encode: (value) => value.toString(),
}

export enum ViewMode {
  Map = 'kaart',
  Split = 'gesplitst',
  Full = 'volledig',
}

export const viewParam: UrlParam<ViewMode> = {
  name: 'modus',
  defaultValue: ViewMode.Split,
  decode: (value) => value as ViewMode,
  encode: (value) => value,
}

export interface DataSelectionFilters {
  [key: string]: string
}

export const dataSelectionFiltersParam: UrlParam<DataSelectionFilters | null> = {
  name: 'filters',
  defaultValue: null,
  decode: (value) => {
    try {
      return JSON.parse(value)
    } catch (error) {
      return null
    }
  },
  encode: (value) => JSON.stringify(value),
}
