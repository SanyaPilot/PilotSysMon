import axios from 'axios'

export default async function makeRequest(url) {
  const request = await axios.get("http://localhost:8000" + url)
  return request.data
}
