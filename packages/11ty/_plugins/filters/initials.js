/**
 * @param     {Object} person or array of people
 * @property  {Object} first_name
 * @property  {Object} full_name
 * @property  {Object} last_name
 * @param     {Object} options
 *
 * @return {String} First letter of first and last name
 * @example "H.B."
 */

module.exports = (person, options) => {
  const { 
    first_name: firstName,
    full_name: fullName,
    last_name: lastName
  } = person
  const nameParts = []
  if (firstName && lastName) {
    nameParts.push(firstName, lastName)
  } else if (fullName) {
    nameParts.push(...fullName.split(' '))
  }
  return nameParts.map((name) => `${name.charAt(0).toUpperCase()}.`).join('')
}
