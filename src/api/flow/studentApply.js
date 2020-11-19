import request from '@/utils/flowRequest'
import qs from 'qs'

export const studentApplyService = {
  list: function(params) {
    return request({
      url: '/flow/rest/task',
      method: 'get',
      params
    })
  },
  count: function(params) {
    return request({
      url: '/flow/rest/task/count',
      method: 'get',
      params
    })
  },
  submitForm: function(params) {
    return request({
      url: '/admin/studentApply/saveinfo',
      method: 'post',
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
      params
    })
  },
  complete: function(id, params) {
    return request.get('/flow/rest//task/' + id + '/complete', params)
  }
}

