<template>
  <el-select :style="styleCss" v-model="formData.appId" placeholder="请选择" @change="selectChange" @clear="clear" class="inline-input" :size="size" clearable>
    <el-option
      v-for="item in appListOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>
<script>
import { getAppInfo } from "@/api/system/user"
export default {
  name: "AppSelectCom",
  data() {
    return {
      appId: '',
      appListOptions: []
    };
  },
  props: {
    selectHandler: {
      type: Function
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
    dataLevel: {
      type: Number,
      default: 1
    },
    styleCss: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getAppList()
  },
  methods: {
    /**
     * @description: 查询所有应用信息
     * @params dataLevel: 数据层级：1-应用；2-应用+客户端；3-应用+客户端+角色
     * @return {*}
     */
    getAppList () {
      let params = {
        dataLevel: this.dataLevel
      }
      getAppInfo(params).then(res => {
        console.log('获取所有应用信息', res);
        let result = res.data
        result.forEach((item) => {
          item.value = item.appId
          item.label = item.appName
        })
        this.appListOptions = result
      })
    },
    selectChange (appId) {
      this.appListOptions.forEach((item) => {
        if (item.appId === appId) {
          this.$emit('selectHandler', item)
        } 
      })
    },
    reset () {
      this.formData.appId = ''
    },
    clear () {
      this.formData.appId = ''
      // this.$emit('selectHandler', {})
    }
  },
};
</script>
<style lang="scss" scoped>
</style>
