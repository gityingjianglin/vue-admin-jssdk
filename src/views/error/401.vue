<template>
  <div class="errPage-container">
    <!-- <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button> -->
    <el-row>
      <!-- <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          401错误!
        </h1>
        <h2>您没有访问权限！</h2>
        <h6>对不起，您没有访问权限，请不要进行非法操作！您可以联系系统管理员配置账号</h6>
        <ul class="list-unstyled">
          <li class="link-type" @click="replaceLogin">
            <div>
              重新登录
            </div >
          </li>
        </ul>
      </el-col> -->
      <el-col :span="24" class="err-box">
        <img :src="errGif"  alt="Girl has dropped her ice cream.">
        <p class="errorMsg">{{errMessage}}</p>
        <p>  如有疑问，请联系系统管理员！</p>
        <el-button @click="replaceLogin" type="primary" v-show="isHaier == 'false'">重新登录</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.png'
import { outLogin } from '@/utils/userCenter'
export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      errMessage:'',
      isHaier: ''
    }
  },
  mounted(){
    this.errMessage = localStorage.getItem('errorMessage')
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-1)
      }
    },
    replaceLogin () {
      outLogin()
    }
  },
  created () {
    this.isHaier = localStorage.getItem('client_userAgent')
  }
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 0 auto;
    padding-top: 100px;
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none!important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .err-box{
      text-align: center;
    }
    .errorMsg{
      color: red;
    }
  }
</style>
