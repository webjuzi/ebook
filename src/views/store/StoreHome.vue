<template>
<!-- 书城首页 -->
  <div class="store-home">
    <!-- 书城顶部搜索组件 -->
    <search-bar></search-bar>
    <!-- 随机推荐组件 -->
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <!-- 首页焦点图 -->
      <div class="banner-wrapper">
        <img :src="banner" class="banner-img">
      </div>
      <!-- 猜你喜欢 -->
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <!-- 热门推荐 -->
      <recommend :data="recommend" class="recommend"></recommend>
      <!-- 精选 -->
      <featured :data="featured" :titleText="($t('home.featured'))" :btnText="($t('home.seeAll'))" class="featured"></featured>
      <!-- 随机列表 -->
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <!-- 分类 -->
      <category :data="categories" class="category"></category>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import Scroll from '../../components/common/Scroll'
import FlapCard from '../../components/home/FlapCard'
import GuessYouLike from '../../components/home/GuessYouLike'
import Recommend from '@/components/home/Recommend'
import Featured from '@/components/home/Featured'
import CategoryBook from '@/components/home/CategoryBook'
import Category from '@/components/home/Category'
import { storeHomeMixin } from '../../utils/mixin'
import { home } from '../../api/store'
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  methods: {
    // 滑动偏移量
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
      // 往下滑动的时候变换滑动组件的top值
      if (offsetY > 0) {
        this.scrollTop = 54
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
    }
  },
  mounted() {
    // 获取首页数据
    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data
        // const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categories = data.categories
      }
    })
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper{
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img{
      width: 100%;
      height: px2rem(140);
    }
  }
  .recommend{
    margin-top: px2rem(20)
  }
  .featured {
    margin-top: px2rem(20)
  }
  .category-list-wrapper{
    margin-top: px2rem(20)
  }
  .category {
    margin-top: px2rem(20)
  }
}
</style>
