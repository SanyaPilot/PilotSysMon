import makeRequest from './common.js'

export async function getCPUSummaryData() {
  return await makeRequest('/cpu')
}

export async function getCPUInfoData() {
  return await makeRequest('/cpu/info')
}
