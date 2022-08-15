<template>
  <div class="app-container home v-view align-center">
    <!--<el-divider />-->
    <div class="box h-view align-center">
      <img src="@/assets/images/icon.png" alt="">
      <span>欢迎访问EUAF管理平台</span>
    </div>
    <img src="@/assets/images/bot.png" alt="">
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.4.0",
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .box{
    margin: 20px 0 80px 0;
  }
  .box span {
    font-size: 26px;
    margin-left: 40px;
    color: rgb(53,53,53);
  }
  // img {
  //   width: 1200px;
  // }
  /*blockquote {*/
    /*padding: 10px 20px;*/
    /*margin: 0 0 20px;*/
    /*font-size: 17.5px;*/
    /*border-left: 5px solid #eee;*/
  /*}*/
}
</style>

