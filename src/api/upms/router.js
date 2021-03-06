import request from '@/utils/request'

export function saveRouter(router) {
  return request({
    url: '/admin/router/save',
    method: 'post',
    data: router
  })
}

export function listRouter() {
  return request({
    url: '/admin/router/list',
    method: 'post',
    data: {}
  })
}

export function deleteRouter(id) {
  return request({
    url: '/admin/router/delete',
    method: 'post',
    data: { id: id }
  })
}

export function savePermission(permission) {
  return request({
    url: '/admin/router/savePermission',
    method: 'post',
    data: permission
  })
}

export function deletePermission(id) {
  return request({
    url: '/admin/router/deletePermission',
    method: 'post',
    data: { id: id }
  })
}
export function updateRouter(router) {
  return request({
    url: '/admin/router/update',
    method: 'post',
    data: router
  })
}
