<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask"
    @click="onMaskClick"
    @touchmove="move"
    @touchend="moveEnd"
    @touchstart="touchStart"
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
global.ePub = Epub
export default {
  mixins: [ebookMixin],
  data () {
    return {
      startX: 0
    }
  },
  methods: {
    touchStart(e) {
      this.startX = e.changedTouches[0].pageX
    },
    onMaskClick(e) {
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
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    taggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    initFontFamily() {
      const font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initFontSize() {
      const fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
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
    initRendition() {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initTheme()
        this.initFontFamily()
        this.initFontSize()
        this.initGlobalStyle()
      })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
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
    parseBook() {
      this.book.loaded.cover.then(cover => {
        // console.log(cover)
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
          // console.log(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find(item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    },
    initEpub() {
      const url = 'http://111.229.20.115:5894/ebook/epub/' + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGesture()
      this.parseBook()
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(locations => {
        // console.log(locations)
        this.setBookAvailable(true)
        this.refreshLocation()
      })
    }
  },
  mounted() {
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.setFileName(fileName).then(() => {
      this.initEpub()
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
