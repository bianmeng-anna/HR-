<template>
  <!-- vue内置的组件-动态组件 -->
  <!-- 使用方式:依赖is属性的值,来渲染对应的组件
component占位, 如果is="comA" 相当于这个位置渲染的是<comA></comA>-->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    // 导航链接的地址:
    // 路由地址或者http开头的外链地址
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 如果是外链,此变量为true
    isExternal() {
      return isExternal(this.to)
    },
    // 如果是外链就返回a标签,否则返回 link-router
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      // 如果是外链,返回3个属性和值的对象,给a标签绑定
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener' // 设置a标签的特性,告诉浏览器a的作用
        }
      }
      return { // 不是外链给绑定to属性
        to: to
      }
    }
  }
}
</script>
