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
        <a-breadcrumb-item style="font-size: 16px"
          >FAQ(主动流程最多一个)</a-breadcrumb-item
        >
      </a-breadcrumb>
    </div>
    <div class="submenu-bar">
      <a-menu
        @click="handleClick"
        v-model:selectedKeys="selectedKeys"
        mode="horizontal"
      >
        <a-sub-menu key="sub1">
          <template #title>问答管理</template>
          <a-menu-item key="faq"> FAQ </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>多轮对话</template>
          <a-menu-item key="flow"> 流程管理 </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="ques-list" v-if="showHistory === false">
      <div class="header-bar">
        <div class="header-title">问答列表</div>
        <div class="btn-bar">
          <a-button @click="handleTest" style="margin: 0 5px 0 0" type="primary"
            >测试</a-button
          >
          <a-modal
            title="测试"
            v-model:visible="testModelVis"
            @cancel="closeTest"
          >
            <div>上次测试时间：——</div>
            <template #footer>
              <a-button type="default">下载模板样例</a-button>
              <a-button type="primary">上传并测试</a-button>
            </template>
          </a-modal>
          <a-button @click="importFile" style="margin: 0 5px" type="primary"
            >导入</a-button
          >
          <a-modal
            title="导入"
            v-model:visible="importFileVis"
            @cancel="closeImport"
          >
            <div>上次导入时间：——</div>
            <template #footer>
              <a-button type="default">下载模板样例</a-button>
              <a-button type="primary">导入</a-button>
            </template>
          </a-modal>
          <a-button
            disabled
            @click="exportFile"
            style="margin: 0 5px"
            type="primary"
            >导出</a-button
          >
          <a-button @click="trainModel" style="margin: 0 5px" type="primary"
            >训练</a-button
          >
          <a-button
            @click="toTrainHistory"
            style="margin: 0 25px 0 5px"
            type="primary"
            >训练记录</a-button
          >
        </div>
      </div>
      <div class="main-body">
        <div class="left-body">
          <!-- <div class="upper">
            <a-button @click="showAllType" :type="onAllType === true?'primary':'default'">全部分类</a-button>
            <a-button @click="showNoType" :type="onAllType === false?'primary':'default'">未分类</a-button>
          </div>
          <div class="type-tree">
            <div class="tree-header">
              <span style="margin: 5px">分类</span>
              <a style="margin: 5px" @click="modifyTypeTree" v-if="modifyType===false"><edit-outlined /> </a>
              <a style="margin: 5px" @click="modifyTypeTree" v-else>完成 </a>
            </div>
            <div class="add-node" v-if="modifyType">
              <a style="margin: 5px" @click="addNewType">
                <plus-circle-outlined style="margin: 0 5px" />新增分类</a
              >
              <a style="margin: 5px">
                <plus-circle-outlined style="margin: 0 5px" />新增子类</a
              >
            </div>
            <div class="tree-body">
              <a-tree
                v-model:expandedKeys="expandedKeys"
                v-model:selectedKeys="selectedKeys"
                :tree-data="typeData.treeData"
              >
                <template #title="{ title, key }">
                  <div class="tree-node">
                    <span>{{ title }}</span>
                    <span v-if="key === selectedKeys[0]" class="action-btn">
                      <edit-outlined style="color: #1890ff" />
                      <close-circle-outlined style="color: #1890ff" />
                    </span>
                  </div>
                </template>
              </a-tree>
            </div>
          </div>
          <div class="tag-tree"></div> -->
        </div>
        <div class="right-body">
          <div class="right-upper">
            <div>
              <a-input-search
                v-model:value="searchWord"
                placeholder="请输入关键字"
                style="width: 200px"
                @search="onSearch"
              />
            </div>

            <div class="right-btn-bar">
              <a-button
                style="margin: 0 5px"
                type="primary"
                @click="createCorpus"
                ><plus-circle-outlined />新增标准问题</a-button
              >
              <a-popconfirm
                title="是否确定删除？"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDelete"
              >
                <a-button style="margin: 0 0 0 5px" type="default"
                  >删除已选问题</a-button
                >
              </a-popconfirm>
            </div>
          </div>

          <div class="faq-table">
            <a-table
              class="table"
              bordered
              :row-selection="rowSelection"
              :row-key="(record) => record._id"
              :pagination="pagination"
              :data-source="faqList.faqList"
              :columns="columns"
              :scroll="scrollY"
              @change="tableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <a style="margin: 0 5px 0 0" @click="editCorpus(record._id)"
                    >编辑</a
                  >
                  <a
                    style="margin: 0 5px"
                    v-if="record.on_stage === 1"
                    @click="takeOffCorpus(record)"
                    >下架</a
                  >
                  <a style="margin: 0 5px" v-else @click="takeOnCorpus(record)"
                    >上架</a
                  >
                  <a-popconfirm
                    title="是否确定删除？"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteOneCorpus(record)"
                  >
                    <a style="margin: 0 0 0 5px">删除</a>
                  </a-popconfirm>
                </template>
                <template v-else-if="column.key === 'on_stage'">
                  <span v-if="record.on_stage === 1">上架</span>
                  <span v-else>下架</span>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </div>
    <div class="history-list" v-else>
      <div class="header-bar">
        <div class="header-title">训练历史</div>
      </div>
      <div class="main-body">
        <a-table
          class="his-table"
          :dataSource="hisDataSource.dataSource"
          :columns="historyColumns"
        ></a-table>
      </div>
    </div>
  </div>
  <add-corpus
    :id="appId"
    :visible="addCorpusVis"
    @closeAddCorpus="getAddCorpusData"
    @updateData="updataList"
  ></add-corpus>
  <edit-corpus
    :id="appId"
    :doc="editDocId"
    :visible="editCorpusVis"
    @closeEditCorpus="getEditCorpusData"
    @updateData="updataList"
  ></edit-corpus>
  <div class="chat-container">
    <div>
      <div class="chat-inner" @click="openChatModal">对话测试</div>
    </div>
  </div>
  <dialog-modal
    :app_id="appId"
    :visible="chatModalVis"
    @closeChatModal="getChatModalData"
  ></dialog-modal>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import AddCorpus from "@/components/AddCorpus.vue";
import EditCorpus from "@/components/EditCorpus.vue";
import DialogModal from "@/components/DialogModal.vue";
import { defineComponent, watch, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { postData } from "@/api/webpost";
import path from "@/api/path.js";
import {
  EditOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { getData } from "@/api/webget";
import { message } from "ant-design-vue";

const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
          },
          {
            title: "leaf",
            key: "0-0-0-1",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            key: "0-0-1-0",
            title: "sss",
          },
        ],
      },
    ],
  },
];
export default defineComponent({
  components: {
    HeaderNav,
    AddCorpus,
    EditCorpus,
    EditOutlined,
    CloseCircleOutlined,
    PlusCircleOutlined,
    DialogModal,
  },
  setup() {
    let searchWord = ref("");
    let typeData = reactive({ treeData: treeData });
    let allFaq = [];
    const expandedKeys = ref(["0-0-0", "0-0-1"]);
    const selectedKeys = ref(["faq"]);
    let showHistory = ref(false);
    let scrollY = reactive({ y: document.body.offsetHeight - 365 });
    const faqList = reactive({
      faqList: [],
    });
    const pagination = reactive({
      total: faqList.faqList.length,
      showTotal: (total) => `共 ${total} 条`,
      pageSize: 20,
      showSizeChanger: false,
      showQuickJumper: true,
    });
    let addCorpusVis = ref(false);
    let editCorpusVis = ref(false);
    let chatModalVis = ref(false);
    let editDocId = ref();
    let testModelVis = ref(false);
    let importFileVis = ref(false);
    const columns = [
      {
        title: "标准问题",
        dataIndex: "query",
        key: "query",
        width: "40%",
      },
      {
        title: "状态",
        dataIndex: "on_stage",
        key: "on_stage",
        width: "15%",
      },
      {
        title: "更新时间",
        dataIndex: "update_time",
        key: "update_time",
        width: "30%",
      },
      {
        title: "操作",
        key: "action",
        width: "20%",
      },
    ];
    const historyColumns = [
      {
        title: "开始时间",
        dataIndex: "train_start_time",
        key: "train_start_time",
      },
      {
        title: "结束时间",
        dataIndex: "train_end_time",
        key: "train_end_time",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
      },
    ];
    const hisDataSource = reactive({ dataSource: [] });
    const current = ref(["mail"]);
    const route = useRoute();
    const router = useRouter();
    const appId = route.params.id;
    let selectedTest = reactive([]);
    // let onAllType = ref(true);
    // let onAllTag = ref(true);
    // let modifyType = ref(false);
    // let modifyTag = ref(false);

    getFAQList();
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selectedTest = selectedRowKeys;
      },
    };

    // 前往首页
    function toIndex() {
      router.push({
        name: "faq",
      });
    }

    // 获取FAQ问题列表
    function getFAQList() {
      let params = {
        app_id: appId,
      };
      let url = path.website.getAllCorpus;
      getData(url, params).then((res) => {
        console.log(res);
        faqList.faqList = res.results;
        allFaq = res.results;
        pagination.total = faqList.faqList.length;
      });
    }

    // 关闭新增问题drawer
    let getAddCorpusData = (visible) => {
      addCorpusVis.value = visible;
    };

    // 关闭编辑问题drawer
    let getEditCorpusData = (visible) => {
      editCorpusVis.value = visible;
    };

    // 关闭对话测试drawer
    let getChatModalData = (visible) => {
      chatModalVis.value = visible;
    };

    // 更新数据列表
    function updataList(flag) {
      getFAQList();
    }

    function handleDelete() {
      if (selectedTest.length !== 0) {
        deleteCorpus();
      }
    }

    // 删除一个问题
    function deleteOneCorpus(record) {
      let params = {
        app_id: appId,
        docid: record._id,
      };
      let url = path.website.deleteCorpus;
      postData(url, params).then((res) => {
        if (res.explain.indexOf("success") !== -1) {
          message.success(res.explain);
          getFAQList();
        } else {
          message.error(res.explain);
        }
      });
    }

    // 批量删除问题
    function deleteCorpus() {
      let params = {
        app_id: appId,
        docid_list: selectedTest,
      };
      let url = path.website.deleteManyCorpus;
      postData(url, params).then((res) => {
        if (res.explain.indexOf("success") !== -1) {
          message.success(res.explain);
          getFAQList();
        } else {
          message.error(res.explain);
        }
      });
    }

    // 显示新增问题drawer
    function createCorpus() {
      addCorpusVis.value = true;
    }

    // 显示对话测试
    function openChatModal() {
      chatModalVis.value = true;
    }

    // 显示编辑问题界面
    function editCorpus(i) {
      editDocId.value = i;
      editCorpusVis.value = true;
    }

    function handleTest() {
      console.log("handletest");
      testModelVis.value = true;
    }

    function closeTest() {
      testModelVis.value = false;
    }

    function trainModel() {
      console.log("trainModel");
      let url = path.website.trainModel;
      let params = {
        app_id: appId,
      };
      postData(url, params).then((res) => {
        console.log(res);
        message.info(res.explain);
      });
    }

    function importFile() {
      console.log("importFile");
      importFileVis.value = true;
    }

    function closeImport() {
      importFileVis.value = false;
    }

    function exportFile() {
      console.log("exportFile");
    }

    // 显示训练历史
    function toTrainHistory() {
      showHistory.value = true;
      getHistory();
    }

    // 获取训练记录
    function getHistory() {
      let url = path.website.stateModel;
      let params = {
        app_id: appId,
      };
      postData(url, params).then((res) => {
        console.log(res);
        res.status = res.status === 1 ? "训练成功" : "训练失败";
        hisDataSource.dataSource = [res];
      });
    }

    function onSearch() {
      if (searchWord.value === "") {
        faqList.faqList = allFaq;
      } else {
        faqList.faqList = allFaq.filter((item) => {
          if (item.query.indexOf(searchWord.value) !== -1) {
            return true;
          } else {
            return false;
          }
        });
      }
      pagination.total = faqList.faqList.length;
    }

    function takeOnCorpus(record) {
      let url = path.website.takeOnCorpus;
      let params = {
        app_id: appId,
        docid: record._id,
      };
      postData(url, params).then((res) => {
        console.log(res);
        record.on_stage = 1;
      });
    }

    function takeOffCorpus(record) {
      let url = path.website.takeOffCorpus;
      let params = {
        app_id: appId,
        docid: record._id,
      };
      postData(url, params).then((res) => {
        console.log(res);
        record.on_stage = 0;
      });
    }

    function tableChange(info) {
      console.log(info);
    }

    const handleClick = (menuInfo) => {
      console.log("click ", menuInfo);
      if (menuInfo.key !== "faq") {
        router.push({
          path: `/multidialog/${appId}`,
        });
      } else {
        showHistory.value = false;
      }
    };

    // 注释函数为树状结构筛选标签和类型相关内容
    // function showAllType() {
    //   onAllType.value = true;
    // }

    // function showNoType() {
    //   onAllType.value = false;
    //   console.log(onAllType.value);
    // }

    // function addNewType() {
    //   console.log("addNewType");
    //   let len = typeData.treeData.length;
    //   typeData.treeData.push({
    //     title: "newType",
    //     key: "0-" + len.toString(),
    //     children: [],
    //   });
    // }

    // function addNewTag() {
    //   console.log("addNewType");
    //   let len = treeData.length;
    //   treeData.push({
    //     title: "newType",
    //     key: "0-" + len.toString(),
    //     children: [],
    //   });
    // }

    // function modifyTypeTree() {
    //   modifyType.value = !modifyType.value;
    // }

    // function modifyTagTree() {
    //   modifyTag.value = !modifyTag.value;
    // }

    return {
      appId,
      faqList,
      toIndex,
      current,
      columns,
      rowSelection,
      pagination,
      scrollY,
      addCorpusVis,
      editCorpusVis,
      getAddCorpusData,
      getEditCorpusData,
      updataList,
      createCorpus,
      handleDelete,
      deleteOneCorpus,
      editCorpus,
      handleTest,
      trainModel,
      importFile,
      exportFile,
      toTrainHistory,
      showHistory,
      historyColumns,
      hisDataSource,
      importFileVis,
      testModelVis,
      closeTest,
      closeImport,
      typeData,
      expandedKeys,
      selectedKeys,
      onSearch,
      searchWord,
      takeOnCorpus,
      takeOffCorpus,
      editDocId,
      tableChange,
      chatModalVis,
      getChatModalData,
      openChatModal,
      handleClick,
      // showNoType,
      // showAllType,
      // onAllType,
      // onAllTag,
      // addNewType,
      // addNewTag,
      // modifyTypeTree,
      // modifyTagTree,
      // modifyTag,
      // modifyType,
    };
  },
});
</script>
<style scoped>
.container {
  margin: 20px auto;
  width: 1000px;
}
.ques-list {
  background-color: rgb(247, 243, 243);
  width: 1000px;
  /* border: 1px red solid; */
  margin: 20px auto;
}
.history-list {
  background-color: rgb(247, 243, 243);
  width: 1000px;
  /* border: 1px red solid; */
  margin: 20px auto;
}
.header-bar {
  height: 60px;
  width: 1000px;
  display: flex;
  margin-bottom: 10px;
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
  width: 950px;
  margin: auto;
  display: flex;
  min-height: 380px;
  justify-content: space-between;
}
.left-body {
  width: 300px;
  display: none;
}
.right-body {
  width: 100%;
}
.right-upper {
  display: flex;
  justify-content: space-between;
}
.right-btn-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.submenu-bar {
  margin-top: 10px;
  border: 1px solid rgb(222, 222, 222);
}
.his-table {
  width: 950px;
}

.type-tree {
  border: 1px purple solid;
  min-height: 300px;
}
.tag-tree {
  border: 1px green solid;
  min-height: 300px;
}
.tree-body {
  border: 1px red solid;
  width: 200px;
}
.tree-header {
  border: 1px blue solid;
  display: flex;
  justify-content: space-between;
}
.upper {
  border: 1px red solid;
  text-align: center;
}
.add-node {
  border: 1px red solid;
  display: flex;
  justify-content: space-around;
}
.tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.chat-container {
  position: fixed;
  z-index: 99;
  bottom: 0;
  right: 0;
}
.chat-inner {
  cursor: pointer;
  width: 34px;
  padding: 4px 10px;
  line-height: 1.4;
  border: 1px solid #ddd;
}
</style>
