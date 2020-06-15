<template>
<!-- 书城-随机列表 -->
  <div class="category-book">
    <title-view :label="categoryText(data.category)" :btn="$t('home.seeAll')" @onClick="showBookCategory"></title-view>
    <div class="category-book-list">
      <div class="category-book-item" v-for="(item, index) in data.list" :key="index" @click="showBookDetail(item)">
        <div class="img-wrapper">
          <img class="img" :src="item.cover">
        </div>
        <div class="content-wrapper">
          <div class="title title-small" ref="title">{{item.fileName}}</div>
          <div class="num sub-title-tiny" ref="author">{{item.author}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TitleView from '@/components/home/Title'
  import { categoryText, getCategoryName } from '@/utils/store'
  import { storeHomeMixin } from '../../utils/mixin'

  export default {
    mixins: [storeHomeMixin],
    components: {
      TitleView
    },
    props: {
      data: Object
    },
    methods: {
      // 查看全部
      showBookCategory() {
        this.$router.push({
          path: '/store/list',
          query: {
            category: getCategoryName(this.data.category),
            categoryText: this.categoryText(this.data.category)
          }
        })
      },
      // 分类名称
      categoryText(category) {
        return categoryText(category, this)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .category-book {
    .category-book-list {
      width: 100%;
      @include top;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .category-book-item {
        flex: 0 0 25%;
        width: 25%;
        padding: 0 px2rem(5);
        box-sizing: border-box;
        .img-wrapper {
          @include center;
          .img {
            width: 100%;
            height: 28vw;
          }
        }
        .content-wrapper {
          .title{
            font-size: px2rem(10);
            @include center;
            @include ellipsis;
          }
          width: 100%;
          margin-top: px2rem(8);
          .num {
            color: darkgrey;
            font-weight: 100;
            @include center;
            margin-top: px2rem(5);
          }
        }
      }
    }
  }
</style>
