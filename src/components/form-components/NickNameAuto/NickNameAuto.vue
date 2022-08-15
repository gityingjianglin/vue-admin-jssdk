<!--
 * @Author: yingjianglin
 * @Date: 2022-07-11 15:50:04
 * @LastEditors: yingjianglin
 * @LastEditTime: 2022-07-19 13:37:45
 * @Description: 
 * 
-->
<template>
  <el-autocomplete
    v-model="formData.nickName"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholder"
    :size="size"
    :debounce="0"
    :highlight-first-item="true"
    style="width:215px"
    clearable
    @clear="clear"
    @select="handleSelect"
  >
  </el-autocomplete>
</template>
<script>
import { listUser } from "@/api/system/user";
export default {
  name: "NickNameAuto",
  data() {
    return {
      timeout: ''
    };
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入用户名称'
    },
    size: {
      type: String,
      default: 'small'
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
  },
  methods: {
    querySearchAsync(queryString, cb) {
      clearTimeout(this.timeout)
      if (queryString) {
        console.log('1')
        this.timeout = setTimeout(async () => {
        let res = await this.getListByNickname(queryString)
        res && res.forEach((item) => {
          item.value = item.nickName
        })
        var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;
        /* if (results.length === 0) {
          cb([{
            value: '无匹配数据'
          }])
        } else {
          cb(results);
        } */
        cb(results);
      }, 200)
      } else {
        cb([])
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log('item')
      console.log(item)
      if (item.value === '无匹配数据') {
        this.formData.nickName = ''
      }
    },
    async getListByNickname (queryString) {
      let res = await listUser({
        nickName: queryString
      })
      if (res && res.rows) {
        return res.rows
      }
    },
    reset () {
      this.formData.nickName = ''
    },
    clear () {
      this.formData.nickName = ''
      document.activeElement.blur()
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
