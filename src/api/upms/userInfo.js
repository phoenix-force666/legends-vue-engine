import request from '@/utils/request'

export function saveUser(data) {
  return request({
    url: '/admin/userInfo/save',
    method: 'post',
    data: data
  })
}

export function listUser(params) {
  return request({
    url: '/admin/userInfo/list',
    method: 'post',
    data: params
  })
}
export function deleteUser(params) {
  return request({
    url: '/admin/userInfo/delete',
    method: 'post',
    data: params
  })
}
export function saveUserRole(userRoles) {
  return request({
    url: '/admin/userInfo/saveUserRole',
    method: 'post',
    data: userRoles
  })
}
export function listUserRoles(userRoles) {
  return request({
    url: '/admin/userInfo/listUserRoles',
    method: 'post',
    data: userRoles
  })
}
export function loadViewMenuData(roles) {
  return request({
    url: '/admin/userInfo/viewMenu',
    method: 'post',
    data: roles
  })
}
export function checkLoginNameUnique(roles) {
  return request({
    url: '/admin/userInfo/checkLoginNameUnique',
    method: 'post',
    data: roles
  })
}
export function loadUserDept(userid) {
  return request({
    url: '/admin/userInfo/loadUserDept',
    method: 'post',
    data: { userId: userid }
  })
}
