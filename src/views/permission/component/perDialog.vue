<template>
  <!-- 放置一个弹层 用来编辑新增节点 -->
  <el-dialog title="新增权限点" :visible="showdialog" @close="btnCancel">
    <template slot="title">
      <div>{{ isedit? '编辑权限':'添加权限' }}</div>
    </template>
    <!-- 表单 -->
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="formData.description" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="OkBtn">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  props: {
    // 是否显示弹层
    showdialog: {
      type: Boolean,
      default: false
    },
    isedit: {
      type: Boolean,
      default: false
    },
    clickid: {
      type: [String, Number],
      default: ''
    },
    originlist: {
      type: Array,
      default: _ => []

    }

  },
  data() {
    // 校验权限名称
    const validName = (rule, value, callback) => {
      // 添加时的校验： 名字不能取子元素的名字
      let existNameList = this.originlist.filter(item => item.pid === this.clickid)
      if (this.isedit) {
        // 编辑时的校验： 名字不能取兄弟（排除自己）的名字
        // 找兄弟，排除自己
        const obj = this.originlist.find(item => item.id === this.clickid)
        const pid = obj.id
        existNameList = this.originlist.filter(item => item.pid === pid && item.id !== this.clickid)
      }
      existNameList.map(it => it.name).includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }

    // 校验权限标识
    const validCode = (rule, value, callback) => {
      // 添加时的校验：code不能重复
      let existCodeList = this.originlist.map(item => item.code)
      if (this.isedit) {
        // 编辑时的校验: code能取自己
        existCodeList = this.originlist.filter(item => item.id !== this.clickid).map(item => item.code)
      }
      existCodeList.map.includes(value)
        ? callback(new Error(value + '已经占用'))
        : callback()
    }
    return {
      // permissionList: [], // 权限管理列表数据
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        type: ''
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }, {
          validator: validName, trigger: 'blur'
        }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' },
          {
            validator: validCode, trigger: 'blur'
          }]
      }
    }
  },
  methods: {
    // 关闭弹框  close事件和取消弹窗事件
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        enVisible: '0' // 开启
      }
      this.$refs.perForm.resetFields()
      this.$emit('update:showdialog', false)
    },
    OkBtn() {
      this.$refs.perForm.validate(valid => {
        if (valid) {
          this.$emit('confirmEV', { ...this.formData })

          this.btnCancel()
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>

</style>
