<template>
<div>
  <header-nav current="tag"></header-nav>

  <div class="data-list">
    <div class="btn-bar">
      <a-button class="add-btn" @click="handleAdd">添加标注数据</a-button>
      <a-button class="add-btn" @click="handleDelete">删除标注数据</a-button>
    </div>
    <a-table
      class="table"
      bordered
      :row-selection="rowSelection"
      :pagination="{ pageSize: 50 }"
      :scroll="{ y: 340 }"
      :data-source="dataSource"
      :columns="columns"
    >
    </a-table>
  </div>
  </div>
</template>
<script>
import HeaderNav from "@/components/HeaderNav.vue";
import { defineComponent, computed, ref, reactive } from "vue";
export default defineComponent({
  components: { HeaderNav },
  setup() {
    const columns = [
      {
        title: "labeler_id",
        key: 'labeler_id',
        dataIndex: "labeler_id",
        width: "13%",
      },
      {
        title: "intent_id",
        key: "intent_id",
        dataIndex: "intent_id",
        width: "12%",
      },
      {
        title: "intent_info",
        key: "intent_info",
        dataIndex: "intent_info",
        width: "20%",
      },
      {
        title: "description",
        key: "description",
        dataIndex: "description",
        width: "40%",
      }
    ];

    const dataSource = ref([
      {
        key: "0",
        labeler_id: "1",
        intent_id: "1",
        intent_info: "调大空调温度",
        description: "调大3度",
      },
      {
        key: "1",
        labeler_id: "1",
        intent_id: "1",
        intent_info: "调大空调温度",
        description: "调大3度",
      },
      {
        key: "2",
        labeler_id: "1",
        intent_id: "1",
        intent_info: "调大空调温度",
        description: "调大3度",
      },
      {
        key: "3",
        labeler_id: "1",
        intent_id: "1",
        intent_info: "调大空调温度",
        description: "调大3度",
      },
    ]);
    const count = computed(() => dataSource.value.length + 1);
    const handleAdd = () => {
      const newData = {
        key: `${count.value}`,
        labeler_id: "1",
        intent_id: "2",
        intent_info: "调小空调温度",
        description: "调小3度",
      };
      dataSource.value.push(newData);
    };

    let selectedTest = reactive([])
    const handleDelete = ()=> {
        for(let key in selectedTest) {
            dataSource.value = dataSource.value.filter(item => item.key !== key);
        }
    }
     const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
          selectedTest = selectedRowKeys
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };
    return {
      columns,
      dataSource,
      handleAdd,
      handleDelete,
      count,
      rowSelection
    };
  },
});
</script>
<style scoped>
.table {
  width: 800px;
  margin: 20px auto;
}
.add-btn {
  margin-left: 50px;
}
.data-list {
  width: 900px;
  margin: 20px auto 0 auto;
}
</style>
