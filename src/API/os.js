import makeRequest from './common.js'

export default async function getOSData() {
  return await makeRequest('/os')
}
