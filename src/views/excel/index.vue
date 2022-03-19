<template>
  <uploadExcel
    :on-success="handleSuccess"
  />
  <!-- 其他代码略 -->

</template>

<script>
import uploadExcel from '@/components/UploadExcel/index.vue'
import { formatExcelDate } from '@/utils/index'
import { importEmployeeAPI } from '@/api/employee'
export default {
  name: 'UploadExcel',
  components: {
    uploadExcel
  },
  data() {
    return {
    }
  },
  methods: {
    // // 中文=> 英文
    // 成功调用之后的函数，它会返回表格的表头和内容。
    async handleSuccess({ results, header }) {
      // 思路 ：
      // 1，准备一个中文：英文的一一对应
      // 2， 遍历对象里的每个中文key， 去上面对象换成英文的value
      // 3，用英文value作为新对象key，  原来读出的对象里vlaue作为新对象value
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      const newArr = []
      results.forEach(item => {
        const newObj = {}

        // Object.keys(item) 提取对象所有key字符串形成数组
        Object.keys(item).forEach(key => {
          const enKey = userRelations[key] // 取 换出英文的key
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            const time = formatExcelDate(item[key])
            newObj[enKey] = time
          } else {
            newObj[enKey] = item[key] // 赋值 把中文对象对应中文key的value取出，赋予给新对象的key后面
          }
        })
        // 上面循环完一次，组装好了一个英文key的完整对象
        newArr.push(newObj)
      })
      // excel读取的日期是距离1900年的天数
      // 但是new Date要求是1970年往后的时间戳
      // 所以你的天数要  - 70年天数
      // console.log(newArr)

      const res = await importEmployeeAPI(newArr)
      // console.log(res)
      this.$message.success(res.message)
      this.$router.push('/employees')
    }
  }
}
</script>
<style scoped>

</style>
