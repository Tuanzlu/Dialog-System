<template>
<div class="menu">
  <div>
    <img class="logo" @click="toIndex" :src="logoUrl">
  </div>
  <a-menu style="justify-content:flex-end;" :selectedKeys="curPage" mode="horizontal" @click="changePage">
      <a-menu-item key="index">首页</a-menu-item>
      <a-menu-item key="user">用户管理</a-menu-item>
      <a-menu-item key="robot">在线聊天机器人</a-menu-item>
      <a-menu-item key="tag">在线对话标注</a-menu-item>
    </a-menu>
</div>
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  props:{
    current: String,
  },
  setup(props) {
    const router = useRouter()
    let logoUrl = require('@/assets/logo.png')
    let curPage = [props.current]
    function changePage(item) {
      router.push({
        name:item.key
      })
    }

    function toIndex() {
      router.push({
        path:'/index'
      })
    }
    return {
      curPage,
      logoUrl,
      changePage,
      toIndex
    }
  },
})
</script>

<style scoped>
.menu {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 70px;
}
.logo {
  height: 35px;
}

</style>
