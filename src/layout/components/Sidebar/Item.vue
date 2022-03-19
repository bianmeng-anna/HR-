<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // 知识点(了解):组件创建方式2种:
  // 方式1:vue文件的方式->template标签模板
  // 方式2:函数式创建组件
  // render 函数
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      // console.log(icon)
      if (icon.includes('el-icon')) { // element-ui内置的图标名字
        // i标签+class渲染字体图标
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        // 用自己的svg icon组件渲染
        vnodes.push(<svg-icon icon-class={icon}/>)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
