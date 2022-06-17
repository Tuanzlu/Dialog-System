<template>
  <header-nav current="index"></header-nav>
<div class="carousel">
 <a-carousel autoplay>
    <div><h3 @click="handleClick(0)">FAQ问答管理</h3></div>
    <div><h3 @click="handleClick(1)">在线聊天机器人</h3></div>
    <div><h3 @click="handleClick(2)">在线对话标注</h3></div>
  </a-carousel>
</div>
 <div class="intro"><a @click="handleClick(3)">——平台使用说明</a></div>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  components: { HeaderNav },
  setup() {
    const router = useRouter();
    function handleClick(index) {
      if (index === 0) {
        router.push({
          name: "faq",
        });
      } else if (index === 1) {
        router.push({
          name: "robot",
        });
      } else if (index === 2) {
        router.push({
          name: "tag",
        });
      }else if(index ===3) {
         router.push({
          name: "intro",
        });
      }
    }
    return {
      handleClick,
    };
  },
});
</script>

<style scoped>
/* For demo */
.ant-carousel :deep(.slick-slide) {
  width:80%;
  text-align: center;
  height: 360px;
  cursor:pointer;
  line-height: 360px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
.carousel {
  width:80%;
  margin:50px auto 0 auto;
}
.intro {
  width:80%;
  margin:10px auto;
}
</style>
