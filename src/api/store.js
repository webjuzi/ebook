import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
import { getCategoryName } from '../utils/store'

export function home() {
  return axios({
    method: 'get',
    url: 'http://111.229.20.115:5858/book/home'
  })
}

export function list() {
  return axios({
    method: 'get',
    url: 'http://111.229.20.115:5858/book/list'
  })
}

export function shelf() {
  return axios({
    method: 'get',
    url: 'http://111.229.20.115:5858/book/shelf'
  })
}

export function detail(book) {
  return axios({
    method: 'get',
    url: 'http://111.229.20.115:5858/book/detail',
    params: {
      fileName: book.fileName
    }
  })
}

export function shelfList() {
  return axios({
    method: 'get',
    url: 'http://111.229.20.115:5858/book/flat-list'
  })
}

export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  // console.log(book)
  const categoryText = book.categoryText === '都市' ? 'dushi' : (book.categoryText === '玄幻修仙' ? 'xuanhuan' : (book.categoryText === '言情' ? 'yanqing' : (book.categoryText === '武侠' ? 'wuxia' : (book.categoryText === '科幻' ? 'kehuan' : (book.categoryText === '历史' ? 'lishi' : (book.categoryText === '游戏' ? 'youxi' : (book.categoryText === '灵异' ? 'lingyi' : (book.categoryText === '其他' ? 'qita' : ''))))))))
  return axios.create({
    baseURL: 'http://111.229.20.115:5894/ebook/epub/',
    method: 'get',
    responseType: 'blob',
    timeout: 300 * 1000,
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${categoryText}/${book.fileName}.epub`).then(res => {
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
