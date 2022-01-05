import makeRequest from './common.js'

export default async function getPythonData() {
  return await makeRequest('/python')
}
