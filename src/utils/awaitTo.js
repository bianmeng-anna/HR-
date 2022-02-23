export function to(pA) {
  const pB = pA.then(res => { // 接收网络成功/失败的结果
    return [null, res]
  }).catch(err => {
    return [err, null]
  })
  return pB
}
