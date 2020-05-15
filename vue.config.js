function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    proxy: {
      '/juzi': {
        target: 'http://111.229.20.115:5894/',
        changOrigin: true,
        ws: true,
        pathRewrite: {
          '^/juzi': ''
        }
      },
      '/localhost': {
        target: 'http://192.168.0.180:8080/',
        changOrigin: true,
        ws: true,
        pathRewrite: {
          '^/localhost': ''
        }
      }
    },
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288
    }
  }
}
