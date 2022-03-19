/**
 * 按钮级权限控制
 */
import store from '@/store'

export default {
  // 这里是指令的配置对象
  // inserted-> 只触发一次 （指令所在标签被插入到真实DOM中，此函数触发
  // el-> 指令所在的原生标签
  // binding -> 绑定的数据对象
  inserted(el, binding) {
    // 从 vuex 中取出 points （按钮功能权限标记）
    const points = store.state.user.userInfo.roles.points

    // 如果 points 中有 binding.value 则显示
    // 不存在则删除指令所在的这个原生标签
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}

