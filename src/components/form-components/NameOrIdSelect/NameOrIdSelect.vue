<template>
  <!-- <el-autocomplete
    v-model="formData.autoValue"
    :fetch-suggestions="querySearchAsync"
    :placeholder="placeholder"
    :size="size"
    :style="styleCss"
    clearable
    @input="input"
    @blur="blur"
    @clear="clear"
    @select="handleSelect"
  ></el-autocomplete> -->
  <el-select
    v-model="formData.userName"
    clearable
    filterable
    remote
    :size="size"
    :placeholder="placeholder"
    :remote-method="querySearchAsync"
    @change="handleSelect"
    @clear="clear"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
import { listByName } from "@/api/system/user";
export default {
  name: "NameOrIdSelect",
  data() {
    return {
      timeout: '',
      loading: false,
      options: undefined
    };
  },
  props: {
    blurHandler: {
      type: Function
    },
    selectResultHandler: {
      type: Function
    },
    clearResultHandler: {
      type: Function
    },
    styleCss: {
      type: String,
      default: 'width:215px'
    },
    placeholder: {
      type: String,
      default: '请输入用户账户或者用户名称'
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
    },
    bindKey: {
      // 选中值的key
      type: String,
      default: 'userName'
    }
  },
  created() {
  },
  methods: {
    querySearchAsync(queryString) {
      clearTimeout(this.timeout)
      if (queryString) {
        this.loading = true
        this.timeout = setTimeout(async () => {
          this.loading = false
          let res = await this.getListByNicknameOrId(queryString)
          res && res.forEach((item) => {
            item.label = item.nickName + '/' + item.userName
            item.value = item.userName
          })
          this.options = res
        }, 50)
      } else {
        this.options = []
      }
    },
    handleSelect(item) {
      console.log('select')
      console.log(item)
      this.formData[this.bindKey] = item
      this.$emit('selectResultHandler', item)
    },
    async getListByNicknameOrId (queryString) {
      let res = await listByName({
        nameParam : queryString,
        pageNum: 1,
        pageSize: 100
      })
      if (res && res.rows) {
        return res.rows
      }
    },
    reset () {
      this.formData[this.bindKey] = ''
      this.formData.userName = ''
    },
    clear () {
      console.log('clear')
      this.formData[this.bindKey] = ''
      this.formData.userName = ''
      this.$emit('clearResultHandler')
      document.activeElement.blur()
    },
    blur () {
      console.log('blur')
      // console.log(this.blurHandler)
      console.log(this.formData.autoValue)
      let currentValue = this.formData.autoValue
      if (currentValue && currentValue.indexOf('/') > -1) {
        let tempArr = currentValue.split('/')
        this.formData[this.bindKey] = tempArr[1]
      } else {
        this.formData[this.bindKey] = this.formData.autoValue
      }
      this.$emit('blurHandler')
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
