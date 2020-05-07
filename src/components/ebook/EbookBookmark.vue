<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-warpper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="20" :height="40"></bookmark>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { realPx } from '../../utils/utils'
import Bookmark from '../common/Bookmark'
import { getBookmark, saveBookmark } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  data () {
    return {
      text: '',
      color: 'white',
      isFixed: false
    }
  },
  computed: {
    height() {
      return realPx(50)
    },
    threshold() {
      return realPx(70)
    },
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY(v) {
      if (this.menuVisible || this.settingVisible >= 0) {
        return ''
      }
      if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        this.beforeHeight()
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookmark(isBookmark) {
      if (isBookmark) {
        this.color = 'orange'
        this.isFixed = true
      } else {
        this.color = 'whitf'
        this.isFixed = false
      }
    }
  },
  methods: {
    addBookmark() {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfirange = `${cfibase}!,${cfistart},${cfiend})`
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, '')
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        this.setIsBookmark(false)
      }
    },
    restore() {
      setTimeout(() => {
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()
      } else {
        this.setIsBookmark(false)
        this.removeBookmark()
      }
    },
    beforeHeight() {
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = 'orange'
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = 'white'
        this.isFixed = false
      }
    },
    beforeThreshold(v) {
      this.$refs.bookmark.style.top = `${-v}px`
      if (v >= 50) {
        this.$refs.bookmark.style.top = `${-70}px`
      }
      this.beforeHeight()
    },
    afterThreshold(v) {
      if (v >= 70) {
        v = 70
      }
      this.$refs.bookmark.style.top = `${-v}px`
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = 'white'
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = 'orange'
        this.isFixed = true
      }
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-bookmark{
  background-color: #777777;
  position: absolute;
  top: px2rem(-70);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(70);
  .ebook-bookmark-text-warpper{
    position: absolute;
    right: px2rem(55);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper{
      font-size: px2rem(16);
      color: #ffffff;
      transition: all .2s linear;
      @include center;
    }
    .ebook-bookmark-text{
      font-size: px2rem(16);
      color: #ffffff;
    }
  }
  .ebook-bookmark-icon-wrapper{
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>
