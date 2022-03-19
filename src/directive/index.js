import power from './power'

export default {
  install(Vue) {
    // 控制按钮级权限控制的自定义指令
    Vue.directive('power', power)
  }
}
