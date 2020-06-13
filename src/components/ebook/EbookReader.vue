<template>
<!-- 阅读器 -->
  <div class="ebook-reader">
    <div id="read"></div>
    <!-- 模板 -->
    <div class="ebook-reader-mask"
    @click="onMaskClick"
    @touchmove="move"
    @touchend="moveEnd"
    @touchstart="touchStart"
    @mousedown.left="onMouseEnter"
    @mousemove.left="onMouseMove"
    @mouseup.left="onMouseUp"
    ></div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import {
  getFontFamily, saveFontFamily,
  getFontSize, saveFontSize,
  getTheme, saveTheme,
  getLocation
  } from '../../utils/localStorage'
import { flatten } from '../../utils/book'
import Epub from 'epubjs'
import { getLocalForage } from '../../utils/localForage'
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  data () {
    return {
      startX: 0
    }
  },
  methods: {
    // 鼠标按下
    onMouseEnter(e) {
      // console.log(1, e)
      this.mousetState = 1
      this.mouseStarTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    // 鼠标移动
    onMouseMove(e) {
      // console.log(2, e)
      if (this.mousetState === 1) {
        this.mousetState = 2
      } else if (this.mousetState === 2) {
        let offsetY = 0
        if (this.firstOffserY) {
          offsetY = e.clientY - this.firstOffserY
          this.setOffsetY(offsetY)
          // console.log(offsetY)
        } else {
          this.firstOffserY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    // 鼠标抬起
    onMouseUp(e) {
      // console.log(3, e)
      if (this.mousetState === 2) {
        this.setOffsetY(0)
        this.firstOffserY = null
        this.mousetState = 3
      } else {
        this.mousetState = 4
      }
      const time = e.timeStamp - this.mouseStarTime
      if (time < 150) {
        this.mousetState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    // 按下的位置
    touchStart(e) {
      this.startX = e.changedTouches[0].pageX
    },
    // 点击模板时候触发
    onMaskClick(e) {
      if (this.mousetState && (this.mousetState === 2 || this.mousetState === 3)) {
        return
      }
      // console.log(e)
      const width = window.innerWidth
      const offsetX = e.offsetX
      if (offsetX > 0 && offsetX < width * 0.4) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.6) {
        this.nextPage()
      } else {
        this.taggleTitleAndMenu()
      }
    },
    // 移动中
    move(e) {
      // console.log(e)
      let offsetY = 0
      if (this.firstOffserY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffserY
        this.setOffsetY(offsetY)
        // console.log(offsetY)
      } else {
        this.firstOffserY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    // 移动结束
    moveEnd(e) {
      // console.log(e, 'end')
      this.setOffsetY(0)
      this.firstOffserY = null
      this.endX = e.changedTouches[0].pageX
      const moveX = this.endX - this.startX
      // console.log(moveX)
      if (moveX > 40) {
        this.prevPage()
      } else if (moveX < -40) {
        this.nextPage()
      }
    },
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()// 隐藏菜单栏 方法在mixin中
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    // 标题菜单栏
    taggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)// 隐藏字体组件
      }
      this.setMenuVisible(!this.menuVisible)
    },
    // 初始化字体
    initFontFamily() {
      const font = getFontFamily(this.fileName)
      if (!font) {
        // 保存到localStorage
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        // 保存到localStorage并传入到Vuex
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    // 初始化字体
    initFontSize() {
      const fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    // 初始化主题
    initTheme() {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(defaultTheme)
    },
    // 初始化
    initRendition() {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
        // flow: 'scrolled'
      })
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontFamily()
        this.initFontSize()
        this.initGlobalStyle()// 方法在mixin里面
      })
      // rendition的钩子函数hooks 阅读器渲染完可以手动改的添加样式文件
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          // addStylesheet传入的值必须是Url
          contents.addStylesheet('http://111.229.20.115:5894/ebook/fonts/daysOne.css'),
          contents.addStylesheet('http://111.229.20.115:5894/ebook/fonts/cabin.css'),
          contents.addStylesheet('http://111.229.20.115:5894/ebook/fonts/montserrat.css'),
          contents.addStylesheet('http://111.229.20.115:5894/ebook/fonts/tangerine.css')
        ]).then(() => {})
      })
    },
    // initGesture() {
    //   const clientHeight = document.body.clientHeight / 10
    //   this.rendition.on('touchstart', event => {
    //     this.touchStartX = event.changedTouches[0].clientX
    //     this.touchStartY = event.changedTouches[0].clientY
    //     this.touchStartTime = event.timeStamp
    //   })
    //   this.rendition.on('touchend', event => {
    //     const offsetX = event.changedTouches[0].clientX - this.touchStartX
    //     const time = event.timeStamp - this.touchStartTime
    //     if ((offsetX > 40 || this.touchStartY < clientHeight * 4) && time < 2000) {
    //       this.prevPage()
    //     } else if ((offsetX < -40 || this.touchStartY > clientHeight * 6) && time < 2000) {
    //       this.nextPage()
    //     } else {
    //       this.taggleTitleAndMenu()
    //     }
    //     event.preventDefault()
    //     event.stopPropagation()
    //   })
    // },
    // 保存信息到vuex，后面目录页面要用到
    parseBook() {
      // // console.log(this.book.loaded.cover)
      // this.book.loaded.cover.then(cover => {
      //   this.book.archive.createUrl(cover).then(url => {
      //     console.log(111)
      //     this.setCover(url)
      //   })
      // })
      // 保存书名和作者
      this.book.loaded.metadata.then(metadata => {
        // console.log(metadata)
        this.setMetadata(metadata)
      })
      // 获得目录数据生成目录结构
      this.book.loaded.navigation.then(nav => {
        // flatten方法在book.js
        const navItem = flatten(nav.toc)
        // 判断目录为几级目录
        function find(item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    },
    initEpub(url) {
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGesture()
      this.parseBook()
      this.book.ready.then(() => {
        // 分页算法
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        // console.log(locations)
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted() {
    // 获取地址栏的fileName并取到书名
    const books = this.$route.params.fileName.split('|')
    const fileName1 = books[1]
    getLocalForage(fileName1, (err, blob) => {
      if (!err && blob) {
        // console.log('离线获取电子书')
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        // console.log('在线获取电子书')
        const fileName = this.$route.params.fileName.split('|').join('/')
        this.setFileName(fileName).then(() => {
          const url = 'http://111.229.20.115:5894/ebook/epub/' + this.fileName + '.epub'
          this.initEpub(url)
        })
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-reader{
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 150;
    top: 0;
    left: 0;
    background-color: transparent;
  }
}
</style>
