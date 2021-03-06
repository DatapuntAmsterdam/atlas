/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference } from '../../types'

export interface Root extends APIReference {
  ogc_fid: number
  wkb_geometry: Geometry
  gebied_code: string
  begin_datum_gebied: string
  eind_datum_gebied: any
  domein_code: string
  gebruiks_doel: string
  gebied_naam: string
  omschrijving: string
  show: string
}
