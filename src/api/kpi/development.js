import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/dept',
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
    url: 'ding/kpi/create',
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

// 生效
export function toAction(id) {
  return request({
    url: 'ding/kpi/create/openStatus/' + id,
    method: 'put'
  })
}

// 失效
export function toClose(id) {
  return request({
    url: 'ding/kpi/create/closeStatus/' + id,
    method: 'put'
  })
}

export default { add, edit, del, getDepts, getDeptSuperior, synch, toAction, toClose }
