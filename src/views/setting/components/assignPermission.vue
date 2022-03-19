<template>
  <div>
    <el-tree
      ref="tree"
      :data="permissionlist"
      :props="{ label: 'name' }"
      show-checkbox
      check-strictly
      default-expand-all
      node-key="id"
    />

    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn">确 定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignPermission',
  props: {
    permissionlist: {
      type: Array,
      default: _ => []
    },
    dialogvisible: {
      type: Boolean,
      default: false
    },
    getpersiiton: {
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {}
  },
  watch: {
    getpersiiton() {
      this.$refs.tree.setCheckedKeys(this.getpersiiton)
    }
  },
  methods: {
    // 取消按钮
    cancelButton() {
      this.$refs.tree.setCheckedKeys([])
      this.$emit('update:dialogvisible', false)
    },

    // 设置权限按钮
    setRolesBtn() {
      this.$emit('confirmEV', this.$refs.tree.getCheckedKeys())
      this.$refs.tree.setCheckedKeys([])
      this.$emit('update:dialogvisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
