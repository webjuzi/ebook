<template>
<!-- 搜索列表页面 -->
  <transition name="hot-search-move">
    <!-- 显示热门搜索数据 -->
    <scroll class="hot-search-warpper" :top="52" @onScroll="onScroll" ref="scroll">
      <hot-search :label="$t('home.hotSearch')" :btn="$t('home.change')" :hotSearch="searchList.hotSearch"></hot-search>
      <div class="line"></div>
      <!-- 显示搜索历史数据 -->
      <hot-search :label="$t('home.historySearch')" :btn="$t('home.clear')" :hotSearch="searchList.historySearch"></hot-search>
    </scroll>
  </transition>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll'
import HotSearch from './HotSearch'
export default {
  mixins: [storeHomeMixin],
  components: {
    Scroll,
    HotSearch
  },
  data() {
    return {
      searchList: {
        hotSearch: [
          {
            type: 1,
            text: '顶部搜索框可用',
            num: '1.8万'
          },
          {
            type: 1,
            text: '下面为假数据',
            num: '1.5万'
          },
          {
            type: 1,
            text: '橘子个人网站：www.zhouyongju.com',
            num: '1.2万'
          }
        ],
        historySearch: [
          {
            type: 2,
            text: '傲世九重天'
          },
          {
            type: 2,
            text: '很纯很暧昧前传'
          },
          {
            type: 2,
            text: '很纯很暧昧'
          },
          {
             type: 2,
            text: '校花的贴身高手'
          },
          {
            type: 2,
            text: '我的美女老师'
          },
          {
            type: 2,
            text: '斗罗大陆'
          },
          {
            type: 2,
            text: '全能跨界王'
          },
          {
             type: 2,
            text: '明天下'
          },
          {
            type: 2,
            text: '金龙仙途'
          },
          {
            type: 2,
            text: '无限先知'
          },
          {
            type: 2,
            text: '深空旅人'
          },
          {
             type: 2,
            text: '无限先知'
          }
        ]
      }
    }
  },
  methods: {
    onScroll(offsetY) {
      // console.log(offsetY)
      this.setHotSearchOffsetY(offsetY)
    },
    reset() {
      this.$refs.scroll.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.hot-search-move {
  width: 100%;
  height: 100%;
  background-color: white;
  .hot-search-warpper{
    .line{
      width: 100%;
      height: 0;
      border-top: px2rem(1) solid #eee;
      margin: px2rem(10) 0;
    }
  }
}
</style>
