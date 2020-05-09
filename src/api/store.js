import axios from 'axios'

export function home() {
  return axios({
    method: 'get',
    url: 'http://localhost:8080/book/home/'
  })
}
