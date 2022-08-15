import { login, logout, getInfo, refreshToken, getGroupParam, lodeLogin, getClientId, haierAccountInfo } from '@/api/login'
import { getToken, setToken, setExpiresIn, removeToken } from '@/utils/auth'
import config from '@/config/config'
import { getRedirectUrl, getKeyWithNamespace } from '@/utils/userCenter'
import { getStore, setStore, removeStore } from '@/utils/storage'

const user = {
  state: {
    token: getToken(),
    name: '',
    userId: '',
    roles: [],
    permissions: [],
    grantCode: 'password', // 标注登录方式
    loginType: 'haier_auth',
    clientId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_EXPIRES_IN: (state, time) => {
      state.expires_in = time
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_APPCLIENTID: (state, clientId) => {
      state.clientId = clientId
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      const clientId = user.config.clientId
      const grantCode = user.state.grantCode
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid, clientId, grantCode).then(res => {
          let data = res.data
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          const user = res.user
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
            commit('SET_PERMISSIONS', res.permissions)
          }
          commit('SET_NAME', user.nickName)
          commit('SET_USERID', user.userId)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.token).then(res => {
          setExpiresIn(res.data)
          commit('SET_EXPIRES_IN', res.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((res) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_NAME','')
          removeStore(getKeyWithNamespace('nickName'))
          removeStore(getKeyWithNamespace('clientId'))
          removeStore(getKeyWithNamespace('appClientId'))
          removeStore(getKeyWithNamespace('redirectUrl'))
          removeStore(getKeyWithNamespace('hostName'))
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 配置集团统一登录,调用后端接口获取，cliendtId，tokenUrl是获取当前域名拼接
    /**
     * configUserCenter
     * @param {string} clientId  //账号中心使用S码和系统名称获取cliendtId
     * @param {string} ssoUrl  //账号中心统一登录页域名
     * @param {string} appId   //开放平台创建应用获取（open.feishu.cn）
     * @param {string} clientId  //账号中心使用S码和系统名称获取cliendtId
     * @param {string} tokenUrl  //集成了账号中心提供的后端服务的地址
     * login
     *
     */
     userCenter({commit,state}) {
      // 调用后端接口（clientId+grantCode(写死 haier_auth)）接口调用成功之后配置集团统一账号中心
      return new Promise((resolve, reject) => {
        // 通过euaf平台clientCode，获取euaf平台clientId
        getClientId(config.clientCode).then((data) => {
          if (data.code === 200) {
            let clientId = data.data.clientId // euaf平台clientId
            setStore(getKeyWithNamespace('clientId'), clientId)
            getGroupParam(clientId, 'haier_auth').then(res => {
              if (res.data) {
                // 集团账户中心clientId
                commit('SET_APPCLIENTID', res.data.clientId)
                let redirectUri = getRedirectUrl(res)
                // 存储集团账户中心clientId到本地缓存appClientId
                setStore(getKeyWithNamespace('appClientId'), res.data.clientId)
                setStore(getKeyWithNamespace('redirectUrl'), redirectUri)
                setStore(getKeyWithNamespace('hostName'), res.data.ssoUrl)
                resolve(res)
              }else {
                reject('/nullParams')
              }
            })
          }
        })
      })
    },
    codeLogin({ commit,state }, data) {
      return new Promise(async (resolve, reject) => {
        // 使用euaf平台clientId获取集团账户中心access_token
        let clientId = getStore(getKeyWithNamespace('clientId'))
        if (!clientId) {
          let tempData = await getClientId(config.clientCode)
          if (tempData.code === 200) {
            clientId = tempData.data.clientId // euaf平台clientId
            setStore(getKeyWithNamespace('clientId'), clientId)
          }
        }
        lodeLogin(clientId, data.code, state.loginType).then(res => {
          let data = res.data
          setStore('userNameInfo',data.user_name)
          setToken(data.access_token)
          commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
          console.log(error,error.toString());
          let errorMessage = error.toString().slice(7)
          setStore('errorMessage',errorMessage)
        })
      })
    },
    // 集团token换取euaf业务token
    getUserInfo({ commit }, userInfo){
      return new Promise((resolve, reject) => {
        let params = {
          clientId: getStore(getKeyWithNamespace('clientId')),
          grantCode: 'haier_auth'
        }
        haierAccountInfo(params).then(res => {
          debugger
          console.log('???/',res);
          commit('SET_NAME', res.data.nick_name)
          setStore(getKeyWithNamespace('nickName'),res.data.nick_name)
          setToken(res.data.access_token)
          commit('SET_TOKEN', res.data.access_token)
          setExpiresIn(res.data.expires_in)
          commit('SET_EXPIRES_IN', res.data.expires_in)
          resolve(res)
        }).catch(err => {
          debugger
          reject(err)
        })
      })
    }
  }
}

export default user
