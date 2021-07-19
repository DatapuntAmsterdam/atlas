import formatDossierAccessValue from './formatDossierAccessValue'

describe('formatDossierAccessValue', () => {
  it('returns Openbaar if the access value is PUBLIC', () => {
    const result = formatDossierAccessValue('PUBLIC')

    expect(result).toEqual('Openbaar')
  })

  it('returns Niet openbaar if the access value is RESTRICTED', () => {
    const result = formatDossierAccessValue('RESTRICTED')

    expect(result).toEqual('Niet openbaar')
  })

  it('returns the initial access value if the access value is not PUBLIC or RESTRICTED', () => {
    const access = 'ABC123'
    const result = formatDossierAccessValue(access)

    expect(result).toEqual(access)
  })
})
