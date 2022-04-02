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

export async function startMeasuring() {
  return await makeRequest('/network/measure/start')
}

export async function stopMeasuring() {
  return await makeRequest('/network/measure/stop')
}

export async function getMeasuringResults() {
  return await makeRequest('/network/measure/results')
}
