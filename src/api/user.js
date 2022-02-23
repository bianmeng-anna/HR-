import request from '@/utils/request'
import { to } from '@/utils/awaitTo'
// 知识点1：axios默认会把data（请求体）转成JSON字符串发给后台
// 自己携带请求头Content-Type：application/json（看network调试）

// export const loginAPI = (data) => {
//   return request({
//     url: '/sys/login',
//     method: 'post',
//     data
//   })
// }

export const loginAPI = (data) => {
  const pA = request({
    url: '/sys/login',
    method: 'post',
    data
  })
  const pB = to(pA)
  return pB
}

// 获取用户资料
export function getUserProfileAPI() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
