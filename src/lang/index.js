// 导入 vue-i18n 插件
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale' // 导入 Element 语言配置插件
import enLocale from 'element-ui/lib/locale/lang/en' // 导入 Element 英文包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // 导入 Element 中文包

Vue.use(VueI18n)

// 创建国际化插件的实例
const i18n = new VueI18n({
  locale: 'zh', // 设置地区，zh 表示中国地区
  // 设置地区信息
  messages: {
    en: {
      ...enLocale,
      navbar: {
        companyName: 'Jiangsu Chuanzhi podcast Education Technology Co., Ltd'
      }
    },
    zh: {
      ...zhLocale,
      navbar: {
        companyName: '江苏传智播客教育科技股份有限公司'
      }
    }
  }
})
// 国家化就是在不同的对象里取值
// 页面标签里 <span>{{ $t('name') }}</span>
// 配置 Element 语言转换关系
locale.i18n((key, value) => i18n.t(key, value))
export default i18n

// 有很多内容都是写成固定在逻辑vue文件页面内
// 所以想要切换是很难的
// 标签里用vueI18n封闭的方法来取对象里的值
// 对象里值也要提前准备好2份（中文、英文）
