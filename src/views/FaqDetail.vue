<template>
  <header-nav current="faq"></header-nav>
  <div class="container">
    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item style="font-size: 16px"
          ><a @click="toIndex">应用列表</a></a-breadcrumb-item
        >
        <a-breadcrumb-item style="font-size: 16px"
          ><a>Application Name</a></a-breadcrumb-item
        >
      </a-breadcrumb>
    </div>
    <!-- <div class="submenu-bar">
      <a-menu v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"></a-menu>
    </div> -->
    <div class="ques-list">
      <div class="header-bar">
        <div class="header-title">问答列表</div>
        <div class="btn-bar">
          <a-button style="margin: 0 5px 0 0" type="primary">测试</a-button>
          <a-button style="margin: 0 5px" type="primary">导入</a-button>
          <a-button style="margin: 0 5px" type="primary">导出</a-button>
          <a-button style="margin: 0 5px" type="primary">训练</a-button>
          <a-button style="margin: 0 25px 0 5px" type="primary">训练记录</a-button>
        </div>
      </div>
      <div class="main-body">
        <div class="left-body">分类筛选 待补充</div>
        <div class="right-body">
          <div class="right-btn-bar">
            <a-button style="margin: 0 5px" type="primary">新增标准问题</a-button>
            <a-button style="margin: 0 0 0 5px" type="default">批量删除</a-button>
          </div>
          <div class="faq-table">
            <a-table> </a-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import { defineComponent, reactive,ref } from "vue";
import { useRoute } from "vue-router";
import { postData } from "@/api/webpost";
import { getData } from "@/api/webget";
export default defineComponent({
  components: { HeaderNav },
  setup() {
    const current = ref(['mail']);
    const route = useRoute();
    const faqList = reactive({
      faqList: [],
    });
    const appId = route.params.id;
    console.log(appId);
    function toIndex() {
      router.push({
        name: "faq",
      });
    }

    return {
      faqList,
      toIndex,
      current
    };
  },
});
</script>
<style scoped>
.container {
  border: 1px red solid;
  margin: 20px auto;
  width: 1000px;
}
.ques-list {
  background-color: rgb(247, 243, 243);
  width: 1000px;
  /* border: 1px red solid; */
  margin: 20px auto;
}
.header-bar {
  height: 60px;
  width: 1000px;
  display: flex;
  margin-bottom:10px;
  align-items: flex-end;
  justify-content: space-between;
}
.header-title {
  border-left: 4px rgb(49, 104, 224) solid;
  width: 100px;
  margin-left: 25px;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 800;
}

.main-body {
  border: 1px red solid;
  width: 950px;
  margin: auto;
  display: flex;
  min-height: 600px;

  justify-content: space-between;
}
.left-body {
  border: 1px red solid;
  width: 300px;
}
.right-body {
  border: 1px red solid;
  width: 600px;
}
.right-btn-bar {
  border: 1px red solid;
  display: flex;
  justify-content: flex-end;
  margin-bottom:15px;
}
.faq-table {
  border: 1px red solid;

}
/* .submenu-bar {
  margin:10px auto;
  width:1000px;
  height: 70px;
} */
</style>
