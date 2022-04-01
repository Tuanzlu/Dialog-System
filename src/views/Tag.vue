<template>
  <div>
    <header-nav current="tag"></header-nav>
    <add-modal :visible="modalVisible" @updateData="getUpdateData" @addData="addParentData"></add-modal>
    <div class="data-list">
      <div class="btn-bar">
        <a-button class="add-btn" @click="handleAdd">添加标注数据</a-button>
        <a-button class="add-btn" @click="handleDelete">删除标注数据</a-button>
      </div>
      <a-table
        class="table"
        bordered
        :row-selection="rowSelection"
        :pagination="{ pageSize: 20 }"
        :scroll="{ y: 340 }"
        :data-source="dataSource.dataSource"
        :columns="columns"
      >
      </a-table>
    </div>
  </div>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import AddModal from "@/components/AddModal.vue";
// import { postData } from "@/api/webpost";
import { getData } from "@/api/webget";
import path from "@/api/path.js";

import { defineComponent, computed, ref, reactive } from "vue";
export default defineComponent({
  components: { HeaderNav, AddModal },
  setup() {
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
        width: "25%",
      },
      {
        title: "系统反馈",
        key: "systemSend",
        dataIndex: "system_utterance",
        width: "25%",
      },
    ];

    const dataSource = reactive({
      dataSource: [],
    });
    let modalVisible = ref(false);
    console.log(modalVisible);
    const count = computed(() => dataSource.value.length + 1);
    const handleAdd = () => {
      console.log("before: ");
      console.log(modalVisible);

      modalVisible.value = true;
      console.log(modalVisible);
      const newData = {
        key: `${count.value}`,
        labeler_id: "1",
        intent_id: "2",
        intent_info: "调小空调温度",
        description: "调小3度",
      };
      dataSource.value.push(newData);
    };

    let selectedTest = reactive([]);
    const handleDelete = () => {
      for (let key in selectedTest) {
        dataSource.value = dataSource.value.filter((item) => item.key !== key);
      }
    };
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        selectedTest = selectedRowKeys;
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          "selectedRows: ",
          selectedRows
        );
      },
    };


    function getUpdateData(flag) {
      console.log("get update dataList")
      console.log(flag)
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
        dataSource.dataSource = res.map((item) => {
          let slot_str = "";
          for (let one in item.slot_values) {
            if(item.slot_values[one] !== ""){
              slot_str += `${one}:${item.slot_values[one]} / `;
            }
            
          }
          if(slot_str === "") {
            slot_str = '\\'
             item.slot_values = slot_str
          }else {
          item.slot_values = slot_str.substring(0, slot_str.length - 2);

          }

          return item;
        });
        console.log(dataSource.dataSource);
      });
    }

    getList();

    return {
      columns,
      dataSource,
      handleAdd,
      handleDelete,
      count,
      rowSelection,
      addParentData,
      modalVisible,
      getUpdateData,
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
