/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { SmallAPIReference, APIReference } from '../../../types'

export interface Root extends APIReference {
  ligplaatsidentificatie: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  begin_geldigheid: string
  einde_geldigheid: any
  bron: any
  indicatie_geconstateerd: boolean
  aanduiding_in_onderzoek: boolean
  bbox: number[]
  geometrie: Geometry
  hoofdadres: APIReference
  adressen: SmallAPIReference
  buurt: APIReference
  _buurtcombinatie: APIReference
  _stadsdeel: APIReference
  _gebiedsgerichtwerken: APIReference
  _grootstedelijkgebied: any
  _gemeente: APIReference
  _woonplaats: APIReference
}