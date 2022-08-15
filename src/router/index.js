import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

// 公共路由
export const constantRoutes = [
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden:true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path:'/firstModule',
    component: Layout,
    meta: { title: '模块一', icon: 'documentation'},
    children: [
      {
        path: '/firstPage',
        component: () => import('@/views/firstModule/firstPage'),
        name: 'firstPage',
        meta: { title: '第一页', icon: 'user', affix: false }
      },
      {
        path: '/secondPage',
        component: () => import('@/views/firstModule/secondPage'),
        name: 'secondPage',
        meta: { title: '第二页', icon: 'log', affix: false }
      },
    ]
  },
]
// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
