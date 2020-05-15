import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

export function home() {
  return axios({
    method: 'get',
    url: '/localhost/book/home/'
  })
}

export function list() {
  return axios({
    method: 'get',
    url: '/localhost/book/list/'
  })
}

export function shelf() {
  return axios({
    method: 'get',
    url: '/localhost/book/shelf/'
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

export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    baseURL: 'http://111.229.20.115:5894/ebook/epub/',
    method: 'get',
    responseType: 'blob',
    timeout: 300 * 1000,
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`).then(res => {
    const blob = new Blob([res.data])
    setLocalForage(book.fileName, blob, () => {
      if (onSuccess) onSuccess(book)
    }, err => {
      if (onError) onError(err)
    })
  }).catch(err => {
    if (onError) onError(err)
  })
}
