import PageTools from './pageTools' // 组件对象
import ImageHolder from '@/components/imageHolder'
import Lang from '@/components/Lang'

// import UploadExcel from '@/components/UploadExcel'
// import UploadImg from './uploadImg'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    // Vue.component('UploadExcel', UploadExcel)
    // Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
    Vue.component('Lang', Lang)
  }
}

