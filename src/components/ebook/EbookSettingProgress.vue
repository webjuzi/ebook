<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{gatReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <input class="progress" type="range" max="100" min="0" step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <div class="progress-section-text">{{getSectionName}}</div>
          <div class="progress-section-percentage">--{{bookAvailable ? progress + '%' : '加载中...'}}--</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { getReadTime } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  computed: {
    getSectionName() {
      if (this.section) {
        const sectionInfo = this.currentBook.section(this.section)
        if (sectionInfo && sectionInfo.href) {
          return this.currentBook.navigation.get(sectionInfo.href).label
          // console.log(this.currentBook.navigation.get(sectionInfo.href))
        }
      }
      return ''
    }
  },
  methods: {
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.displayProhress()
        this.updateProgressBg()
      })
    },
    onProgressInput(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBg()
      })
    },
    displayProhress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      this.display(cfi)
    },
    updateProgressBg() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection() {
      // console.log(this.currentBook)
      if (this.section < this.currentBook.spine.length - 1 && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    },
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
    },
    gatReadTimeText() {
      return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute())
    },
    getReadTimeByMinute() {
      const readTime = getReadTime(this.fileName)
      if (!readTime) {
        return 0
      } else {
        return Math.ceil(readTime / 60)
      }
    }
  },
  updated() {
    this.updateProgressBg()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";

.setting-wrapper {
  position: absolute;
  bottom: px2rem(40);
  left: 0;
  z-index: 160;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(12);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      padding: px2rem(10);
      box-sizing: border-box;
      @include center;
      .progress-icon-wrapper {
        font-size: px2rem(20);
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        margin: 0 px2rem(10);
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background-color: #fff!important;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      box-sizing: border-box;
      @include center;
      .progress-section-text {
        position: absolute;
        bottom: px2rem(10);
        width: 80%;
        text-align: center;
        @include ellipsis;
      }
      .progress-section-percentage {
        position: absolute;
      }
    }
  }
}
</style>
