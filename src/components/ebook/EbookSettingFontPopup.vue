<template>
  <div class="ebook-popup-list" v-show="fontFamilyVisible">
    <div class="ebook-popup-title">
      <div class="ebook-popup-title-icon" @click="hide">
        <span class="icon-down2"></span>
      </div>
      <span class="ebook-popup-list-text">{{$t('book.selectFont')}}</span>
    </div>
    <div class="ebook-popup-list-wrapper">
      <div class="ebook-popup-item"
        v-for="(item, index) in fontFamilyList" :key="index"
        @click="setFontFamily(item.font)">
        <div class="ebook-popup-item-text"
          :class="{'selected': isSelected(item)}">
          {{ item.font }}
        </div>
        <div class="ebook-popup-item-check" v-if="isSelected(item)">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FONT_FAMILY } from '../../utils/book'// 引入字体列表
import { ebookMixin } from '../../utils/mixin'
import { saveFontFamily } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: FONT_FAMILY
    }
  },
  methods: {
    isSelected(item) {
      return this.defaultFontFamily === item.font
    },
    setFontFamily(font) {
      this.setDefaultFontFamily(font)// 传入点击的字体
      saveFontFamily(this.fileName, font)
      if (font === 'Default') {
        // 默认字体
        this.currentBook.rendition.themes.font('Times New Roman')
      } else {
        this.currentBook.rendition.themes.font(font)
      }
    },
    hide() {
      this.setFontFamilyVisible(false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, .1);
  .ebook-popup-title {
    position: relative;
    text-align: center;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9bb;
    @include center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      font-size: px2rem(16);
      font-weight: 700;
      @include center;
    }
    .ebook-popup-list-text {
      font-size: px2rem(14);
      font-weight: bold;
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popup-item{
      padding: px2rem(15);
      display: flex;
      .ebook-popup-item-text{
        flex: 1;
        font-size: px2rem(14);
        text-align: left;
        &.selected {
          font-weight: 700;
          color: #246cb9;
        }
      }
      .ebook-popup-item-check{
        flex: 1;
        text-align: right;
        font-size: px2rem(14);
        font-weight: 700;
        color: #246cb9;
      }
    }
  }
}
</style>
