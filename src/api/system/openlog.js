import request from '@/utils/request'

// 查询操作日志记录列表
export function listOpenlog(query) {
    return request({
        url: '/system/openlog/list',
        method: 'get',
        params: query
    })
}

// 查询操作日志记录详细
export function getOpenlog(operId) {
    return request({
        url: '/system/openlog/' + operId,
        method: 'get'
    })
}

// 删除操作日志记录
export function delOpenlog(operId) {
    return request({
        url: '/system/openlog/' + operId,
        method: 'delete'
    })
}

// 清空操作日志记录
export function cleanOpenlog() {
    return request({
        url: '/system/openlog/clean',
        method: 'delete'
      })
}

// 查询应用和对应的端
export function getAppInfo(data) {
    return request({
        url: '/system/app/getAppInfoByLocalUser',
        method: 'post',
        data: data
    })
}
