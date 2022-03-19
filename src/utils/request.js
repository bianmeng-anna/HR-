import axios from 'axios'
import store from '@/store'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // axios请求的完整地址：baseURL + URL
  // 不能让axios去请求http://开头的外链地址，而是要/ 开头还得命中本地开发服务器里代理规则
  // 知识点： 请求的路径问题
  // axios/script标签src/img标签的src/link的href，都会发起一次请求
  // 如果./开关的地址，找当前文件夹
  // 如果是http开头的地址，找到外链外部服务器（链接网络）
  // 如果是/ 开头的地址，忽略文件夹，直接找当前运行时，所在服务器
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 身份过期，后台重返回401，逻辑状态码

    return Promise.reject(error)
  }
)
// 响应拦截器
// 知识点1：axios内部的处理机制
// (1):http状态码为2xx,3xx,就会给Promise对象位置,返回成功的结果(resolve)
// (2):http状态码为4xx,5xx,就会给promise对象位置,返回错误的结果(reject)
// 如果想做一些操作,可以在axios的响应拦截器,自己来处理返回的结果
// 补充:http状态码,由本次请求后,后端进行设置返回的
service.interceptors.response.use(
  response => {
    const { success, message } = response.data
    if (success) {
      return response.data // 直接返回后端数据, 省略一层data
    } else {
      // Message.error(message) // http状态码2xx, 但是逻辑错误
      return Promise.reject(new Error(message)) // 返回Promise错误的对象
    }
  },
  error => {
    if (error && error.response && error.response.status === 401) {
      // 身份过期，删除所有token，重置vuex，强制跳转登陆页
      store.commit('user/RESET_STATE')
      store.commit('user/REMOVE_TOKEN')
      router.replace(`/login?redirect=${router.currentRoute.fullPath}`)
    }
    // console.dir(error)
    return Promise.reject(error) // 内部会删除本地cookie里的token
  }
)

export default service
