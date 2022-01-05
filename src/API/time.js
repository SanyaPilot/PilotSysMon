import makeRequest from './common.js'

export default async function getTimeData() {
  return await makeRequest('/time')
}
