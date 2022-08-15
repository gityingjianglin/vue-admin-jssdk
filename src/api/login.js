import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid, clientId, grantCode) {
  return request({
    url: '/auth/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: { username, password, code, uuid, clientId, grantCode }
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 刷新方法
export function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

/**
 * 通过euaf平台clientCode，换取euaf平台clientId
 * @param {string} clientCode  // euaf平台客户端code
 * getClientId
 *
 */
 export function getClientId(clientCode) {
  return request({
    url: `/system/client/getClientId/${clientCode}`,
    method: 'get'
  })
}

/**
 * 获取系统的集团配置参数，使用euaf平台clientId，获取集团账户中心相关参数
 * @param {string} clientId  // euaf平台clientId
 * lodeLogin
 *
 */
export function getGroupParam(clientId, grantCode) {
  return request({
    url: 'system/client/getHaierAuthConfig/' + clientId + '/' + grantCode,
    method: 'get'
  })
}

// 获取项目EUAFtoken
export function haierAccountInfo(params, opts) {
  return request({
    url: `/auth/haierAccountInfo/${params.clientId}/${params.grantCode}`,
    method: 'get'
  })
}

/**
 * 获取集团access_token
 * 使用clientId，code换取登录参数，获取用户登录token凭据
 * @param {string} clientId  // euaf平台clientId
 * lodeLogin
 *
 */
export function lodeLogin(clientId, code, loginType) {
  return request({
    url: 'auth/haierLogin/' + clientId + '/' + loginType + '?code='+ code,
    method: 'get'
  })
}
