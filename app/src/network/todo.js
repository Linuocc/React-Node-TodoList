import {request} from "./request";

/**
 * 获取任务分页列表
 * @param status
 * @param page
 * @returns {AxiosPromise}
 */
export function getTodoList(status, page, limit) {
  return request({
    url: `/list/${status}/${page}/${limit}`
  })
}

/**
 * 修改任务状态
 * @param id
 * @param status
 * @returns {AxiosPromise}
 */
export function changeStatus(id, status) {
  return request({
    method: 'post',
    url: '/update_status',
    data: {
      id,
      status
    }
  })
}

export function update(data = {}) {
  return request({
    method: 'post',
    url: '/update',
    data
  })
}

export function add(data = {}) {
  return request({
    method:'post',
    url:'/create',
    data
  })
}
