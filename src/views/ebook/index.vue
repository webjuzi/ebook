<template>
<!-- 阅读器 -->
  <div class="ebook" ref="ebook">
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-header></ebook-header>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import EbookReader from '../../components/ebook/EbookReader'// 主体
import EbookTitle from '../../components/ebook/EbookTitle'// 标题
import EbookMenu from '../../components/ebook/EbookMenu'// 菜单
import EbookBookmark from '../../components/ebook/EbookBookmark'// 阅读器上方书签组件
import EbookHeader from '../../components/ebook/EbookHeader'
import EbookFooter from '../../components/ebook/EbookFooter'
import { getReadTime, saveReadTime } from '../../utils/localStorage'

export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  // 监听offsety的变化
  watch: {
    offsetY(v) {
      if (!this.menuVisible) {
        if (v > 0) {
          if (v >= 50) {
            v = 50
          }
          this.move(v)
        } else if (v === 0) {
          this.restore()
        }
      }
    }
  },
  methods: {
    // 还原
    restore() {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      // 还原后清除动画，防止下次下拉的时候卡顿
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    // 下拉
    move(v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    // 记录阅读时间
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
