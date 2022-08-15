<template>
  <el-autocomplete
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
  ></el-autocomplete>
</template>
<script>
import { listByName } from "@/api/system/user";
export default {
  name: "NameOrIdAuto",
  data() {
    return {
      timeout: ''
    };
  },
  props: {
    blurHandler: {
      type: Function
    },
    inputHandler: {
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
      default: 'userId'
    },
    realKey: {
      // 真实值的key，为解决不同key对应关系
      type: String,
      default: 'userId'
    }
  },
  created() {
  },
  methods: {
    querySearchAsync(queryString, cb) {
      console.log('querySearch')
      clearTimeout(this.timeout)
      if (queryString) {
        // this.formData[this.bindKey] = queryString
        if (queryString.indexOf('/') > -1) {
          let queryArr = queryString.split('/')
          queryString = queryArr[1]
        }
        this.timeout = setTimeout(async () => {
          let res = await this.getListByNicknameOrId(queryString)
          res && res.forEach((item) => {
            item.value = item.nickName + '/' + item.userName
          })
          var results = queryString ? res.filter(this.createStateFilter(queryString)) : res;
          console.log('querySearchresults')
          console.log(results)
          cb(results);
        }, 200)
      } else {
        console.log('333333')
        cb([])
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelect(item) {
      console.log('select')
      console.log(item)
      this.formData[this.bindKey] = item[this.realKey]
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
      this.formData.autoValue = ''
    },
    clear () {
      console.log('clear')
      this.formData[this.bindKey] = ''
      this.formData.autoValue = ''
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
    },
    input (value) {
      /* console.log(this.inputHandler)
      console.log('bbbbbbbbbbbbbbbbbb')
      console.log(value)
      this.formData[this.bindKey] = value
      // this.$emit('inputHandler') */
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
