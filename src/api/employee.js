import request from '@/utils/request'

export function getEmloyeesList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

// 添加员工
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

// 添加员工
export function importEmployeeAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取用户详细信息
 * @param {*} id 用户id
 * @return {*}
 */

