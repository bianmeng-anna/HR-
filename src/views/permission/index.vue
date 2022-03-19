<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addPermission(1,'0')">添加权限</el-button>
        </div>
        <el-table :data="permissionList" border row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button v-if="scope.row.pid==='0'" type="text" @click="addPermission(2,scope.row.id)">添加</el-button>
              <el-button type="text" @click="editPermission(scope.row.id)">编辑</el-button>
              <el-button type="text" @click="delBtn(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 弹窗 -->
      <perDialog
        ref="perForm"
        :showdialog.sync="showPerDialog"
        :isedit="isedit"
        :clickid="clickId"
        :originlist="perList"
        @confirmEV="confirmFn"
      />
    </div>
  </div>
</template>

<script>
import { getPermissionListAPI, addPermissionAPI, updatePermissionAPI, getPermissionDetailAPI, delPermissionAPI } from '@/api'
import { transTree } from '@/utils'
import perDialog from './component/perDialog.vue'
export default {
  components: {
    perDialog
  },
  data() {
    return {
      permissionList: [],
      perList: [],
      showPerDialog: false, // 控制新增权限点的弹窗是否出现
      type: 0, // 添加页面权限 按钮权限
      pid: 0, // 新增权限点pid的值
      isedit: false,
      clickId: ''
    }
  },
  created() {
    this.getPermissionListFn()
  },
  methods: {
    // 获取权限列表
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      // console.log(res)
      this.perList = res.data
      this.permissionList = transTree(res.data, '0')
    },
    // 添加权限方法
    addPermission(type, pid) {
      this.isedit = false
      this.showPerDialog = true
      this.type = type
      this.pid = pid
      this.clickId = pid
    },
    async confirmFn(dataObj) {
      if (this.isedit) {
        const res = await updatePermissionAPI(dataObj)
        this.$message.success(res.message)
      } else {
        const res = await addPermissionAPI({ ...dataObj, type: this.type, pid: this.pid })
        // console.log(res)
        this.$message.success(res.message)
      }

      this.getPermissionListFn()
    },
    // 编辑权限方法
    async editPermission(id) {
      this.isedit = true
      this.showPerDialog = true
      this.clickId = id
      const res = await getPermissionDetailAPI(id)
      this.$refs.perForm.formData = res.data
    },
    // 删除按钮
    async delBtn(id) {
      const res = await delPermissionAPI(id)
      // console.log(res)
      this.$message.success(res.message)
      this.getPermissionListFn()
    }
  }
}
</script>

<style lang="scss" scoped></style>
