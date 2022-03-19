import Layout from '@/layout'

export default {
  path: '/settings',
  component: Layout,
  children: [{
    path: '',
    name: 'settings',
    component: () => import('@/views/setting'),
    meta: { title: '设置', icon: 'setting' }
  }]
}
