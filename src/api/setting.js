import request from '@/utils/request'

export const getRolesAPI = params => {
  return request({
    url: '/sys/role',
    params
  })
}

// 根据id获取企业信息
export const getCompanyInfo = (id) => {
  return request({
    url: `/company/${id}`
  })
}

// 新增角色
export const addRoleAPI = data => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 更新角色
export const updateRoleAPI = data => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 删除角色
export const delRoleAPI = id => {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
// 获取角色详情
export const getUserRoleAPI = id => {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}

/**
 * 给角色分配权限
 * @param {*} data {id:角色id, permIds:[] 所有选中的节点的id组成的数组}
 * @returns
 */
export function assignPermAPI(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

