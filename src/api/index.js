// 统一出口
// 从user.js 按需导入所有,然后走左边的 export按需导出所有
// 好处: 逻辑页面只需导入Index.js就能按需拿到所有js文件接口
export * from './user.js'
