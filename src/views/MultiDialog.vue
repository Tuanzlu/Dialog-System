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
          >流程管理(主动流程最多一个)</a-breadcrumb-item
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
    <div class="colored-square" v-if="watchFlow === false">
      <div class="header-bar">
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
            <a-popconfirm
              title="是否确定删除？"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete"
            >
              <a-button style="margin: 0 5px" type="default">批量删除</a-button>
            </a-popconfirm>
            <a-button
              style="margin: 0 0 0 5px"
              type="primary"
              @click="createFlow"
              ><plus-circle-outlined />新增</a-button
            >
          </div>
        </div>
      </div>
      <div class="main-body">
        <a-table
          class="flow-table"
          bordered
          :row-selection="rowSelection"
          :row-key="(record) => record.flow_id"
          :pagination="pagination"
          :data-source="flowData.dataSource"
          :columns="flowColumns"
          :scroll="scrollY"
          @change="tableChange"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a style="margin: 0 5px 0 0" @click="editFlow(record.flow_id)"
                >编辑</a
              >
              <a
                style="margin: 0 5px"
                v-if="record.on_stage === 1"
                @click="takeOffFlow(record)"
                >下架</a
              >
              <a style="margin: 0 5px" v-else @click="takeOnFlow(record)"
                >上架</a
              >
              <a-popconfirm
                title="是否确定删除？"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteOneFlow(record)"
              >
                <a style="margin: 0 0 0 5px">删除</a>
              </a-popconfirm>
              <a style="margin: 0 5px" @click="lookAtFlow(record)">查看</a>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <div class="colored-square" v-else>
      <div class="header-bar">
        <div class="header-title">流程图</div>
      </div>
      <div class="main-body">
        <flow-chart :flowId="lookId" :id="appId"></flow-chart>
      </div>
    </div>
  </div>
  <flow-modal
    :id="appId"
    :visible="addFlowVis"
    @updateData="updateList"
    @addData="addParentData1"
  >
  </flow-modal>
  <edit-flow
    :id="appId"
    :flowId="editFlowId"
    :visible="editFlowVis"
    @updateData="updateList"
    @addData="addParentData2"
  ></edit-flow>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import FlowModal from "@/components/FlowModal.vue";
import EditFlow from "@/components/EditFlow.vue";
import { defineComponent, watch, reactive, ref, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import path from "@/api/path.js";
import {
  EditOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { postData } from "@/api/webpost";
import FlowChart from "@/components/FlowChart.vue";
import { message } from "ant-design-vue";
export default defineComponent({
  components: {
    HeaderNav,
    FlowChart,
    FlowModal,
    EditFlow,
    EditOutlined,
    CloseCircleOutlined,
    PlusCircleOutlined,
  },
  setup() {
    let searchWord = ref("");
    const selectedKeys = ref(["flow"]);
    let scrollY = reactive({ y: document.body.offsetHeight - 365 });
    const flowColumns = [
      {
        title: "流程名称",
        dataIndex: "flow_name",
        key: "flow_name",
      },
      {
        title: "触发方式",
        dataIndex: "trigger_type",
        key: "trigger_type",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        key: "create_time",
      },
      {
        title: "最近修改时间",
        dataIndex: "update_time",
        key: "update_time",
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    function getDateStr() {
      let n = new Date();
      return (
        n.toLocaleDateString().replace(/\//g, "-") +
        " " +
        n.toTimeString().substr(0, 8)
      );
    }
    const flowData = reactive({
      dataSource: [
        {
          flow_id: "1",
          flow_name: "test",
          create_time: getDateStr(),
          update_time: getDateStr(),
          on_stage: 1,
          trigger_type: "FAQ触发",
        },
      ],
    });
    const pagination = reactive({
      total: flowData.dataSource.length,
      showTotal: (total) => `共 ${total} 条`,
      pageSize: 20,
      showSizeChanger: false,
      showQuickJumper: true,
    });
    let allFlow = flowData.dataSource;
    let watchFlow = ref(false);

    let addFlowVis = ref(false);
    let editFlowVis = ref(false);
    const current = ref(["mail"]);
    const route = useRoute();
    const router = useRouter();
    const appId = route.params.id;

    let selectedTest = reactive([]);
    getFlowList();

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

    function getFlowList() {
      let params = {
        app_id: appId,
      };
      let url = path.website.getAllFlow;
      postData(url, params).then((res) => {
        console.log(res);
        flowData.dataSource = res.dialog_flows;
        allFlow = res.dialog_flows;
        pagination.total = allFlow.length;
      });
    }

    function createFlow() {
      addFlowVis.value = true;
    }
    let editFlowId = ref();
    function editFlow(id) {
      editFlowId.value = id;
      editFlowVis.value = true;
    }

    function addParentData1(visible) {
      console.log("in parent function addData");
      console.log(visible);
      addFlowVis.value = visible;
    }
    function addParentData2(visible) {
      console.log("in parent function addData");
      console.log(visible);
      editFlowVis.value = visible;
    }

    function updateList(flag) {
      getFlowList();
    }

    function handleDelete() {
      if (selectedTest.length !== 0) {
        deleteFlow();
      }
    }
    function deleteOneFlow(record) {
      let params = {
        app_id: appId,
        flow_id: record.flow_id,
      };
      let url = path.website.deleteFlow;
      postData(url, params).then((res) => {
        if (res.explain.indexOf("success") !== -1) {
          message.success("delete successfully!");
          getFlowList();
        } else {
          message.error(res.explain);
        }
      });
    }
    function deleteFlow() {
      let params = {
        app_id: appId,
        flow_id_list: selectedTest,
      };
      let url = path.website.deleteManyFlow;
      postData(url, params).then((res) => {
        if (res.explain.indexOf("success") !== -1) {
          message.success("delete successfully!");
          getFlowList();
        } else {
          message.error(res.explain);
        }
      });
    }

    function onSearch() {
      if (searchWord.value === "") {
        flowData.dataSource = allFlow;
      } else {
        flowData.dataSource = allFlow.filter((item) => {
          if (item.flow_name.indexOf(searchWord.value) !== -1) {
            return true;
          } else {
            return false;
          }
        });
      }
      pagination.total = flowData.dataSource.length;
    }

    function takeOnFlow(record) {
      let url = path.website.takeOnFlow;
      let params = {
        app_id: appId,
        flow_id: record.flow_id,
      };
      postData(url, params).then((res) => {
        console.log(res);
        record.on_stage = 1;
      });
    }

    function takeOffFlow(record) {
      let url = path.website.takeOffFlow;
      let params = {
        app_id: appId,
        flow_id: record.flow_id,
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
      if (menuInfo.key !== "flow") {
        router.push({
          path: `/faqdetail/${appId}`,
        });
      } else {
        getFlowList();
        watchFlow.value = false;
      }
    };

    let lookId = ref();
    let flowInfo = ref({});
    function lookAtFlow(record) {
      console.log(record.flow_id);
      lookId.value = record.flow_id;
      watchFlow.value = true;
      flowInfo.value = record;
    }
    provide("flow_id", lookId);
    provide("flow_info", flowInfo);
    watch(selectedKeys, () => {
      console.log("selectedKeys", selectedKeys);
    });
    return {
      watchFlow,
      appId,
      toIndex,
      current,
      rowSelection,
      pagination,
      scrollY,
      updateList,
      createFlow,
      editFlow,
      handleDelete,
      deleteOneFlow,
      flowColumns,
      flowData,
      selectedKeys,
      onSearch,
      searchWord,
      takeOnFlow,
      takeOffFlow,
      tableChange,
      handleClick,
      addFlowVis,
      editFlowVis,
      lookAtFlow,
      addParentData1,
      addParentData2,
      editFlowId,
      lookId,
    };
  },
});
</script>
<style scoped>
.container {
  margin: 20px auto;
  width: 1000px;
}
.colored-square {
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
  justify-content: flex-start;
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

.right-btn-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

.submenu-bar {
  margin-top: 10px;
  border: 1px solid rgb(222, 222, 222);
}
.flow-table {
  width: 100%;
}
.right-upper {
  width: 950px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.node-list {
  border: 1px red solid;
  width: 160px;
}
.flow-chart {
  border: 1px red solid;
  width: 100%;
}
</style>
