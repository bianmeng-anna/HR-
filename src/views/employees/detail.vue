<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <loginSet />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <userInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <jobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import userInfo from './detail/user-info.vue'
import jobInfo from './detail/job-info.vue'
import loginSet from './detail/login-setting.vue'

export default {
  name: '',
  components: {
    userInfo,
    jobInfo,
    loginSet
  },
  data() {
    return {

    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {}
}
</script>
<style lang='less' scoped>

</style>
