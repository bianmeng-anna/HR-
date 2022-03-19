<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共19条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button v-power="'import'" type="danger" size="small" @click="UploadExcelBtn">导入excel</el-button>
          <el-button v-power="'export'" type="success" size="small" @click="downloadExcel">导出excel</el-button>
          <el-button type="primary" size="small" @click="addEmployees">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格 + 分页 -->
      <el-card style="margin-top: 10px;">
        <el-table :data="employeesList" border>
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" width="120" prop="staffPhoto">
            <template v-slot="scope">
              <ImgHolder :src="scope.row.staffPhoto" />
              <!-- <img class="staffPhoto" :src="scope.row.staffPhoto" alt=""> -->
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column label="工号" prop="workNumber" sortable :sort-method="sortMethodFn" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployee">
            <!-- <template v-slot="scope"> -->
            <!-- <span>{{ scope.row.formOfEmployment===1?'正式':'非正式' }}</span> -->
            <!-- <span>{{ formOfEmployment(scope.row.formOfEmployment) }}</span> -->
            <!-- </template> -->
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              <span>{{ formDate(scope.row.timeOfEntry) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280">
            <template v-slot="scope">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail?id=${scope.row.id}`)">查看</el-button>
              <el-button type="text" size="small" @click="Role(scope.row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="delBtn(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <!-- 新增员工弹窗 + 表单 -->
      <el-dialog title="新增员工" :visible="showDialog" @close="showDialogFn">
        <EmpForm ref="empform" :showdialogn.sync="showDialog" :departlist="departList" @formEV="formEn" />

      </el-dialog>
      <!-- 员工角色弹窗 -->
      <el-dialog :visible="showRoleDialog" title="分配角色" @close="showRoleDialog=false">
        <roleDialog :rolelist="roleList" :roleids="roleIds" @close="closeFn" @confirmEV="addRoleConfirm" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmloyeesList, departmentsListAPI, addEmployee, delUserAPI, getRolesAPI, getUserDetailByIdAPI, assignRolesAPI } from '@/api'
import ImgHolder from '@/components/imageHolder/index.vue'
import { transTree } from '@/utils'
import Employee from '@/api/constant/employees'
import EmpForm from './components/EmpForm.vue'
import dayjs from 'dayjs'
import roleDialog from './components/roleDialog.vue'

export default {
  name: 'Employees',
  components: {
    EmpForm,
    ImgHolder,
    roleDialog
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10 // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false,
      departList: [],
      showRoleDialog: false, // 角色弹窗
      roleList: [],
      roleIds: [],
      userid: ''
    }
  },
  created() {
    this.getemployeesList()
    this.getDepartList()
    this.getRoleList()
  },
  methods: {

    // 请求角色列表
    async getRoleList() {
      const res = await getRolesAPI({
        page: 1,
        pagesize: 1000
      })
      // console.log(res)
      this.roleList = res.data.rows
    },
    // 员工列表
    async getemployeesList() {
      const res = await getEmloyeesList(this.query)
      // console.log(res.data.rows)
      if (this.query.page.length === 0 && this.query.page > 1) {
        this.query.page--
        this.getemployeesList()
        return
      }
      this.employeesList = res.data.rows
      this.total = res.data.total
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize
      this.getemployeesList()
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage
      this.getemployeesList()
    },
    // formOfEmployment(num) {
    //   const obj = {
    //     1: '正式',
    //     2: '非正式'
    //     // 如果以后有多项都可添加
    //   }
    //   return obj[num]
    // }
    formatEmployee(row) {
      const obj = Employee.hireType.find(item => item.id === row.formOfEmployment)
      return obj ? obj.value : '未知'
    },
    // 获取员工角色
    async getRoles() {
      const res = await getUserDetailByIdAPI(this.userid)
      // console.log(res)
      this.roleIds = res.data.roleIds || []
    },
    // 工号实现排列
    sortMethodFn(a, b) {
      return a.workNumber - b.workNumber
    },
    // 增加员工按钮
    addEmployees() {
      this.showDialog = true
    },
    // 请求获取部门列表
    async getDepartList() {
      const res = await departmentsListAPI()
      // console.log(res.data.depts)
      this.departList = transTree(res.data.depts, '')
    },
    // 新增员工确定  子传父
    async formEn(data) {
      await addEmployee(data)
      this.getemployeesList()
    },
    // 右上角关闭弹窗
    showDialogFn() {
      this.$refs.empform.$refs.addForm.resetFields()
    },
    // 格式化时间
    formDate(time) {
      return dayjs(time).format('YYYY-MM-DD')
    },
    async delBtn(date) {
      // console.log(date)
      await delUserAPI(date.id)
      this.$message.success('删除成功')
      this.getemployeesList()
    },
    // 导入表格按钮的点击事件
    UploadExcelBtn() {
      this.$router.push('/excel')
    },
    // 导出表格按钮的一个点击事件
    downloadExcel() {
      // 1,下面了解 ,导致数据对应不上
      const headerArr = ['序号', '姓名', '头像', '手机号', '工号', '聘用形式', '部门', '入职时间']
      // const valueArr = this.employeesList.map(item => {
      //   return Object.values(item)
      // })
      // 2, 正确解
      // 2.0 定义一个对照对象,中文: 英文key
      const keyobj = {
        '序号': 'id',
        '姓名': 'username',
        '头像地址': 'staffPhoto',
        '手机号': 'mobile',
        '工号': 'workNumber',
        '聘用形式': 'formOfEmployment',
        '部门': 'departmentName',
        '入职日期': 'timeOfEntry'

        // '密码': 'password',
        // '转正日期': 'correctionTime',
      }

      // 2.1 遍历headerArr数组,拿出中文,换出英文key
      const valueArr = this.employeesList.map((obj, index) => {
        const newArr = []
        headerArr.forEach(item => {
          const enKey = keyobj[item] // 拿到英文key
          if (enKey === 'id') {
            newArr.push(index + 1)
          } else if (enKey === 'formOfEmployment') {
            const data = Employee.hireType.find(item => item.id === obj[enKey])
            newArr.push(data ? data.value : '未知')
          } else {
            const value = obj[enKey] // 取值
            newArr.push(value)
          }
        })
        return newArr
      })
      // 2.2 再到数据对象里取出对应的值 - > 数组遍历是有顺序的
      // 2.3 拿到值放到一个数组里
      import('@/vendor/Export2Excel').then(excel => {
        // excel表示导入的模块对象
        excel.export_json_to_excel({
          header: headerArr, // 表头 必填
          data: valueArr, // 具体数据 必填
          // 点击浏览器卡死问题: 数据格式不对
          filename: '人资员工表', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    // 点击分配角色功能
    Role(employeesId) {
      this.userid = employeesId

      this.showRoleDialog = true
      this.getRoles()
    },
    // 分配角色 ->确定和取消关闭按钮
    closeFn() {
      this.showRoleDialog = false
    },
    // 确定添加角色方法
    async addRoleConfirm(roleIds) {
      const res = await assignRolesAPI({
        id: this.userid,
        roleIds: roleIds
      })
      this.$message.success(res.message)
      this.getemployeesList()
    }
  }
}
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}</style>
