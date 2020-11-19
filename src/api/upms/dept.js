import request from '@/utils/request'

export const deptService = {
  list: function(params) {
    if (!params) {
      params = {}
      params.name = ''
    }
    return request({
      url: '/admin/dept/list',
      method: 'get',
      params
    }, { indices: false })
  },
  edit: function(params) {
    return request({
      url: '/admin/dept/info',
      method: 'get',
      params
    })
  },
  delete: function(params) {
    return request({
      url: '/admin/dept/delete/' + params.roleCode,
      method: 'get'
    })
  },
  save: function(params) {
    return request({
      url: '/admin/dept/save',
      method: 'post',
      data: params
    })
  }
}

