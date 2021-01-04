/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference, SmallAPIReference } from '../../types'

export interface Root extends APIReference {
  meetboutidentificatie: string
  buurt: string
  x_coordinaat: string
  y_coordinaat: string
  hoogte_nap: string
  zakking_cumulatief: string
  datum: string
  bouwblokzijde: string
  eigenaar: string
  beveiligd: any
  stadsdeel: string
  stadsdeel_link: string
  adres: string
  locatie: string
  zakkingssnelheid: string
  status: string
  bouwblok: string
  bouwblok_link: string
  blokeenheid: number
  rollaag: string
  metingen: SmallAPIReference
  geometrie: Geometry
  dataset: string
}
