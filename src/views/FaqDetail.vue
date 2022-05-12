<template>
  <header-nav current="faq"></header-nav>
  <div class="container">
    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item style="font-size: 16px">FAQ问答管理</a-breadcrumb-item>
        <a-breadcrumb-item style="font-size: 16px"
          ><a @click="toIndex">应用列表</a></a-breadcrumb-item
        >
        <a-breadcrumb-item style="font-size: 16px">FAQ</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- <div class="submenu-bar">
      <a-menu v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"></a-menu>
    </div> -->
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
          <a-button @click="exportFile" style="margin: 0 5px" type="primary"
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
          <div class="upper">
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
          <div class="tag-tree"></div>
        </div>
        <div class="right-body">
          <div class="right-upper">
            <div><a-input-search
              v-model:value="value"
              placeholder="input search text"
              style="width: 200px"
              @search="onSearch"
            /></div>
            
            <div class="right-btn-bar">
              <a-button
                style="margin: 0 5px"
                type="primary"
                @click="createCorpus"
                >新增标准问题</a-button
              >
              <a-button
                @click="handleDelete"
                style="margin: 0 0 0 5px"
                type="default"
                >删除已选问题</a-button
              >
            </div>
          </div>

          <div class="faq-table">
            <a-table
              class="table"
              bordered
              :row-selection="rowSelection"
              :row-key="(record) => record._id"
              :pagination="pagination"
              :data-source="dataSource.dataSource"
              :columns="columns"
              :scroll="scrollY"
            >
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
    :visible="addCorpusVis"
    @closeAddCorpus="getAddCorpusData"
    @updateData="updateList"
  ></add-corpus>
  <!-- <edit-corpus :visible="editCorpusVis" :closeEditCorpus="getEditCorpusData" :updateData="updateList"></edit-corpus> -->
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import AddCorpus from "@/components/AddCorpus.vue";
import EditCorpus from "@/components/EditCorpus.vue";
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
  },
  setup() {
    let typeData = reactive({treeData:treeData})
    let onAllType = ref(true);
    let onAllTag = ref(true);
    let modifyType = ref(false);
    let modifyTag = ref(false);
    const expandedKeys = ref(["0-0-0", "0-0-1"]);
    const selectedKeys = ref(["0-0-0", "0-0-1"]);
    let showHistory = ref(false);
    let scrollY = reactive({ y: document.body.offsetHeight - 365 });
    const pagination = reactive({
      total: 100,
      showTotal: (total) => `共 ${total} 条`,
      pageSize: 20,
      showQuickJumper: true,
    });
    let addCorpusVis = ref(false);
    let editCorpusVis = ref(false);
    let testModelVis = ref(false);
    let importFileVis = ref(false);
    const columns = [
      {
        title: "标准问题",
        dataIndex: "query",
        key: "query",
      },
      {
        title: "状态",
        dataIndex: "on_stage",
        key: "on_stage",
      },
      {
        title: "更新时间",
        dataIndex: "update_time",
        key: "update_time",
      },
    ];
    const historyColumns = [
      {
        title: "开始时间",
        dataIndex: "start_time",
        key: "start_time",
      },
      {
        title: "结束时间",
        dataIndex: "finish_time",
        key: "finish_time",
      },
      {
        title: "状态",
        dataIndex: "state",
        key: "state",
      },
    ];
    const hisDataSource = reactive({ dataSource: [] });
    const dataSource = reactive({ dataSource: [] });
    const current = ref(["mail"]);
    const route = useRoute();
    const router = useRouter();
    const faqList = reactive({
      faqList: [],
    });
    const appId = route.params.id;
    console.log(appId);
    getFAQList();
    let selectedTest = reactive([]);

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys);
        selectedTest = selectedRowKeys;
        console.log(selectedTest);
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
    };
    function toIndex() {
      router.push({
        name: "faq",
      });
    }

    function getFAQList() {
      console.log("get faq list");
      let params = {
        app_id: appId,
      };
      let url = path.website.getAllCorpus;
      getData(url, params).then((res) => {
        console.log(res);
        dataSource.dataSource = res.results;
        pagination.total = dataSource.dataSource.length;
      });
    }

    let getAddCorpusData = (visible) => {
      addCorpusVis.value = visible;
    };
    // function getEditCorpusData(visible) {
    //   editCorpusVis.value = visible;
    // }

    function updateList() {
      getFAQList();
    }

    function handleDelete() {
      if (selectedTest.length !== 0) {
        deleteCorpus();
      }
    }

    function deleteCorpus() {
      console.log("deleteCorpus");
      let params = {
        app_id: appId,
        docid_list: selectedTest,
      };
      let url = path.website.deleteManyCorpus;
      postData(url, params).then((res) => {
        console.log(res);
        if (res.explain.indexOf("success") !== -1) {
          message.success(res.explain);
          getFAQList();
        } else {
          message.error(res.explain);
        }
      });
    }

    function createCorpus() {
      addCorpusVis.value = true;
      console.log("createCorpus");
    }

    function editCorpus() {
      console.log("edit corpus");
    }

    function handleTest() {
      console.log("handletest");
      testModelVis.value = true;
    }
    function closeTest() {
      testModelVis.value = false;
    }
    function testModel() {
      console.log("testModel");
      let url = path.website.testModel;
      let params = {
        testFile: undefined,
      };
      postData(url + "?app_id=" + appId, params).then((res) => {
        console.log(res);
        message.info(res.explain);
      });
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

    function toTrainHistory() {
      console.log("toTrainHistory");
      showHistory.value = true;
    }

    function onSearch() {
      console.log("onsearch");
    }

    function showAllType() {
      onAllType.value = true;
      
    }
    function showNoType() {
      onAllType.value = false;
      console.log(onAllType.value)
    }

    function addNewType() {
      console.log("addNewType");
      let len = typeData.treeData.length;
      typeData.treeData.push(
        {
          title:"newType",
          key: "0-"+len.toString(),
          children:[]
        }
      )
    }

    function addNewTag() {
      console.log("addNewType");
      let len = treeData.length;
      treeData.push(
        {
          title:"newType",
          key: "0-"+len.toString(),
          children:[]
        }
      )
    }

    function modifyTypeTree() {
      modifyType.value = !modifyType.value;
    }
     function modifyTagTree() {
      modifyTag.value = !modifyTag.value;
    }
    watch(expandedKeys, () => {
      console.log("expandedKeys", expandedKeys);
    });
    watch(selectedKeys, () => {
      console.log("selectedKeys", selectedKeys);
    });

    return {
      faqList,
      toIndex,
      current,
      dataSource,
      columns,
      rowSelection,
      pagination,
      scrollY,
      addCorpusVis,
      getAddCorpusData,
      updateList,
      createCorpus,
      handleDelete,
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
      showNoType,
      showAllType,
      onAllType,
      addNewType,
      addNewTag,
      modifyTypeTree,
      modifyTagTree,
      modifyTag,
      modifyType

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

  justify-content: space-between;
}
.left-body {
  width: 300px;
}
.right-body {
  width: 600px;
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

/* .submenu-bar {
  margin:10px auto;
  width:1000px;
  height: 70px;
} */
.his-table {
  width: 600px;
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
</style>
