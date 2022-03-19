import request from '@/utils/request'

export const departmentsListAPI = () => {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

// 组织架构-- 部门负责人列表数据

export function getEmployeeSimpleAPI() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

// 新增部门

export function addDepartmentsAPI(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

export const getDepartListbyId = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

// 更新部门详情
export const updateDepartmentAPI = (data) => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

// 删除部门详情
export const delDepartmentAPI = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

