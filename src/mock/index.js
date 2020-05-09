import Mock from 'mockjs'
import home from './bookHome'
import BookShelfApi from './bookShelf'
import BookHomeList from './bookList'
import BookFlatList from './bookFlatList'

// Mock.setup({
//   timeout: '350-600'
// })

Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', BookShelfApi)
Mock.mock(/\/book\/list/, 'get', BookHomeList)
Mock.mock(/\/book\/flat-list/, 'get', BookFlatList)

export default Mock
