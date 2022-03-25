<template>
  <div>
    <a-modal  v-model:visible="vis" @cancel="closeModal" title="新增标注数据">
      <template #footer>
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" @click="addData">确认</a-button>
      </template>
      <a-form class="form" name="tag dialog data" :model="formState" @finish="onFinish">
          <a-form-item label="标注人员ID" name="labeler_id">
              <a-input :value="formState.labeler_id" ></a-input>
          </a-form-item>
          <a-form-item label="意图ID" name="intent_id">
              <a-input :value="formState.intent_id" ></a-input>
          </a-form-item>
          <a-form-item label="意图内容" name="intent_info">
             关闭空调
          </a-form-item>
          <template v-for="item,index in slotsLabel" :key="index" >
              <a-form-item name="item" label="item" >
              <a-input :value="formState.slots[index]" ></a-input>
          </a-form-item>
          </template>
           <a-form-item label="用户输入" name="userSent">
              <a-input :value="formState.userSent" ></a-input>
          </a-form-item>
          <a-form-item label="系统回复" name="systemSent">
              {{formState.systemSent}}
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { defineComponent, ref, onUpdated, reactive } from "vue";
export default defineComponent({
  props: {
    visible: Boolean,
  },
  setup(props, context) {
    console.log(props.visible);
    let vis = ref(props.visible);
    onUpdated(() => {
      vis.value = props.visible;
    });

    const formState = reactive({
        labeler_id:'',
        intent_id:'',
        slots:[],
        userSent:'',
        systemSent:''

    })

    const slotsLabel = ['test1','test2']

    const addData = (e) => {
      //   console.log(e);s
      console.log("提交数据并关闭");
      vis.value = false;
      context.emit("addData", false);
    };

    const closeModal = (e) => {
      // consle.log(e)
      console.log("仅关闭对话框");
      vis.value = false;
      context.emit("addData", false);
    };

    const onFinish = (values) => {
      console.log("Success:", values);
    };

    return {
      addData,
      closeModal,
      vis,
      onFinish,
      formState,
      slotsLabel
    };
  },
});
</script>
<style scoped>
.form {
    margin: 0 50px;
}
</style>