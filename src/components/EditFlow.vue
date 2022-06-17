<template>
  <div>
    <a-modal
    destroyOnClose

      v-model:visible="vis"
      width="500px"
      @cancel="closeModal"
      title="编辑流程"
    >
      <div class="form">
        <a-form
          style="display: flex; flex-direction: column"
          :model="formState"
          name="addFlow"
          id="form"
          ref="formRef"
        >
          <a-form-item
            class="form-item"
            name="name"
            label="流程名称"
            :rules="[{ required: true, message: '请输入流程名称' }]"
          >
            <a-input
              style="width: 450px"
              v-model:value="formState.name"
              :maxlength="20"
            >
              <!-- <template #suffix>
                   {{formState.name.length}} 
                </template> -->
            </a-input>
            <template #extra>
              <label style="font-size: 5px">
                支持中英文、数字、符号，长度不得超过20个字符
              </label>
            </template>
          </a-form-item>
          <a-form-item
            style="margin-top: 10px"
            class="form-item"
            name="trigger_type"
            label="触发方式"
            :rules="[{ required: true, message: '请选择触发方式' }]"
          >
            <a-radio-group v-model:value="formState.trigger_type">
              <a-radio :value="1">主动触发 </a-radio>
              <a-radio :value="2">FAQ触发 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="closeModal" type="default">取消</a-button>
        <a-button @click="editFlow" type="primary">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { postData } from "@/api/webpost";

import { message } from "ant-design-vue";
import path from "@/api/path.js";
import { defineComponent, ref, onUpdated, reactive, inject } from "vue";
import { getData } from "@/api/webget";
export default defineComponent({
  props: {
    visible: Boolean,
    flowId: String,
    id: String
  },
  setup(props, context) {
    console.log(props);
    let flow_id = ref(props.flowId);
    let appId = "";
    let vis = ref(props.visible);
    onUpdated(() => {
      vis.value = props.visible;
      flow_id.value = props.flowId;
      appId = props.id;
      console.log("flowId", flow_id.value);
      getFlowInfo(flow_id.value);
    });

    const formRef = ref();
    const formState = reactive({
      name: "",
      trigger_type: "",
    });
    let flowInfo = {};

    const closeModal = (e) => {
      resetForm();
      vis.value = false;
      context.emit("addData", false);
    };

    function getFlowInfo(id) {
      let url = path.website.getFlow;
      let params = {
        app_id: appId,
        flow_id: id,
      };
      postData(url, params).then((res) => {
        console.log(res);
        flowInfo = res.flow;
        formState.name = res.flow.flow_name;
        formState.trigger_type = res.flow.trigger_type === "faq" ? 2 : 1;
      });

      console.log("formState", formState);
    }
    function editFlow() {
      console.log("updateFlow", formState);
      if (formState.name.length === 0) {
        formRef.value.validate();
      } else {
        editFlowContent();
      }
    }
 function getDateStr() {
      let n = new Date();
      return (
        n.toLocaleDateString().replace(/\//g, "-") +
        " " +
        n.toTimeString().substr(0, 8)
      );
    }
    function editFlowContent() {
      let params = {
        app_id:appId,
        flow_id: flow_id.value,
        node_list: flowInfo.node_list,
        edge_list: flowInfo.edge_list,
        flow_name: formState.name,
        create_time: flowInfo.create_time,
        update_time: getDateStr(),
        trigger_type: formState.trigger_type===1?"extra_call": "faq"
      };
      console.log(params);
      let url = path.website.updateFlow;
      postData(url, params).then((res) => {
        console.log(res);
        if (res.explain.indexOf("success") != -1) {
          message.success("update successfully!");
          context.emit("updateData", true);
          closeModal()
        } else {
          message.error(res.explain);
        }
      });
    }

    function resetForm() {
      formState.name = "";
      formState.trigger_type = "";
    }

    return {
      closeModal,
      vis,
      editFlow,
      formState,
      resetForm,
      formRef,
    };
  },
});
</script>
<style scoped>
.form {
  margin: 0 auto;
}
.form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 60px;
}
.btn {
  margin: 0 50px;
}
</style>