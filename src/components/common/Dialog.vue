<template>
  <transition name="fade">
    <div class="dialog" v-show="visible">
      <div class="dialog-wrapper">
        <div class="dialog-title-wrapper">
          <span class="dialog-title-text">{{title}}</span>
        </div>
        <slot></slot>
        <div class="dialog-btn-wrapper">
          <slot name="btn">
            <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
            <div class="dialog-btn">{{$t('shelf.confirm')}}</div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {

}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
</style>
