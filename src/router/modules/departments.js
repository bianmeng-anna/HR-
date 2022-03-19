import Layout from '@/layout'
export default {
  path: '/departments',
  component: Layout, // 默认加载一级路由
  children: [{
    path: '',
    name: 'departments',
    component: () => import('@/views/departments'),
    meta: { title: '组织架构', icon: 'tree' }

  }]
}
