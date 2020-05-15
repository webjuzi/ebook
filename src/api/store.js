import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
import { getCategoryName } from '../utils/store'

export function flatList() {
  return axios({
    method: 'get',
    url: 'http://47.99.166.157:3000/book/flat-list'
  })
}

export function home() {
  return axios({
    method: 'get',
    url: 'http://47.99.166.157:3000/book/home/'
  })
}

export function list() {
  return axios({
    method: 'get',
    url: '/juzi/ebook/book/list/'
  })
}

export function shelf() {
  return axios({
    method: 'get',
    url: 'http://47.99.166.157:3000/book/shelf/'
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

export function downloadMp3(url, cb, cb2) {
  axios.create({
    baseURL: url,
    method: 'get',
    responseType: 'blob',
    timeout: 30 * 1000,
    onDownloadProgress: progressEvent => {
    }
  }).get().then(response => {
    const blob = new Blob([response.data])
    if (cb) cb(blob)
  }).catch(err => {
    if (cb2) cb2(err)
  })
}

export function downloadWithoutCache(item, cb, cb2, cb3) {
  axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    timeout: 30 * 1000,
    onDownloadProgress: progressEvent => {
      if (cb3) cb3(progressEvent)
    }
  }).get(`${getCategoryName(item.category)}/${item.fileName}.epub`)
    .then(res => {
      const blob = new Blob([res.data])
      if (cb) cb(blob)
    })
    .catch(err => {
      if (cb2) cb2(err)
    })
}
