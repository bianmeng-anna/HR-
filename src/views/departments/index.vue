<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <template slot="header">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织架构" name="first" class="tab-pane">
              <el-row type="flex" justify="space-between" align="middle" class="department-header">
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col :span="12">负责人</el-col>
                    <el-col :span="12">
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add()">添加子部门</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-tree class="departments-tree" :data="treeData" :props="defaultProps" :default-expand-all="true">
                <!-- 默认插槽  并且使用内部的数据进行自定义模板的渲染, scope.data 所以直接key解构赋值变量也是data(对应数据对象)-->
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%;"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                              <el-dropdown-item @click.native="edit(data)">编辑部门</el-dropdown-item>
                              <el-dropdown-item
                                v-if="!data.children"
                                @click.native="del(data)"
                              >删除部门</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </template>

      </el-card>

      <!-- 新增部门的弹窗 -->
      <departDialog ref="departDialog" :dialog-visible.sync="showDepartDialog" :employeeslist="employeesList" :originlist="originList" :edit="isEdit" :parentid="clickDepartId" @departEV="addOrEditDepart" />
    </div>
  </div>
</template>
<script>
import { departmentsListAPI, getEmployeeSimpleAPI, addDepartmentsAPI, getDepartListbyId, updateDepartmentAPI, delDepartmentAPI } from '@/api'
import { transTree } from '@/utils'
import departDialog from './components/departDialog.vue'
export default {
  name: 'Departments',
  components: {
    departDialog
  },
  data() {
    return {
      activeName: 'first', // 被激活的 Tab 标签页
      // 树形控件数据
      treeData: [
        {
          departName: '总裁办',
          name: '孙财'
        },
        {
          departName: '行政部',
          name: '罗晓晓'
        },
        {
          departName: '人事部',
          name: '安小晴',
          children: [
            {
              departName: '财务核算部'
            }
          ]
        },
        {
          departName: '财务部',
          name: '',
          children: [
            {
              departName: '财务核算部'
            },
            {
              departName: '税务管理部'
            },
            {
              departName: '薪资管理部'
            }
          ]
        },
        {
          departName: '技术部',
          name: '',
          children: [
            {
              departName: '前端技术部'
            },
            {
              departName: '后端技术部'
            }
          ]
        },
        {
          departName: '运营部',
          name: ''
        },
        {
          departName: '市场部',
          name: '武高丽',
          children: [
            {
              departName: '市场部1'
            },
            {
              departName: '市场部2'
            }
          ]
        }
      ],
      // 定义结构显示
      defaultProps: {
        children: 'children',
        label: 'departName'
      },
      showDepartDialog: false,
      employeesList: [],
      clickDepartId: '',
      isEdit: false,
      originList: [] // 用来放置校验code和name是否重复数据数组
    }
  },
  created() {
    this.getDepartmentsListFn()
    this.getEmployeesListFN()
  },
  methods: {
    // 树节点的点击事件
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 请求部门列表
    async getDepartmentsListFn() {
      const res = await departmentsListAPI()
      // 格式化需要传递给子组件的数据
      // 一 。定义空数组originList 用来放置校验code和name是否重复数据数组
      // 二。遍历这个数据 把返回的值 赋值给空数组originList
      // map遍历返回新数组
      this.originList = res.data.depts.map(item => ({
        name: item.name,
        code: item.code,
        manager: item.manager,
        pid: item.pid

      })

      )

      // console.log(res.data.depts)
      // 处理数据，找''的下属（一级部门）
      this.treeData = transTree(res.data.depts, '')
    },
    // 右侧添加
    add(data) {
      if (data) {
        this.isEdit = false
        this.clickDepartId = data.id
        this.showDepartDialog = true
      } else {
        this.clickDepartId = ''
        this.showDepartDialog = true
      }
    },
    // 右侧删除
    async del(data) {
      // 显示删除确认消息对话框
      // const delRes = await this.$confirm('此操作将永久删除部门, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).catch(err => err)

      // // 如果返回的结果是 cancel 说明用户取消了删除
      // if (delRes === 'cancel') return this.$message('您取消了删除')
      // if (data.children && data.children.length > 0) return
      await delDepartmentAPI(data.id)
      this.$message.success('删除成功')
      this.getDepartmentsListFn()
    },
    // 右侧编辑
    edit(data) {
      this.isEdit = true
      this.clickDepartId = data.id
      this.showDepartDialog = true
      // 数据修改->真实DOM更新是异步的，所以确保弹窗出现后请求数据回填写
      this.$nextTick(async() => {
        const res = await getDepartListbyId(data.id)
        // console.log(res)
        // 直接选中里面form  再赋值
        this.$refs.departDialog.form = res.data
      })
    },
    async getEmployeesListFN() {
      const res = await getEmployeeSimpleAPI()
      this.employeesList = res.data
      // console.log(this.employeesList)
    },
    // 新增或编辑部门的方法
    async addOrEditDepart(data) {
      // 把数据发送给后台  新增部门
      if (this.isEdit === true) {
        // 编辑状态

        await updateDepartmentAPI(data)
      } else {
        // 新增状态
        data.pid = this.clickDepartId
        await addDepartmentsAPI(data)
      }
      // console.log(data)
      this.getDepartmentsListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
}
</style>

