<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width:300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input v-model="userInfo.password" type="password" style="width:300px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="UploadUserDetail">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailByIdAPI, saveUserDetailByIdAPI } from '@/api'
export default {
  name: 'LoginSetting',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      },
      userDetail: {}
    }
  },
  created() {
    this.getUserDetail()
  },
  methods: {
    async getUserDetail() {
      try {
        const res = await getUserDetailByIdAPI(this.$route.query.id)
        // console.log(res)
        this.userDetail = res.data
        this.userInfo.username = res.data.username
        this.userInfo.password = res.data.password
      } catch (err) {
        this.$message.error(err.message)
      }
    },
    UploadUserDetail() {
      this.$refs.userForm.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const res = await saveUserDetailByIdAPI(this.userDetail)
        // console.log(res)
        this.$message.success(res.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
