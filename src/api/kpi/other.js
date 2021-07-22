import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'ding/kpi/getDepts',
    method: 'get',
    params
  })
}

export function getDeptId(deptId) {
  return request({
    url: 'ding/kpi/getDeptUsers/'+deptId,
    method: 'get'
  })
}


export default { getDepts , getDeptId }
