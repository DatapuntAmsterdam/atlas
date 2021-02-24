import fixtureSingle from './alcoholverbod.json'
import fixtureList from './alcoholverbod-list.json'
import { Single } from '../types'
import { HALList } from '../../types'

type List = HALList<{
  alcoholverbod: Single[]
}>

export const singleFixture = fixtureSingle as Single
export const listFixture = fixtureList as List
export const path = 'v1/overlastgebieden/alcoholverbod/'
export const fixtureId = 1
