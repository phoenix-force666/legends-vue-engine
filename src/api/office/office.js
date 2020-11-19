import request from '@/utils/request'

export const officeService = {
  list: function(params) {
    return request({
      url: '/admin/office/list',
      method: 'get',
      params
    }, { indices: false })
  },
  create: function(params) {
    return request({
      url: '/admin/office/create',
      method: 'post',
      data: params
    })
  },
  delete: function(fileId) {
    return request({
      url: '/admin/office/delete/' + fileId,
      method: 'delete'
    })
  }
}
