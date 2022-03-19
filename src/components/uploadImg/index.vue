<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="httpRequesFn"
    >
      <img v-if="imageUrl" :src="imgurl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <!-- 进度条 -->
      <el-progress v-if="showProgress" type="circle" :percentage="percent" class="progress" />
    </el-upload>
  </div>
</template>

<script>
// 因为腾讯云上传过程中需要自己写js代码 , 不能使用el-upload默认自带的
// 所以要使用http-request自定义上传的过程,action属性必须写  所以#
var COS = require('cos-js-sdk-v5')
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDUosgDUUEhsmRpvkIZFiuqVt0vZx4uUnp',
  SecretKey: 'nKaZHjuqVt1sSlnY2GEuJRIsBDySfbGf'
})

export default {
  name: 'UploadImg',
  props: {
    imgurl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      percent: 0, // 图片的上传进度
      showProgress: false // 是够显示上传进度
    }
  },
  watch: {
    imgurl() {
      this.imageUrl = this.imgurl
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 自定义图片上传过程
    httpRequesFn(res) {
      if (res.file) {
        this.showProgress = true
        // dataObj.file 拿到file类型的文件对象  图片 -> URL
        this.imageUrl = URL.createObjectURL(res.file)
        // 上面是纯前端的预览效果
        //  上传到云存储(腾讯云)
        cos.putObject({
          Bucket: 'minimeng-1309603593', /* 必须 */
          Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
          Key: res.file.name, /* 必须 文件名*/
          StorageClass: 'STANDARD', // 上传模式
          Body: res.file, // 上传文件对象
          onProgress: (progressData) => { // 上传进度
            // console.log(JSON.stringify(progressData))
            this.percent = progressData.percent * 100
          }

        }, (err, data) => {
          if (!err) { // 如果上传成功
            console.log(err || data)
            // console.log(data)
            this.$emit('update:imgurl', `http://${data.Location}`)
            this.showProgress = false
          }
        })
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 160px;
    height: 160px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
}
</style>
