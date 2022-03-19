import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginAPI, getUserProfileAPI, getUserPhotoAPI } from '@/api'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {} // 保存用户信息
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN(state, newtoken) {
    state.token = newtoken
    setToken(newtoken)
  },
  REMOVE_TOKEN(state) {
    state.token = ''
    removeToken()
  },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USERINFO(state, value) {
    state.userInfo = value
    localStorage.setItem('userInfo', JSON.stringify(value))
  },
  REMOVE_USERINFO(state) {
    state.userInfo = {}
    localStorage.removeItem('userInfo')
  }
}

const actions = {
  // 登陆逻辑
  // 拿到对象里commit方法
  async loginActions({ commit }, value) {
    const [err, res] = await loginAPI(value)
    // const [err, res] = arr
    // console.log({ commit })
    // console.log(res === arr[1])
    // console.log(err === arr[0])
    // console.log(arr)
    // console.log(res)
    commit('SET_TOKEN', res.data)
    return [err, res]
  },
  // 定义方法  获取用户信息
  async getUserInfoActions({ commit }, value) {
    const res = await getUserProfileAPI()
    // console.log(res)

    const user = await getUserPhotoAPI(res.data.userId)
    commit('SET_USERINFO', { ...res.data, ...user.data }) // 保存用户基本信息
    // commit('')
    // return res.data.role.menus //  返回路由权限标识数组
  },
  // 退出登陆
  async logOutActions({ commit }) {
    // 删除token和vuex
    commit('app/RESET_ASYNCROUTE', null, { root: true })
    commit('RESET_STATE')
    commit('REMOVE_USERINFO')
    commit('REMOVE_TOKEN')
    resetRouter()
    // localStorage.removeItem('userInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

