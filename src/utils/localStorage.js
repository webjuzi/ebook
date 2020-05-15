import Storage from 'web-storage-cache'
const localStorage = new Storage()

export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}

export function saveBookShelf(shelf) {
  return setLocalStorage('shelf', shelf)
}

export function getBookShelf() {
  return getLocalStorage('shelf')
}

// 设置
export function setBookObject(fileName, key, value) {
  let book = getLocalStorage(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}
// 获取
export function getBookObject(fileName, key) {
  const book = getLocalStorage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}
// 获取字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}
// 保存字体
export function saveFontFamily(fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}
// 获取字号
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}
// 保存字号
export function saveFontSize(fileName, fontSize) {
  setBookObject(fileName, 'fontSize', fontSize)
}
// 获取语言
export function getLocale() {
  return getLocalStorage('locale')
}
// 设置语言
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}
// 获取主体
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}
// 设置主体
export function saveTheme(fileName, theme) {
  setBookObject(fileName, 'theme', theme)
}
// 获取进度
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}
// 保存进度
export function saveLocation(fileName, location) {
  setBookObject(fileName, 'location', location)
}
// 获取阅读时间
export function getReadTime(fileName) {
  return getBookObject(fileName, 'time')
}
// 保存阅读时间
export function saveReadTime(fileName, theme) {
  setBookObject(fileName, 'time', theme)
}
// 获取封面图片
export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}
// 保存封面图片
export function saveCover(fileName, cover) {
  setBookObject(fileName, 'cover', cover)
}
// 获取书签
export function getBookmark(fileName) {
  return getBookObject(fileName, 'bookmark')
}
// 保存书签
export function saveBookmark(fileName, bookmark) {
  setBookObject(fileName, 'bookmark', bookmark)
}
// 获取目录
export function getProgress(fileName) {
  return getBookObject(fileName, 'progress')
}
// 保存目录
export function saveProgress(fileName, progress) {
  setBookObject(fileName, 'progress', progress)
}
// 获取目录
export function getNavigation(fileName) {
  return getBookObject(fileName, 'navigation')
}
// 保存目录
export function saveNavigation(fileName, navigation) {
  setBookObject(fileName, 'navigation', navigation)
}

export function getMetadata(fileName) {
  return getBookObject(fileName, 'metadata')
}

export function saveMetadata(fileName, metadata) {
  setBookObject(fileName, 'metadata', metadata)
}
