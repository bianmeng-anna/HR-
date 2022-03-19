<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
              @change="dateChangeFn"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input v-model="userInfo.departmentName" class="inputW" />
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img :imgurl.sync="userInfo.staffPhoto" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>

        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserDetailByIdAPI, saveUserDetailByIdAPI } from '@/api/user'
import EmployeeEnum from '@/api/constant/employees'
import uploadImg from '@/components/uploadImg/index.vue'
import { parseTime } from '@/utils/index'

export default {
  components: {
    uploadImg
  },
  data() {
    return {
      userId: this.$route.query.id,
      EmployeeEnum, // 员工枚举数据
      userInfo: {}

    }
  },
  created() {
    // 调用获取用户信息的 API
    this.loadUserInfoById()
  },
  methods: {
    // 加载用户信息
    async loadUserInfoById() {
      const res = await getUserDetailByIdAPI(this.userId).catch(err => err)
      if (!res.success) return this.$message.error(res.message)
      this.userInfo = res.data
      // console.log(this.userInfo)
      this.userInfo.timeOfEntry = new Date(res.data.timeOfEntry)

      // 时间问题思路:
      // el-data-picker组件内要的是'日期对象'
      // 后台要的是'日期字符串(年-月-日)'
      // 前端ajax接收的响应,就是后台录入了什么就返回什么
      // new Date('2020-01-01') 要求格式必须年-月-日字符串才行
      // console.log(new Date(res.data.timeOfEntry))
    },
    // 保存用户信息
    async saveUser() {
      if (this.userInfo.timeOfEntry instanceof Date) {
        this.userInfo.timeOfEntry = parseTime(this.userInfo.timeOfEntry).split(' ')[0]
      }
      await saveUserDetailByIdAPI(this.userInfo)
      this.$message.success('保存更新成功')
    },
    // 日期选择 ->改变时事件方
    dateChangeFn(dateObj) {
      this.userInfo.timeOfEntry = parseTime(dateObj).split(' ')[0]
    }

  }
}

</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }

</style>
