import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'ding/kpi/getDepts',
    method: 'get',
    params
  })
}

// 详情
export function detailTable(kpiId, params) {
  return request({
    url: 'ding/kpi/create/detail/item/' + kpiId,
    method: 'get',
    params
  })
}

// kpi标题
export function getTitle(params) {
  return request({
    url: 'ding/kpi/create/page',
    method: 'get',
    params
  })
}

export function getDeptSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/dept/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'ding/kpi/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'ding/kpi/create',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/ding/kpi/create/detail/item',
    method: 'put',
    data
  })
}

export function synch(data) {
  return request({
    url: 'ding/kpi/create/detail',
    method: 'post',
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior, synch, getTitle, detailTable }
