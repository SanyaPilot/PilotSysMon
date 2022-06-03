import makeRequest from './common.js'

export default async function getLogsData(level, id, boot, day, since, until) {
  if (level || id) {
    let args = '?'
    if (level) {
      args += 'level=' + level + '&'
    }
    if (id) {
      args += 'id=' + id + '&'
    }
    if (day) {
      args += 'day=' + day + '&'
    }
    if (since) {
      args += 'since=' + since + '&'
    }
    if (until) {
      args += 'until=' + until + '&'
    }
    if (Number.isInteger(parseInt(boot))) {
      args += 'boot=' + boot
    }
    console.log('/logs' + args)
    return await makeRequest('/logs' + args)
  }
    return await makeRequest('/logs')
}
