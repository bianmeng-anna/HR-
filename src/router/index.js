import Vue from 'vue'
import Router from 'vue-router'
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// 动态路由
export const asyncRoutes = [
  approvalsRouter,
  employeesRouter,
  departmentsRouter,
  permissionRouter,
  attendancesRouter,
  socialRouter,
  settingRouter,
  salarysRouter
]

// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */'@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/excel',
    component: Layout,
    hidden: true, // 不需要左侧导航
    children: [{
      path: '',
      component: () => import('@/views/excel')
    }]
  }

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

// 静态和动态合并成一个数组
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...constantRoutes, ...asyncRoutes] // 静态和动态的路由规则合并
  routes: [...constantRoutes]

})

const router = createRouter()

// 重置路由的方法
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
