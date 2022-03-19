import router from './router'
import { asyncRoutes } from './router'
import store from './store'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/get-page-title'
// import { getUserProfileAPI } from '@/api/user'

// const whiteList = ['/login', '/404'] // no redirect whitelist
// 基础权限拦截
// 1，登录状态下，不能手动切换到login页面，如果切换强制回到/首页
// 2，未登陆状态下，只能去login（白名单）页面，其他页面不能跳转

// 前置守卫
router.beforeEach(async(to, from, next) => {
  Nprogress.start()
  const token = store.getters.token
  if (token) { // 登录
    if (to.path === '/login') { // 登录状态 要去登陆页
      next('/')
    } else {
      next()
      // 如果没有名字，先请求成功后，再放行
      // 如果有名字了if进不去  也要放行
      if (!store.getters.name) {
        await store.dispatch('user/getUserInfoActions')
      }
      if (!store.getters.isHavaAsyncRote) {
        store.commit('app/SET_ASYNCROUTE') // 修改状态，已经挂载了路由状态
        const menusArr = store.getters.menus
        const asyncRoutesArr = asyncRoutes.filter(item => {
          return menusArr.includes(item.children[0].name.toLowerCase())
        })
        // console.log(asyncRoutes)
        router.addRoutes(asyncRoutesArr)
        asyncRoutesArr.push({ path: '*', redirect: '/404', hidden: true })

        // 为了让左侧导航显示静态+ 动态路由
        store.commit('permission/setRoutes', asyncRoutesArr)
        // console.log(asyncRoutes)
        // console.log(asyncRoutesArr)
        // console.log(menusArr)
        // 跳转-》空白页 -> 跳转动态路由 ->404 *的通配符 ->重定向到当前刷新的这个页面
        // console.log(to.path)
        next({
          path: to.path,
          replace: true // next() 路由重定向，类似this.router.replace()
        })
      }
    }
  } else { // 未登录
    if (to.path === '/404' || to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
  next()
})

// 后置守卫
router.afterEach((to, from) => {
  Nprogress.done()
  // 网页切换完毕,再设置当前切换完毕的这个页面的标题
  document.title = getPageTitle(to.meta.title)
  // console.log(to)
})
