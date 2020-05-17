import { getLocalStorage, setLocalStorage } from './localStorage'

export function flatBookList(bookList) {
  if (bookList) {
    let orgBookList = bookList.filter(item => {
      return item.type !== 3
    })
    const categoryList = bookList.filter(item => {
      return item.type === 2
    })
    categoryList.forEach(item => {
      const index = orgBookList.findIndex(v => {
        return v.id === item.id
      })
      if (item.itemList) {
        item.itemList.forEach(subItem => {
          orgBookList.splice(index, 0, subItem)
        })
      }
    })
    orgBookList.forEach((item, index) => {
      item.id = index + 1
    })
    orgBookList = orgBookList.filter(item => item.type !== 2)
    return orgBookList
  } else {
    return []
  }
}

export function findBook(fileName) {
  const bookList = getLocalStorage('shelf')
  return flatBookList(bookList).find(item => item.fileName === fileName)
}

export const flapCardList = [
  {
    r: 255,
    g: 102,
    _g: 102,
    b: 159,
    imgLeft: 'url(' + require('@/assets/images/gift-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/gift-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 100,
    rotateDegree: 0
  },
  {
    r: 74,
    g: 171,
    _g: 171,
    b: 255,
    imgLeft: 'url(' + require('@/assets/images/compass-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/compass-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 99,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 198,
    _g: 198,
    b: 102,
    imgLeft: 'url(' + require('@/assets/images/star-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/star-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 98,
    rotateDegree: 0
  },
  {
    r: 255,
    g: 102,
    _g: 102,
    b: 159,
    imgLeft: 'url(' + require('@/assets/images/heart-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/heart-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 97,
    rotateDegree: 0
  },
  {
    r: 59,
    g: 201,
    _g: 201,
    b: 22,
    imgLeft: 'url(' + require('@/assets/images/crown-left.png') + ')',
    imgRight: 'url(' + require('@/assets/images/crown-right.png') + ')',
    backgroundSize: '50% 50%',
    zIndex: 96,
    rotateDegree: 0
  }
]

export function getCategoryName(id) {
  switch (id) {
    case 1:
      return '都市'
    case 2:
      return '玄幻修仙'
    case 3:
      return '言情'
    case 4:
      return '武侠'
    case 5:
      return '科幻'
    case 6:
      return '历史'
    case 7:
      return '游戏'
    case 8:
      return '灵异'
    case 9:
      return '其他'
  }
}

export function categoryText(category, vue) {
  switch (category) {
    case 1:
      return vue.$t('category.dushi')
    case 2:
      return vue.$t('category.xuanhuan')
    case 3:
      return vue.$t('category.yanqing')
    case 4:
      return vue.$t('category.wuxia')
    case 5:
      return vue.$t('category.kehuan')
    case 6:
      return vue.$t('category.lishi')
    case 7:
      return vue.$t('category.youxi')
    case 8:
      return vue.$t('category.lingyi')
    case 9:
      return vue.$t('category.qita')
  }
}

export const categoryList = {
  dushi: 1,
  xuhuan: 2,
  yanqing: 3,
  wuxia: 4,
  kehuan: 5,
  lishi: 6,
  youxi: 7,
  lingyi: 8,
  qita: 9
}

export function appendAddToShelf(list) {
  list.push({
    id: -1,
    type: 3
  })
  return list
}

export function removeAddFormShelf(list) {
  return list.filter(item => item.type !== 3)
}

export function gotoStoreHome(vue) {
  vue.$router.push({
    path: '/store/home'
  })
}

export function gotoBookDetail(vue, book) {
  const categoryText = book.categoryText === '都市' ? 'dushi' : (book.categoryText === '玄幻修仙' ? 'xuanhuan' : (book.categoryText === '言情' ? 'yanqing' : (book.categoryText === '武侠' ? 'wuxia' : (book.categoryText === '科幻' ? 'kehuan' : (book.categoryText === '历史' ? 'lishi' : (book.categoryText === '游戏' ? 'youxi' : (book.categoryText === '灵异' ? 'lingyi' : (book.categoryText === '其他' ? 'qita' : ''))))))))
  vue.$router.push({
    path: '/store/detail',
    query: {
      fileName: book.fileName,
      category: categoryText
    }
  })
}

const BOOK_SHELF_KEY = 'shelf'

export function addToShelf(book) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  bookList = removeAddFormShelf(bookList)
  book.type = 1
  bookList.push(book)
  bookList.forEach((item, index) => {
    item.id = index + 1
  })
  appendAddToBookList(bookList)
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}

export function appendAddToBookList(bookList) {
  bookList.push({
    cover: '',
    title: '',
    type: 3,
    id: Number.MAX_SAFE_INTEGER
  })
}

export function removeFromBookShelf(bookItem) {
  let bookList = getLocalStorage(BOOK_SHELF_KEY)
  bookList = bookList.filter(item => {
    if (item.itemList) {
      item.itemList = item.itemList.filter(subItem => subItem.fileName !== bookItem.fileName)
    }
    return item.fileName !== bookItem.fileName
  })
  setLocalStorage(BOOK_SHELF_KEY, bookList)
}
