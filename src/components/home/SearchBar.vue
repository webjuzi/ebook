<template>
<!-- 书城顶部搜索组件 -->
  <div>
    <div class="search-bar" :class="{'hide-title': !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-rapper">
            <span class="icon-text title">{{ $t('home.title')}}</span>
          </div>
          <div class="title-icon-sheke-rapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-rapper" :class="{'hide-title': !titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <!-- 搜索框 -->
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text" class="input" :placeholder="$t('home.hint')" v-model="searchText" @click="showHotSearch"
          @keyup.13.exact="search">
        </div>
      </div>
    </div>
    <!-- 搜索列表页 -->
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import HotSearchList from './HotSearchList'
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data() {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    // 监听屏幕滑动的偏移量
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    // 搜索列表页的滑动偏移量
    hotSearchOffsetY(offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    // 跳转到搜索列表页
    search() {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    // 显示随机图书推荐
    showFlapCard() {
      this.setFlapCardVisible(true)
    },
    // 返回按钮
    back() {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (this.hotSearchVisible) {
        this.hideHotSearch()
      } else {
        this.$router.push('/store/shelf')
      }
    },
    // 隐藏搜索列表页面
    hideHotSearch() {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    // 显示搜索列表页面
    showHotSearch() {
      this.hideTitle()
      this.hotSearchVisible = true
      this.hideShadow()
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    // 隐藏标题
    hideTitle() {
      this.titleVisible = false
    },
    // 显示标题
    showTitle() {
      this.titleVisible = true
    },
    // 隐藏阴影
    hideShadow() {
      this.shadowVisible = false
    },
    // 显示阴影
    showShadow() {
      this.shadowVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.search-bar {
  position: relative;
  z-index: 150;
  width: 100%;
  height: px2rem(94);
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-title{
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none!important;
  }
  .search-bar-title-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    line-height: px2rem(30);
    .title-text-rapper{
      width: 100%;
      text-align: center;
      height: px2rem(42);
    }
    .title-icon-sheke-rapper{
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
    }
  }
  .title-icon-back-rapper{
    z-index: 200;
    position: absolute;
    left: px2rem(15);
    top: 0;
    height: px2rem(42);
    @include center;
    transition: height .2s linear;
    &.hide-title{
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper{
    position: absolute;
    left: 0;
    top: px2rem(42);
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top .2s linear;
    display: flex;
    &.hide-title{
      top: 0;
    }
    .search-bar-blank{
      flex: 0 0 0;
      width: 0;
      transition: all .2s linear;
      &.hide-title{
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input{
      flex: 1;
      border-radius: px2rem(20);
      width: 100%;
      background-color: #f4f4f4;
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      @include left;
      .icon-shake{
        color: #999;
      }
      .input{
        width: 100%;
        height: px2rem(22);
        border: none;
        background-color: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666;
        &:focus{
          outline: none;
        }
        &::-webkit-input-placeholder{
          color: #ccc;
        }
      }
    }
  }
}
</style>
