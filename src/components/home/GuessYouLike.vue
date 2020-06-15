<template>
<!-- 书城-猜你喜欢 -->
  <div class="guess-you-like">
    <!-- 通用标题组件 -->
    <title-view :label="$t('home.guessYouLike')" :btn="$t('home.change')" @onClick="change"></title-view>
    <div class="guess-you-like-list">
      <div class="guess-you-like-item" v-for="(item, index) in showData" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" :src="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-big" ref="title">{{item.fileName}}</div>
          <div class="synopsis" ref="title">{{item.title}}</div>
          <div class="author sub-title" ref="author">{{item.author}}</div>
          <div class="result third-title" ref="result">{{resultText(item)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TitleView from './Title'
  import { realPx } from '../../utils/utils'
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    mixins: [storeHomeMixin],
    components: {
      TitleView
    },
    props: {
      data: Array
    },
    data() {
      return {
        index: 0,
        total: 0
      }
    },
    watch: {
      // 随机从数据库获取的N本书
      data(v) {
        this.total = v.length / 3
      }
    },
    computed: {
      width() {
        return window.innerWidth - realPx(20) - realPx(60) + 'px'
      },
      // 在随机获取的图书中返回三本书用来显示
      showData() {
        if (this.data) {
          return [
            this.data[this.index],
            this.data[this.index + this.total],
            this.data[this.index + this.total * 2]
          ]
        } else {
          return []
        }
      }
    },
    methods: {
      // 点击换一批的时候回通过增加index从而更换显示的书籍
      change() {
        if (this.index + 1 >= this.total) {
          this.index = 0
        } else {
          this.index++
        }
      },
      // 随机生成猜你喜欢作者下面的信息
      resultText(item) {
        if (item && item.type && item.result) {
          switch (item.type) {
            case 1:
              return this.$t('home.sameAuthor').replace('$1', item.result)
            case 2:
              return this.$t('home.sameReader').replace('$1', item.result)
            case 3:
              return this.$t('home.readPercent').replace('$1', item.percent).replace('$2', item.result)
          }
        }
      },
      resize() {
        this.$nextTick(() => {
          this.$refs.title.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.author.forEach(item => {
            item.style.width = this.width
          })
          this.$refs.result.forEach(item => {
            item.style.width = this.width
          })
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .guess-you-like {
    .guess-you-like-list {
      width: 100%;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .guess-you-like-item {
        display: flex;
        margin-top: px2rem(3);
        &:first-child {
          margin-top: px2rem(5);
        }
        .img-wrapper {
          flex: 0 0 26%;
          padding: px2rem(10) px2rem(10) px2rem(3) 0;
          box-sizing: border-box;
          .img {
            width: 100%;
            height: 25vw;
          }
        }
        .content-wrapper {
          flex: 1;
          padding: px2rem(10) 0;
          box-sizing: border-box;
          .author {
            margin-top: px2rem(10);
            color: #000;
          }
          .result {
            margin-top: px2rem(2);
          }
          .synopsis {
            font-size: px2rem(8);
            @include ellipsis2(2);
            margin-top: px2rem(5);
            color: #777;
          }
        }
      }
    }
  }
</style>
