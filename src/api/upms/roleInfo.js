import request from '@/utils/request'

export const roleService = {
  list: function(params) {
    if (params.createDate) {
      params.createDate = ''
    }
    return request({
      url: '/admin/role/list',
      method: 'get',
      params
    }, { indices: false })
  },
  edit: function(params) {
    return request({
      url: '/admin/role/info',
      method: 'get',
      params
    })
  },
  delete: function(params) {
    return request({
      url: '/admin/role/delete/' + params.roleCode,
      method: 'get'
    })
  },
  save: function(params) {
    return request({
      url: '/admin/role/save',
      method: 'post',
      data: params
    })
  },
  listPerAndRouter: function(params) {
    return request({
      url: '/admin/role/listPerAndRouter/' + params.roleCode,
      method: 'get'
    })
  },
  listAllRoles: function() {
    return request({
      url: '/admin/role/all',
      method: 'get'
    })
  },
  getRoutes: function() {
    return request({
      url: '/admin/router/list',
      method: 'get'
    })
  }
}

