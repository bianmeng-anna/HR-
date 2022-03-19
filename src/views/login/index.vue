<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="">
        </h3>
      </div>

      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="mobile"
          v-model="loginForm.mobile"
          placeholder="mobile"
          name="mobile"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <el-button
        class="login_btn"
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <span style="margin-right: 20px">手机号：13800000002</span>
        <span> 密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validmobile } from '@/utils/validate'
// import { getUserProfileAPI } from '@/api/user'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    const validatemobile = (rule, value, callback) => {
      if (!validmobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    return {
      // 登陆表单的数据对象
      loginForm: {
        mobile: '13800000002',
        password: '123456'
      },
      loginRules: {
        mobile: [
          { required: true, trigger: 'blur', validator: validatemobile }
        ],
        password: [
          {
            required: true,
            min: 6,
            max: 16,
            message: '密码6-16位',
            trigger: 'blur'
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    // 监测路由对象的改变 页面跳转
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect // 未遂地址
      },
      immediate: true
    }
  },
  methods: {
    //  (模块名,映射出来的方法)
    ...mapActions('user', ['loginActions']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录的点击事件
    handleLogin() {
      // 兜底校验
      this.$refs.loginForm.validate(async(valid) => {
        if (valid) { // 通过校验
          this.loading = true // 按钮设置为加载中 转圈
          // 知识点1:await只能拿到成功的结果,如果Promise对象内用reject()返回,这里就中断不往下执行
          // 知识点2:当promise对象这里,没有自己捕获到错误(try+catch)
          // 知识点3:捕获promise的错误两种方式
          // 通用的:try+catch
          // 只针对promise的: await promise对象.catch(err => err)
          // res 既能拿到成功的数据,也能拿到catch()里函数返回的值
          // console.error()函数调用在原地无返回值undefined, => 默认返回undefined给res

          const [err, res] = await this.loginActions(this.loginForm)
          // console.log(res)
          if (err) this.$message.error(err.message)
          else {
            this.$message.success(res.message)
            // this.$store.commit('user/SET_TOKEN', res.data)
            // 用replace跳转 不用后退
            this.$router.replace(this.redirect || '/') // this.$router.push('/')
            // 如果有未遂地址 跳转 没有 跳转首页
          }
          this.loading = false
          // this.$commit('user/',res.data)

          // console.log('下面')
        } else {
          // console.log('表单校验失败')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #68b0fe; // 将输入框颜色改成蓝色
$cursor: #68b0fe; // 将输入框光标改成蓝色

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.login_btn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url("~@/assets/common/login.jpg");
  background-position: center;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
