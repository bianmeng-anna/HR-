const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  companyId: state => state.user.userInfo.companyId,
  isHavaAsyncRote: state => state.app.asyncRoute, // 是否挂载了动态路由规则数组
  menus: state => state.user.userInfo.roles.menus // 返回路由权限标识数组
}
export default getters
