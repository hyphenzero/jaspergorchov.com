export function currentAge() {
  const birthdate = new Date(process.env.BIRTHDATE)
  const today = new Date()
  const ageDifference = today - birthdate

  const age = Math.floor(ageDifference / (365.25 * 24 * 60 * 60 * 1000))

  return age
}
