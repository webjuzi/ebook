<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
}
// 设置1rem = 屏幕宽度 / 10, 并且上限为50px
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
</script>

<style lang="scss" scoped>
#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #999999;
}
</style>
