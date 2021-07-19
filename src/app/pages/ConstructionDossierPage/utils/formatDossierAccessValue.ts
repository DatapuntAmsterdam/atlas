const getDossierAccessValue = (access: string): string => {
  if (access === 'PUBLIC') {
    return 'Openbaar'
  }

  if (access === 'RESTRICTED') {
    return 'Niet openbaar'
  }

  return access
}

export default getDossierAccessValue
