import { v4 as uuid } from 'uuid'
import encodeParam from '../../utils/encodeParam'
import type { PolyDrawing } from './query-params'
import {
  dataSelectionFiltersParam,
  isEmbeddedParam,
  mapLayersParam,
  panoFovParam,
  panoHeadingParam,
  panoPitchParam,
  panoTagParam,
  polygonParam,
  polylineParam,
} from './query-params'

describe('isEmbeddedParam', () => {
  it('encodes the value to parameter value', () => {
    expect(isEmbeddedParam.encode(true)).toBe('true')
    expect(isEmbeddedParam.encode(false)).toBe('false')
  })

  it('decodes the value from the parameter', () => {
    expect(isEmbeddedParam.decode('true')).toBe(true)
    expect(isEmbeddedParam.decode('false')).toBe(false)
  })
})

describe('panoTagParam', () => {
  it('encodes the parameter', () => {
    expect(panoTagParam.encode('pano2016bi')).toBe('pano2016bi')
  })

  it('decodes the parameter', () => {
    expect(panoTagParam.decode('pano2017woz')).toBe('pano2017woz')
  })

  it('decodes the parameter with a legacy value', () => {
    expect(panoTagParam.decode('mission-2016,mission-bi')).toBe('pano2016bi')
    expect(panoTagParam.decode('mission-2017,mission-woz')).toBe('pano2017woz')
  })

  it('falls back to default value when decoding a non-existent value', () => {
    expect(panoTagParam.decode('somevalue')).toBe(panoTagParam.defaultValue)
    expect(panoTagParam.decode('somevalue,mission-woz')).toBe(panoTagParam.defaultValue)
    expect(panoTagParam.decode('some-value,missionwoz')).toBe(panoTagParam.defaultValue)
    expect(panoTagParam.decode('somevalue,missionwoz,someothervalue')).toBe(
      panoTagParam.defaultValue,
    )
  })
})

describe('panoPitchParam and panoHeadingParam', () => {
  it('should encode the value to parameter value', () => {
    expect(panoPitchParam.encode(123)).toBe('123')
    expect(panoPitchParam.encode(0)).toBe('0')

    expect(panoHeadingParam.encode(123)).toBe('123')
    expect(panoHeadingParam.encode(0)).toBe('0')

    expect(panoPitchParam.encode(-123.12312412344)).toBe('-123.12312412344')
    expect(panoHeadingParam.encode(-123.12312412344)).toBe('-123.12312412344')
  })

  it('should decode the value from the parameter', () => {
    expect(panoPitchParam.decode('123')).toBe(123)
    expect(panoPitchParam.decode('0')).toBe(0)

    expect(panoHeadingParam.decode('123')).toBe(123)
    expect(panoHeadingParam.decode('0')).toBe(0)

    expect(panoPitchParam.decode('-123.12312412344')).toBe(-123.12312412344)
    expect(panoHeadingParam.decode('-123.12312412344')).toBe(-123.12312412344)
  })
})

describe('panoFovParam', () => {
  it('should encode the value to parameter value', () => {
    expect(panoFovParam.encode(123)).toBe('123')
    expect(panoFovParam.encode(0)).toBe('0')
    expect(panoFovParam.encode(-123.12312412344)).toBe('-123')
  })

  it('should decode the value from the parameter', () => {
    expect(panoFovParam.decode('123')).toBe(123)
    expect(panoFovParam.decode('0')).toBe(0)
    expect(panoFovParam.decode('-123.12312412344')).toBe(-123)
  })
})

describe('mapLayersParam', () => {
  it('should encode the value to parameter value', () => {
    expect(mapLayersParam.encode(['some_layer', '_foo', 'bar_'])).toBe('some_layer|_foo|bar_')
  })

  it('should decode the value from the parameter', () => {
    expect(mapLayersParam.decode('some_legacy_layer:1')).toStrictEqual(['some_legacy_layer'])
    expect(mapLayersParam.decode('some_legacy_layer_:1|foo:1|bar_baz')).toStrictEqual([
      'some_legacy_layer_',
      'foo',
      'bar_baz',
    ])
    expect(mapLayersParam.decode('some_non_legacyLayer|foo|bar')).toStrictEqual([
      'some_non_legacyLayer',
      'foo',
      'bar',
    ])
  })
})

describe('dataSelectionFiltersParam', () => {
  it('should encode the value to parameter value', () => {
    expect(dataSelectionFiltersParam.encode({ some: 'filter' })).toBe('{"some":"filter"}')
  })

  it('should decode the value from the parameter', () => {
    expect(dataSelectionFiltersParam.decode('{"some": "filter"}')).toStrictEqual({ some: 'filter' })
    expect(
      dataSelectionFiltersParam.decode('{"woonplaats": "Amsterdam", "wijk": "Willemspark"}'),
    ).toStrictEqual({
      woonplaats: 'Amsterdam',
      wijk: 'Willemspark',
    })
  })
  it('should return null if the encoded value cannot be decoded', () => {
    expect(dataSelectionFiltersParam.decode('not a json')).toStrictEqual(null)
  })
})

describe('polygonParam and polylineParam', () => {
  const id = uuid()
  const expectedEncoded = `{"id":"${id}","polygon":[[52.37628201724842,4.896165591846303],[52.37422313732434,4.891254241303624],[52.37422452094195,4.898852807226181]]}`
  const expectedDecoded: PolyDrawing = {
    id,
    polygon: [
      { lat: 52.37628201724842, lng: 4.896165591846303 },
      { lat: 52.37422313732434, lng: 4.891254241303624 },
      { lat: 52.37422452094195, lng: 4.898852807226181 },
    ],
  }

  it('encodes the parameter', () => {
    expect(encodeParam(polygonParam, expectedDecoded)).toEqual(expectedEncoded)
    expect(encodeParam(polygonParam, null)).toEqual(null)

    expect(encodeParam(polylineParam, expectedDecoded)).toEqual(expectedEncoded)
    expect(encodeParam(polylineParam, null)).toEqual(null)
  })

  it('decodes the parameter', () => {
    expect(polygonParam.decode(expectedEncoded)).toEqual(expectedDecoded)
    expect(polylineParam.decode(expectedEncoded)).toEqual(expectedDecoded)
  })

  it('decodes the parameter with a legacy value', () => {
    const description = '1,21 km en 59.151,1 m²'
    const legacyValue = `{"description":"${description}","markers":"52.37628201724842:4.896165591846303|52.37422313732434:4.891254241303624|52.37422452094195:4.898852807226181"}`
    const expectedLegacy = {
      id: btoa(description),
      polygon: expectedDecoded.polygon,
    }

    expect(polygonParam.decode(legacyValue)).toEqual(expectedLegacy)
    expect(polylineParam.decode(legacyValue)).toEqual(expectedLegacy)
  })
})
