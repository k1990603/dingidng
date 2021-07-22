import request from '@/utils/request'

export function getTemplate(params) {
  return request({
    url: 'api/dept',
    method: 'get',
    params
  })
}

export function getTemplateuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/dept/superior',
    method: 'post',
    data
  })
}

// 详情
export function detailTable(kpiId, params) {
  return request({
    url: 'ding/kpi/getModel/'+kpiId,
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'ding/kpi/model',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'ding/kpi/model',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'ding/kpi/model',
    method: 'put',
    data
  })
}

export function synch(data) {
  return request({
    url: 'api/synchronous/ding/dept',
    method: 'post',
    data
  })
}

export function getDepts(params) {
  return request({
    url: 'ding/kpi/getDepts',
    method: 'get',
    params
  })
}

// 根据部门查用户
export function getDeptId(deptId) {
  return request({
    url: 'ding/kpi/getDeptUsers/'+deptId,
    method: 'get'
  })
}

// 查所有用户
export function getUsers() {
  return request({
    url: 'ding/kpi/getUsers',
    method: 'get'
  })
}


export default { detailTable, add, edit, del, getTemplate, getTemplateuperior, synch, getDepts , getDeptId, getUsers }
