import queryStringParser from '../../shared/services/query-string-parser/query-string-parser'
import { getByUri } from '../../shared/services/api/api'

async function redirectToAddress(locationSearch: string): Promise<string> {
  const { postcode, huisnummer, huisletter = '', huisnummerToevoeging = '' } = queryStringParser(
    locationSearch,
  )

  // These parameters are required
  if (!postcode || !huisnummer) {
    return ''
  }

  const { count, _embedded: data } = await getByUri(
    `${process.env.API_ROOT}v1/bag/nummeraanduiding/?postcode=${postcode}&huisletter=${huisletter}&huisnummerToevoeging=${huisnummerToevoeging}&huisnummer=${huisnummer}`,
  )

  // Only when one results is found, the use can be redirectied
  if (count === 1) {
    const { verblijfsobjectId: dataId } = data?.nummeraanduiding.length && data?.nummeraanduiding[0]

    return `id${dataId}`
  }

  return ''
}

export default redirectToAddress