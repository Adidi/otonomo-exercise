const reg = /^(?=.*[a-z])[a-z0-9]{6}$/i

// use curry to closure cars and used this function where vin is the only variant(like it should)
export const isValidVin = cars => vin => {
  let valid = true
  let errMsg = ''
  vin = vin.toUpperCase()
  if (cars[vin]) {
    valid = false
    errMsg = `${vin} is already exists`
  } else {
    valid = reg.test(vin)
    errMsg = valid
      ? ''
      : 'VIN must contain 6 chars(A-Z or 0-9) and at least one char A-Z'
  }

  return { errMsg, valid }
}
