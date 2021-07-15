import { getScopes } from '../../../../../shared/services/auth/auth'
import type { ExtendedMapGroup } from '../services'

// eslint-disable-next-line import/prefer-default-export
export function isAuthorised(layer: ExtendedMapGroup) {
  return !layer.authScope || getScopes().includes(layer.authScope)
}
