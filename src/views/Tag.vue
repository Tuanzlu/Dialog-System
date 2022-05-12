<template>
  <div>
    <header-nav current="tag"></header-nav>
    <add-modal
      :visible="modalVisible"
      @updateData="getUpdateData"
      @addData="addParentData"
    ></add-modal>
    <div class="data-list">
      <div class="btn-bar">
        <a-button class="add-btn" type="primary" @click="handleAdd"
          >开始标注任务</a-button
        >
        <a-button class="add-btn" @click="handleDelete">删除标注数据</a-button>
        <a-popover
          v-model:visible="visible"
          title="输入标注人员ID"
          trigger="click"
        >
          <template #content>
            <a-input
              style="width: 100px; margin-right: 15px"
              @pressEnter="hide"
              v-model:value="searchInput"
            ></a-input>
            <a @click="hide">确定</a>
          </template>
          <a-button class="add-btn">筛选数据</a-button>
        </a-popover>
      </div>
      <a-table
        class="table"
        bordered
        :row-selection="rowSelection"
        :row-key="(record) => record.time_stamp"
        :pagination="pagination"
        :data-source="dataSource.dataSource"
        :columns="columns"
        :scroll="scrollY"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import AddModal from "@/components/AddModal.vue";
import { getData } from "@/api/webget";
import { postData } from "@/api/webpost";

import path from "@/api/path.js";

import { defineComponent, ref, reactive } from "vue";
export default defineComponent({
  components: { HeaderNav, AddModal },
  setup() {
    console.log(document.body.offsetHeight);
    let scrollY = reactive({ y: document.body.offsetHeight - 265 });
    const pagination = reactive({
      total: 100,
      showTotal: (total) => `共 ${total} 条`,
      pageSize: 50,
      showQuickJumper: true,
    });
    const columns = [
      {
        title: "标注人员ID",
        key: "labeler_id",
        dataIndex: "labeler_id",
        width: "15%",
      },
      {
        title: "意图内容",
        key: "intent_name",
        dataIndex: "intent_name",
        width: "20%",
      },
      {
        title: "slot详情",
        key: "slot",
        dataIndex: "slot_values",
        width: "25%",
      },
      {
        title: "用户输入",
        key: "userSent",
        dataIndex: "user_utterance",
        width: "20%",
      },
      {
        title: "系统反馈",
        key: "systemSend",
        dataIndex: "system_utterance",
        width: "25%",
      },
    ];
    let alldataList = [];
    const dataSource = reactive({
      dataSource: [],
    });
    let modalVisible = ref(false);
    console.log(modalVisible);
    const handleAdd = () => {
      console.log("before: ");
      console.log(modalVisible);

      modalVisible.value = true;
      console.log(modalVisible);
    };

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

    function getUpdateData(flag) {
      console.log("get update dataList");
      console.log(flag);
      getList();
    }
    function addParentData(visible) {
      console.log("in parent function addData");
      console.log(visible);
      modalVisible.value = visible;
    }

    function getList() {
      let url = path.website.getList;
      getData(url).then((res) => {
        alldataList = res.map((item) => {
          let slot_str = "";
          for (let one in item.slot_values) {
            if (item.slot_values[one] !== "") {
              slot_str += `${one}:${item.slot_values[one]} / `;
            }
          }
          if (slot_str === "") {
            slot_str = "\\";
            item.slot_values = slot_str;
          } else {
            item.slot_values = slot_str.substring(0, slot_str.length - 2);
          }

          return item;
        });
        dataSource.dataSource = alldataList;
        pagination.total = dataSource.dataSource.length;
      });
    }

    function handleDelete() {
      console.log(selectedTest);
      if (selectedTest.length !== 0) {
        deleteData();
      }
    }
    function deleteData() {
      let params = {
        delect_timestamp_list: selectedTest,
      };
      //调用封装的postData函数，获取服务器返回值
      let url = path.website.deleteData;
      postData(url, params).then((res) => {
        console.log(res);
        getList();
      });
    }

    let searchInput = ref("");
    function filterList() {
      if (searchInput.value === "") {
        dataSource.dataSource = alldataList;
      } else {
        dataSource.dataSource = alldataList.filter((item) => {
          if (item.labeler_id === searchInput.value) {
            return true;
          } else {
            return false;
          }
        });
        pagination.total = dataSource.dataSource.length;
      }
    }

    const visible = ref(false);

    const hide = () => {
      filterList();
      visible.value = false;
    };
    getList();

    return {
      columns,
      dataSource,
      handleAdd,
      handleDelete,
      rowSelection,
      addParentData,
      modalVisible,
      getUpdateData,
      pagination,
      scrollY,
      visible,
      hide,
      searchInput,
      filterList,
    };
  },
});
</script>
<style scoped>
.table {
  width: 1000px;
  margin: 20px auto;
}
.add-btn {
  margin-left: 50px;
}
.data-list {
  width: 1100px;
  margin: 20px auto 0 auto;
}
</style>
