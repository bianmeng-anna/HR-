<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
        <!-- value值是给v-model绑定的，给后台用的id数字，label是决定显示页面的 -->
        <el-option v-for="list in Employees" :key="list.id" :value="list.id" :label="list.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
    </el-form-item>

    <el-form-item label="部门" prop="departmentName">
      <el-input v-model="formData.departmentName" style="width:85%" placeholder="请选择部门" readonly @focus="inputFocus" />
      <div v-if="showTree" class="tree-box">
        <el-tree :data="departlist" default-expand-all :props="{ label: 'name' }" @node-click="treeClick" />
      </div>
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="cancelBtn">取消</el-button>
      <el-button type="primary" @click="OkBtn">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Employees from '@/api/constant/employees'
export default {
  name: 'EmpDialog',
  props: {
    departlist: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      // 添加表单字段
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      showTree: false, // 部门的树形控件是否展示
      Employees: Employees.hireType,
      // 添加表单的校验字段
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    // 部门输入框 聚焦事件
    inputFocus() {
      this.showTree = true
    },
    // 树形控件 节点的点击事件
    treeClick(data) {
      if (data && data.children) {
        return
      }
      // console.log(data)
      this.formData.departmentName = data.name
      this.showTree = false
    },
    cancelBtn() {
      this.$emit('update:showdialogn', false)
    },
    OkBtn() {
      this.$refs.addForm.validate(valid => {
        // console.log(valid)
        if (valid) {
          this.$emit('formEV', { ...this.formData })
          this.$emit('update:showdialogn', false)
          this.$refs.addForm.resetFields()
          // 细节：因为没有await ，所以清空表单的代码先执行了，数据被清空了
          // 解决： 利用浅拷贝   把给父级用的对象拷贝一份
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
