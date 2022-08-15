import request from '@/utils/request'
// 批量发送邮件功能
export function sendEmail(data) {
  return request({
    url: '/cms/notice/email/send',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 金控全员发送邮件功能
export function sendAllEmail(data) {
  return request({
    url: '/cms/notice/email/sendAll',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 邮件发送列表
export function emailLog(data) {
  return request({
    url: '/cms/notice/emailLog',
    headers: {
      isToken: false
    },
    method: 'get',
    params: data
  })
}
