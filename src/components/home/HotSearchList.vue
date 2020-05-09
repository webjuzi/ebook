<template>
  <transition name="hot-search-move">
    <scroll class="hot-search-warpper" :top="52" @onScroll="onScroll" ref="scroll">
      <hot-search :label="$t('home.hotSearch')" :btn="$t('home.change')" :hotSearch="searchList.hotSearch"></hot-search>
      <div class="line"></div>
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
            text: 'dahjdwaihjdoawjdo',
            num: '1.8万'
          },
          {
            type: 1,
            text: 'qjdoqjod[qkdpqk',
            num: '1.5万'
          },
          {
            type: 1,
            text: 'dadpowkqopkdpqwo',
            num: '1.2万'
          }
        ],
        historySearch: [
          {
            type: 2,
            text: 'dawdwq'
          },
          {
            type: 2,
            text: 'dqd'
          },
          {
            type: 2,
            text: 'dawdbrhwq'
          },
          {
             type: 2,
            text: 'qdadqwd'
          },
          {
            type: 2,
            text: 'dawdwq'
          },
          {
            type: 2,
            text: 'dqd'
          },
          {
            type: 2,
            text: 'dawdbrhwq'
          },
          {
             type: 2,
            text: 'qdadqwd'
          },
          {
            type: 2,
            text: 'dawdwq'
          },
          {
            type: 2,
            text: 'dqd'
          },
          {
            type: 2,
            text: 'dawdbrhwq'
          },
          {
             type: 2,
            text: 'qdadqwd'
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
