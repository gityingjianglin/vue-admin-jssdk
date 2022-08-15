<template>
  <div class="errPage-container">
    <!-- <el-button icon="arrow-left" class="pan-back-btn" @click="back">
      返回
    </el-button> -->
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">
          配置参数缺失!
        </h1>
        <h2>您没有登录权限！</h2>
        <h6>对不起，您的系统未正确配置集团授权登录所需的参数，请联系系统管理员配置参数</h6>
        <ul class="list-unstyled">
          <li class="link-type" @click="login">
            <!-- <router-link to="/"> -->
              回首页
            <!-- </router-link> -->
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date()
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-1)
      }
    },
    login() {
       window.__USERCENTER__.login({force:true}).then(loginRes => {
          console.log(loginRes,'login');
        }).catch(err => {
        })
    }
  },
  mounted () {
    console.log(this.$store.getters.userData, 'userData')
  },
}
</script>

<style lang="scss" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
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
  }
</style>
