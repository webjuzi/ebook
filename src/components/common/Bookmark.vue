<template>
<!-- 书签 -->
  <div class="bookmark" :style="style" ref="bookmark"></div>
</template>

<script>
import { px2rem } from '../../utils/utils'
export default {
  props: {
    width: Number,
    height: Number,
    color: String
  },
  computed: {
    // 根据传递的值设置书签的颜色
    style() {
      if (this.color) {
        return {
          borderColor: `${this.color} ${this.color} transparent ${this.color}`
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    // 计算宽高
    refresh() {
      if (this.width && this.height) {
        this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 10)}rem ${px2rem(this.width / 2)}rem ${px2rem(10)}rem ${px2rem(this.width / 2)}rem`
      }
    }
  },
  mounted() {
    this.refresh()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.bookmark {
  width: 0;
  height: 0;
  border-width: px2rem(30) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  border-color: #ffffff #ffffff transparent #ffffff;
}
</style>
