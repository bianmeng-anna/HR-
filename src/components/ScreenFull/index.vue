<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon :icon-class="isfullscreen? 'exit-fullscreen':'fullscreen'" class="fullscreen" @click="screenFn" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isfullscreen: false
    }
  },
  created() {
    // 检测全屏的变化 按下ESC键触发
    screenfull.on('change', () => {
      // console.log(screenfull.isFullscreen)
      this.isfullscreen = screenfull.isFullscreen
    })
  },
  methods: {
    screenFn() {
      if (screenfull.isEnabled) {
        screenfull.toggle()
        this.isfullscreen = !this.isfullscreen
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
