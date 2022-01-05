import makeRequest from './common.js'

export async function getMemoryData() {
  return await makeRequest('/memory')
}

export async function getMemoryHumanData() {
  return await makeRequest('/memory?human=true')
}
