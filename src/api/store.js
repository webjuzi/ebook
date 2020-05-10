import axios from 'axios'

export function home() {
  return axios({
    method: 'get',
    url: 'http://localhost:8080/book/home/'
  })
}

export function list() {
  return axios({
    method: 'get',
    url: 'http://localhost:8080/book/list/'
  })
}

export function detail(book) {
  return axios({
    method: 'get',
    url: 'http://47.99.166.157:3000/book/detail',
    params: {
      fileName: book.fileName
    }
  })
}
