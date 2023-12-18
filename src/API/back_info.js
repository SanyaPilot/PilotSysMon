import makeRequest from './common.js'

export default async function getBackendInfo() {
  return await makeRequest('/backend_info')
}
