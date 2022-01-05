import makeRequest from './common.js'

export async function getInterfaceAddressesData() {
  return await makeRequest('/network/addrs')
}

export async function getActiveInterface() {
  return await makeRequest('/network/activeIface')
}

export async function getHostname() {
  return await makeRequest('/network/hostname')
}
