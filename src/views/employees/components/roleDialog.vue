<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIdArr">
      <el-checkbox v-for="list in rolelist" :key="list.id" :label="list.id">{{ list.name }}</el-checkbox>
      <!-- <el-checkbox label="复选框 B" />
      <el-checkbox label="复选框 C" /> -->
    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">

      <el-col :span="6">

        <el-button type="primary" size="small" @click="OkBtn">确定</el-button>
        <el-button size="small" @click="cancleDialog">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AssignRole',
  props: {
    rolelist: {
      type: Array,
      default: () => []
    },
    roleids: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      roleIdArr: []
    }
  },
  watch: {
    roleids() {
      this.roleIdArr = [...this.roleids]
      // console.log(this.roleIdArr)
    }
  },
  methods: {
    // 取消弹框
    cancleDialog() {
      this.$emit('close', false)
    },
    // 确定弹窗
    OkBtn() {
      this.$emit('confirmEV', this.roleIdArr)
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
