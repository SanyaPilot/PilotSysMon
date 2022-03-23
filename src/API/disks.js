import makeRequest from './common.js'

export default async function getDisksData(human) {
  if (!human) {
    return await makeRequest('/disks')
  } else {
    return await makeRequest('/disks?human=true')
  }
}
