import makeRequest from './common.js'

export default async function getCPUData() {
  return await makeRequest('/cpu')
}
