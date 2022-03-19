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

// 获取用户基本信息 - 获取头像
export const getUserPhotoAPI = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}

// 删除员工
export const delUserAPI = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/**
 * @description: 获取员工详细信息
 * @param {*} id 用户id
 * @return {*}
 */
export function getUserDetailByIdAPI(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * @description: 保存员工信息
 * @param {*} data
 * @return {*}
 */
export function saveUserDetailByIdAPI(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 给员工分配角色
export function assignRolesAPI(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'PUT',
    data
  })
}
