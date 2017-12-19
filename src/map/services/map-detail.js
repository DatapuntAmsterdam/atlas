import bouwblok from '../../shared/services/bouwblok/bouwblok';
import buurt from '../../shared/services/buurt/buurt';
import explosievenGevrijwaardGebied from '../../shared/services/explosieven/explosieven-gevrijwaard-gebied';
import explosievenInslag from '../../shared/services/explosieven/explosieven-inslag';
import explosievenUitgevoerdOnderzoek from '../../shared/services/explosieven/explosieven-uitgevoerd-onderzoek';
import explosievenVerdachtGebied from '../../shared/services/explosieven/explosieven-verdacht-gebied';
import gebiedsgerichtWerken from '../../shared/services/gebiedsgericht-werken/gebiedsgericht-werken';
import grootstedelijk from '../../shared/services/gebieden/gebieden-grootstedelijk';
import kadastraalObject from '../../shared/services/kadastraal-object/kadastraal-object';
import meetbout from '../../shared/services/meetbout/meetbout';
import monument from '../../shared/services/monument/monument';
import napPeilmerk from '../../shared/services/nap-peilmerk/nap-peilmerk';
import nummeraanduiding from '../../shared/services/nummeraanduiding/nummeraanduiding';
import openbareRuimte from '../../shared/services/openbare-ruimte/openbare-ruimte';
import pand from '../../shared/services/pand/pand';
import stadsdeel from '../../shared/services/gebieden/gebieden-stadsdeel';
import unesco from '../../shared/services/gebieden/gebieden-unesco';
import vestiging from '../../shared/services/vestiging/vestiging';

const servicesByEndpointType = {
  'bag/ligplaats': {
    fetch: nummeraanduiding
  },
  'bag/nummeraanduiding': {
    fetch: nummeraanduiding
  },
  'bag/openbareruimte': {
    fetch: openbareRuimte
  },
  'bag/pand': {
    fetch: pand
  },
  'bag/standplaats': {
    fetch: nummeraanduiding
  },
  'bag/verblijfsobject': {
    fetch: nummeraanduiding
  },
  'brk/object': {
    fetch: kadastraalObject
  },
  'gebieden/bouwblok': {
    fetch: bouwblok
  },
  'gebieden/buurt': {
    fetch: buurt
  },
  'gebieden/gebiedsgerichtwerken': {
    fetch: gebiedsgerichtWerken
  },
  'gebieden/grootstedelijk': {
    fetch: grootstedelijk
  },
  'gebieden/stadsdeel': {
    fetch: stadsdeel
  },
  'gebieden/unesco': {
    fetch: unesco
  },
  'handelsregister/vestiging': {
    fetch: vestiging,
    authScope: 'HR/R'
  },
  'meetbouten/meetbout': {
    fetch: meetbout
  },
  'milieuthemas/explosieven/gevrijwaardgebied': {
    fetch: explosievenGevrijwaardGebied
  },
  'milieuthemas/explosieven/inslagen': {
    fetch: explosievenInslag
  },
  'milieuthemas/explosieven/uitgevoerdonderzoek': {
    fetch: explosievenUitgevoerdOnderzoek
  },
  'milieuthemas/explosieven/verdachtgebied': {
    fetch: explosievenVerdachtGebied
  },
  'monumenten/monumenten': {
    fetch: monument
  },
  'nap/peilmerk': {
    fetch: napPeilmerk
  }
};

export default function detail(endpoint, user) {
  const endpointType = Object.keys(servicesByEndpointType).find((type) => endpoint.includes(type));
  const endpointConfig = endpointType && servicesByEndpointType[endpointType];
  const fetchFn = endpointConfig && endpointConfig.fetch;
  const authScope = endpointConfig && endpointConfig.authScope;
  return fetchFn && (!authScope || user.scopes.includes(authScope)) &&
    fetchFn(endpoint);
}
