import { getToken, setToken, removeToken } from '@/utils/auth'
import { loginAPI } from '@/api'

const getDefaultState = () => {
  return {
    token: getToken()
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
    commit('SET_TOKEN', res.data)
    return [err, res]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

