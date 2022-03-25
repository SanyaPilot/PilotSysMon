import makeRequest from './common.js'

export default async function getMemoryData(human) {
  if (!human) {
    return await makeRequest('/memory')
  } else {
    return await makeRequest('/memory?human=true')
  }
}
