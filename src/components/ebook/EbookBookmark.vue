<template>
<!-- 上方书签组件 -->
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-warpper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :width="20" :height="30"></bookmark>
    </div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { realPx } from '../../utils/utils'
import Bookmark from '../common/Bookmark'// 书签
import { getBookmark, saveBookmark } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  data () {
    return {
      text: '',
      color: '#ffffff',
      isFixed: false
    }
  },
  computed: {
    // 第二阶段，超过后改变提示信息
    height() {
      return realPx(50)
    },
    // 临界值，超过即添加书签
    threshold() {
      return realPx(70)
    },
    // 书签的样式
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    // 监听下拉距离
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
    // 判断当前页是否为书签页
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
    // 添加书签
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
    // 删除书签
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        this.setIsBookmark(false)
      }
    },
    // 重置
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
    // 状态一
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
        this.color = '#ffffff'
        this.isFixed = false
      }
    },
    // 状态二
    beforeThreshold(v) {
      this.$refs.bookmark.style.top = `${-v}px`
      this.beforeHeight()
    },
    // 状态三
    afterThreshold(v) {
      if (v >= 70) {
        v = 100
      }
      this.$refs.bookmark.style.top = `${-v}px`
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = '#ffffff'
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
      color: #000000;
      transition: all .2s linear;
      @include center;
    }
    .ebook-bookmark-text{
      font-size: px2rem(16);
      color: #000000;
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
