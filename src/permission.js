import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, removeToken } from '@/utils/auth'
import { checkUserCenterLogin, outLogin} from '@/utils/userCenter'
import config from '@/config/config'
import store from './store'
import { removeStore } from '@/utils/storage';

NProgress.configure({ showSpinner: false })

const whiteList = ['/401']
let isIhaier

function hasToken (next, to) {
  if (store.getters.roles.length === 0) {
    getInfo(to, next)
  } else {
    next()
  }
}

function noToken(next, to) {
  console.log('没有token111111111111111111111111111')
  checkUserCenterLogin().then(() => {
    getInfo(to, next)
  }, () => {
    next({
      path: '/401'
    })
  })
}

function getInfo (to, next) {
  store.dispatch('GetInfo').then(() => {
    store.dispatch('GenerateRoutes').then(accessRoutes => {
      // 根据roles权限生成可访问的路由表
      router.addRoutes(accessRoutes) // 动态添加可访问路由表
      console.log(to.path)
      next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
    })
  }).catch(err => {
    Message.error(err)
    // outLogin()
    console.log('获取用户信息失败22222222222222222222222222')
    toOutLogin(to, next)
  })
}

function logAgain(to, next) {
  removeToken()
  removeStore('haier-user-center-user-info')
  removeStore('haier-user-center-access-token')
  console.log('to.path1111111111111')
  console.log(to.path)
  if (to.path !== '/index') {
    next({
      path: '/index'
    })
  } else {
    noToken(next, to)
  }
}

function toOutLogin (to, next) {
  if (isIhaier) {
    logAgain(to, next)
  } else {
    outLogin()
  }
}

router.beforeEach((to, from, next) => {
  // 兼容Ihaier
  let isIhaier = /Lark/.test(navigator.userAgent)
  localStorage.setItem('client_userAgent', isIhaier)
  NProgress.start()
  if ((to.name ===  '401' || (to.matched[0] && to.matched[0].path.slice(1)) === '401') && to.query.code) {
    next({
      path: '/'
    })
    NProgress.done()
  }
  if (getToken()) {
    // token存在可直接访问
    console.log(store.getters.roles.length)
    hasToken(next, to)
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else if (config.openUserCenter) {
      // 账户中心对接开启，进行集团账户对接
      if (isIhaier) {
        if (to.path !== '/') {
          next({
            path: '/'
          })
        } else {
          next()
          noToken(next, to)
        }
      } else {
        noToken(next, to)
      }
    } else {
      next()
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
})
router.afterEach(() => {
  NProgress.done()
})
