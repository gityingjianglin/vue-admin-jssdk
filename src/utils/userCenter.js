/*
 * @Author: yingjianglin
 * @Date: 2022-06-23 09:41:36
 * @LastEditors: yingjianglin
 * @LastEditTime: 2022-07-05 11:37:08
 * @Description: 
 * 
 */
import store from '@/store/index'
import config from '@/config/config'
import { getQueryString } from '@/utils/index'

let _getKeyWithNamespace = (sourceKey) => {
  return config.namespace + '_' + sourceKey
}

/**
   * getRedirectUrl
   * @param {resRedirectUrl} resRedirectUrl  // EUAF平台
   * login
   *
  */
// 获取对接账户中心开发/生产redirectUrl
export const getRedirectUrl = (res) => {
  let redirectUrl = ''
  if (process.env.NODE_ENV === 'development') {
    // 开发环境配置本地redirectUrl
    redirectUrl =  encodeURIComponent(`${config.devUserCenterInfo.localUrl}`)
  } else {
    // 生产环境获取接口获取redirectUrl, 
    redirectUrl =  encodeURIComponent(res.data.redirectUri + 'index.html')
  }
  return redirectUrl
}

export const outLogin = (val) => {
  store.dispatch('userCenter').then(res => {
    let appClientId = res.data.clientId
    console.log(appClientId,localStorage.getItem(_getKeyWithNamespace('appClientId')),window.location.href);
    store.dispatch('LogOut').then(outRes => {
      console.log(outRes, '登出成功');
      debugger
      window.__USERCENTER__.configUserCenter({
        clientId: res.data.clientId,
        ssoUrl: res.data.ssoUrl,
        appId: '',
        tokenUrl: res.data.tokenUrl,
        // redirectUri: 'http://127.0.0.1:80'
      });
      window.__USERCENTER__.logout().then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err,'err');
      })
    })
  })
}

export const checkUserCenterLogin = () => {
  console.log("11111111");
  debugger
  return new Promise((resolve,reject) => {
    localStorage.removeItem('haier-user-center-access-token')
    store.dispatch('userCenter').then(res => {
      console.log(res, 'userCenter');
      window.__USERCENTER__.configUserCenter({
        clientId: res.data.clientId,
        ssoUrl: res.data.ssoUrl,
        appId: '',
        tokenUrl: res.data.tokenUrl,
        // redirectUri: window.location.href
        // redirectUri: 'https://www.baidu.com'
      })
      debugger
      window.__USERCENTER__.login().then(res => {
        console.log('登录成功', res);
        if (res.success) {
          store.dispatch('getUserInfo').then(res => {
            if(res.code === 200) {
              resolve()
            }
          }).catch(err => {
            reject(err)
          })
        }
      }).catch(err => {
        reject()
        console.log('登陆失败', err);
      })
    })
  })
}

export const getKeyWithNamespace = _getKeyWithNamespace
