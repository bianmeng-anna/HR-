<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
              >新增角色</el-button>
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table :data="rolesList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="setRoles(scope.row)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRoles(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[5,10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form :model="formData" label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      <!-- 卡片组件 -->
      </el-card>
      <!-- 卡片组件 -->
      <!-- 弹窗 新增 / 编辑组件 -->
      <!-- 新增弹框 -->
      <el-dialog
        title="新增角色"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @close="cancleRoles"
      >
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 弹窗组件 -->
      <!-- 权限分配弹窗 -->
      <el-dialog :visible.sync="dialogVisible" title="分配权限" :close="dialogVisible">
        <assignPermistin
          :dialogvisible.sync="dialogVisible"
          :permissionlist="permissionList"
          :getpersiiton="getPersiiton"
          @confirmEV="confirm"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRolesAPI, getCompanyInfo, addRoleAPI, updateRoleAPI, delRoleAPI, getPermissionListAPI, getUserRoleAPI, assignPermAPI } from '@/api'
import { mapGetters } from 'vuex'
import assignPermistin from './components/assignPermission.vue'
import { transTree } from '@/utils'
export default {
  components: {
    assignPermistin
  },
  data() {
    return {
      activeName: 'first',
      query: {
        page: 1, // 当前页面
        pagesize: 10 // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      formData: {}, // 公司信息
      showDialog: false,
      dialogVisible: false, // 分配权限的弹窗
      getPersiiton: [],
      roleForm: {
        name: '',
        description: ''
      },
      userId: '',
      isEdit: false,
      editId: '', // 正在编辑的id
      permissionList: [],
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleListByPage()
    this.getCompanyInfo()
    this.getPermissionListFn() // 请求所有权限点数据
  },
  methods: {
    // 请求所有权限点数据
    async getPermissionListFn() {
      const res = await getPermissionListAPI()
      // console.log(res)
      this.permissionList = transTree(res.data, '0')
    },
    // 获取所有角色信息（默认当前页）
    async getRoleListByPage() {
      const res = await getRolesAPI(this.query)
      // console.log(res)
      if (this.query.page.length === 0 && this.query.page > 1) {
        this.query.page--
        this.getRoleListByPage()
        return
      }
      this.rolesList = res.data.rows
      this.total = res.data.total
    },
    // 获取公司信息  当前用户所在公司的信息
    async getCompanyInfo() {
      const res = await getCompanyInfo(this.companyId)
      // this.$store.dispatch('user/')
      // console.log(res)
      this.formData = res.data
    },

    // 每页显示的条数发生改变时触发
    handleSizeChange(size) {
      this.query.pagesize = size
      this.getRoleListByPage()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(page) {
      this.query.page = page
      this.getRoleListByPage()
    },

    // 设置角色
    async setRoles(dataObj) {
      this.getPersiiton = []
      this.dialogVisible = true
      // console.log(dataObj.id)
      this.userId = dataObj.id
      const res = await getUserRoleAPI(dataObj.id)
      // console.log(res)
      this.getPersiiton = res.data.permIds
    },
    async confirm(data) {
      // console.log(data)
      const res = await assignPermAPI({
        id: this.userId,
        permIds: data })
      // console.log(res)
      this.dialogVisible = false
    },

    // 编辑角色
    editRoles(dataObj) {
      this.isEdit = true
      this.roleForm.name = dataObj.name
      this.roleForm.description = dataObj.description
      // this.roleForm.id = dataObj.id

      // console.log(dataObj)
      this.showDialog = true
    },

    // 删除角色
    async delRoles(dataObj) {
      // console.log(dataObj)
      await delRoleAPI(dataObj.id)
      this.getRoleListByPage()
    },
    // 弹框 取消按钮
    cancleRoles() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()

      this.showDialog = false
    },
    // 弹框 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) { // 编辑状态
            await updateRoleAPI({
              id: this.editId,
              ...this.roleForm })
            // const res = await updateRoleAPI(this.roleForm)
            // console.log(res)
          } else {
            await addRoleAPI(this.roleForm)
          }
          this.getRoleListByPage()
          // 重置表单
          this.roleForm = {
            name: '',
            description: ''
          }
          this.$refs.roleForm.resetFields()

          this.showDialog = false
        }
      })
    },
    // el-card第一行 新增按钮
    addRoleBtnFn() {
      this.isEdit = false
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
