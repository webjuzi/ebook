<template>
<!-- 目录组件 -->
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input class="slide-contents-seach-input" v-model="searchText"
          type="text" :placeholder="$t('book.searchHint')"
          @keyup.enter="search()"
          @click="showSearchPage">
      </div>
      <div class="slide-contents-search-cancel"
        v-if="searchVisible" @click="hideSearchPage()">
      {{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt="" class="slide-conmtents-book-img">
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-content-book-title-text">{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-content-book-author-text">{{metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-warpper">
        <div class="slide-conytents-book-progress">
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
          <span class="prohress">:{{progress + '%'}}</span>
        </div>
        <div class="slide-contents-book-time">{{gatReadTimeText()}}</div>
      </div>
    </div>
    <scroll class="slide-content-list" :top="156" :bottom="48" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
        <span class="slide-contents-item-label"
          :class="{'selected': section === index}"
          @click="displayContent(item.href)"
          :style="contentItemStyle(item)">{{item.label}}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll class="slide-search-list" :top="66" :bottom="48"  v-show="searchVisible">
      <div class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayContent(item.cfi, true)"></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../common/Scroll'
import { px2rem } from '../../utils/utils'
export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data () {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    }
  },
  computed: {
    // 获取封面图
    cover() {
      return this.$route.query.url
    }
  },
  methods: {
    // 回车键后全文搜索
    search() {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list
          this.searchList.map(item => {
            // 替换搜索到的关键词的样式
            item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
            return item
          })
        })
      }
    },
    // epubjs全文搜索方法
    doSearch(q) {
      return Promise.all(
          this.currentBook.spine.spineItems.map(section => section.load(this.currentBook.load.bind(this.currentBook))
          .then(section.find.bind(section, q))
          .finally(section.unload.bind(section)))
      ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    displayContent(target, highlight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu()
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target)
        }
      })
    },
    // 根据目录层级计算左边距
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    // 隐藏取消按钮,清空搜索框和列表
    hideSearchPage() {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    },
    // 显示取消按钮
    showSearchPage() {
      this.searchVisible = true
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-seach-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus{
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel{
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(10) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper{
      flex: 0 0 pr2rem(45);
      .slide-conmtents-book-img{
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper{
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title{
        // width: px2rem(153.75);
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include left;
        .slide-content-book-title-text {
          @include ellipsis2(2);
        }
      }
      .slide-contents-book-author{
        font-size: px2rem(12);
        // width: px2rem(153.75);
        line-height: px2rem(14);
        margin-top: px2rem(5);
        @include left;
        .slide-content-book-author-text {
        @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-warpper{
      flex: 0 0 px2rem(70);
      padding-top: px2rem(10);
      .slide-conytents-book-progress{
        .prohress{
          font-size: px2rem(14);
        }
        .progress-text{
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time{
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-content-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
        flex: 1;
      }
   }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
