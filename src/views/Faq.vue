<template>
  <header-nav current="faq"></header-nav>
  <div class="container">
    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item style="font-size: 16px"
          >FAQ问答管理</a-breadcrumb-item
        >
        <a-breadcrumb-item style="font-size: 16px"
          ><a @click="toIndex">应用列表</a></a-breadcrumb-item
        >
      </a-breadcrumb>
      <a-button style="margin-bottom: 5px" type="primary" @click="createApp"
        >新建应用</a-button
      >
    </div>
    <div class="application-list">
      <div
        class="one-application"
        v-for="(item, id) in applicationList.applicationList"
        :key="id"
      >
        <a-card :title="item.app_name" class="one-card">
          <template #extra>
            <a-popover trigger="click" placement="bottom">
              <template #content>
                <p>Name：{{ item.app_name }}</p>
                <p>AppId：{{ item.app_id }}</p>
              </template>
              <a><ellipsis-outlined /></a>
            </a-popover>
          </template>
          <template #actions>
            <a @click="editApp(item.app_id)" class="action-a">编辑</a>

            <a-popconfirm
              :title="popTitle"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteApp(item.app_id)"
            >
              <a class="action-a">删除</a>
            </a-popconfirm>
            <a @click="toDetail(item.app_id)" class="action-a">查看详情</a>
          </template>
        </a-card>
      </div>
    </div>
    <app-modal
      :visible="modal1Visible"
      @updateData="getUpdateData"
      @addData="addParentData1"
    ></app-modal>
     <edit-modal
      :appId="editAppId"
      :visible="modal2Visible"
      @updateData="getUpdateData"
      @addData="addParentData2"
    ></edit-modal>
  </div>
</template>
<script>
import { EllipsisOutlined } from "@ant-design/icons-vue";
import AppModal from "@/components/AppModal.vue";
import EditModal from "@/components/EditModal.vue";
import HeaderNav from "@/components/HeaderNav.vue";
import { defineComponent, ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { postData } from "@/api/webpost";
import { getData } from "@/api/webget";
import path from "@/api/path.js";
import { message } from "ant-design-vue";

export default defineComponent({
  components: { HeaderNav,EditModal, AppModal, EllipsisOutlined },
  setup() {
    onMounted(() => {
      getAppList();
    });
    let editAppId = ref();
    const applicationList = reactive({
      applicationList: [],
    });
      let modal1Visible = ref(false);
    let modal2Visible = ref(false);
    let popTitle = `确认删除所选应用吗?（删除后将不保留相关问答信息）`
    const router = useRouter();

    // 获取应用列表
    function getAppList() {
      let url = path.website.getAppList;
      getData(url).then((res) => {
        applicationList.applicationList = res.results;
      });
    }
  
    // 显示新增应用窗口
    let createApp = () => {
      modal1Visible.value = true;
    };

    // 更新数据列表
     function getUpdateData(flag) {
      if (flag === true) {
        getAppList();
      }
    }

    // 关闭新增应用窗口
    function addParentData1(visible) {
      modal1Visible.value = visible;
    }

    // 关闭编辑应用窗口
     function addParentData2(visible) {
      modal2Visible.value = visible;
    }

    // 删除应用
    function deleteApp(app_id) {
      let params = {
        app_id: app_id,
      };
      let url = path.website.deleteApp;
      postData(url, params).then((res) => {
        message.success(res.explain);
        getAppList();
      });
    }

    // 显示编辑应用窗口
    function editApp(app_id) {
      modal2Visible.value = true;
      editAppId.value = app_id;
    }

    // 显示当前应用的问答列表页面
    function toDetail(appid) {
      router.push({
        path: `/faqdetail/${appid}`,
      });
    }

    return {
      applicationList,
      modal1Visible,
      modal2Visible,
      createApp,
      editApp,
      deleteApp,
      toDetail,
      getUpdateData,
      addParentData1,
      addParentData2,
      editAppId,
      popTitle
    };
  },
});
</script>
<style scoped>
.container {
  margin: 20px auto;
  width: 1000px;
  min-height: 600px;
}
.application-list {
  background-color: rgb(247, 243, 243);
  margin: 0 auto 20px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.breadcrumb {
  display: flex;
  justify-content: space-between;
}
.one-application {
  margin: 15px;
  width: 218px;
}
.one-card {
  width: 215px;
}
.action-a {
  font-size: 11px;
}
</style>
