<template>
  <div class="">
    <el-dialog
      title="添加部门"
      :visible="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="form.code" autocomplete="off" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select v-model="form.manager" placeholder="请选择">
            <el-option
              v-for="list in employeeslist"
              :key="list.id"
              :value="list.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="form.introduce" autocomplete="off" style="width:80%" type="text" placeholder="1-300个字符" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="enterFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getEmployeeSimpleAPI } from '@/api/department'

export default {
  name: 'Departdialog',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 员工列表（非部门）
    employeeslist: {
      type: Array,
      default() {
        return []
      }
    },
    // 所有的部门列表
    originlist: {
      type: Array,
      default: () => {
        return []
      }
    },
    edit: {
      type: Boolean,
      default: false
    },
    parentid: { // 正在编辑的id
      type: String,
      default: ''
    }
  },
  data() {
    // 验证部门编码code是否重复
    // map() 返回一个新数组 需要找接收数据

    const validCode = (rule, value, callback) => {
      let validList = this.originlist.map(item => (item.code))
      if (this.edit === true) {
        validList = this.originlist.filter(item => item.id !== this.parentid).map(item => (item.code))
      }
      validList.includes(value) ? callback(new Error('编码' + value + '已经存在')) : callback()
    }
    const validName = (rule, value, callback) => {
      // 新增时找到pid=id的下属
      const validaname = this.originlist.filter(item => (item.pid === this.parentid)).map(item => item.name)
      // 编辑时 ： 此部门的同级部门的id不等  pid相等
      if (this.edit) {
        const obj = this.originlist.find(item => item.id === this.parentid)
        const pid = obj.pid
        this.originlist.filter(item => item.pid === pid).map(item => item.name)
      }
      validaname.includes(value) ? callback(new Error('名字' + value + '已经存在')) : callback()
    }

    return {
      form: {
        name: '',
        manager: '',
        code: '',
        introduce: ''
      },
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {},
  watch: {},
  created() {
    // this.getEmployeeSimpleAPI()
  },
  mounted() {},
  updated() {},
  methods: {
    // async getEmployeeSimpleAPI() {
    //   const data = await getEmployeeSimpleAPI()
    //   console.log(...data.data)
    // },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    cancelFn() {
      this.form = {
        name: '',
        manager: '',
        code: '',
        introduce: ''
      }
      this.$refs.ruleForm.resetFields()
      this.$emit('update:dialogVisible', false)
    },
    enterFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit('departEV', { ...this.form })
          this.form = {
            name: '',
            manager: '',
            code: '',
            introduce: ''
          }
          this.$refs.ruleForm.resetFields()

          this.$emit('update:dialogVisible', false)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
