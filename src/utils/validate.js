/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str 要被检验的手机号
 * @returns {Boolean} 是手机号为true 不是为false
 */
export function validmobile(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  // 返回布尔值
  return /^1[3-9]\d{9}$/.test(str)
}
