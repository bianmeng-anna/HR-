<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- element隐藏组件（文档上没有） -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 侧边栏导航菜单 -->
      <!-- unique-opened：是否只支持一个菜单显示（false不需要这个项目） -->
      <!-- 模板项目用的是宽度改变的css3动画->自己写的 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 每个sidebar-item就是菜单的每一项
      2,routers规则数组,route里面每项规则对象 -->
        <!-- route.path ->规则path路径 / approvals -->
        <!-- item="组件对象" -->
        <!-- base-path="一级路由的地址" -->
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
// 知识点：js局部变量只能在js里使用
// 如果想在上面的标签里使用（模板语法里的data/computed里定义的变量，看53行）

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // 路由规则数组
    routes() {
      // 这行代码 -> 拿到当前路由对象里规则数组
      // console.log(this.$router.options.routes)
      // return this.$router.options.routes
      return this.$store.state.permission.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    // 样式变量
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
