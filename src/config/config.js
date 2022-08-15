/*
 * @Author: yingjianglin
 * @Date: 2022-06-23 09:38:56
 * @LastEditors: yingjianglin
 * @LastEditTime: 2022-07-05 11:59:25
 * @Description: 
 * 
 */
let config = {
  namespace: 'vue-admin', // 必须设置，项目命名空间，以gitlab项目标识串为准，为解决同一个域名下面的本地存储问题，本地存储一律加上项目namespace-appId
  openUserCenter: true, // 是否开启账户中心登录
  clientCode: 'FA000901', // euaf平台客户端code，用于换取euaf平台cliengId（非集团账户中心clientId）
  devUserCenterInfo: {
    localUrl: 'http://127.0.0.1'
  }
}
module.exports = config
