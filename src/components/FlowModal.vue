<template>
  <div>
    <a-modal
    destroyOnClose
      v-model:visible="vis"
      width="500px"
      @cancel="closeModal"
      title="新建流程"
    >
      <div class="form">
        <a-form style="display:flex;flex-direction:column" :model="formState" name="addFlow" id="form" ref="formRef">
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
          style="margin-top:10px"
            class="form-item"
            name="trigger_type"
            label="触发方式"
            :rules="[{ required: true, message: '请选择触发方式' }]"
          >
            <a-radio-group v-model:value="formState.trigger_type">
              <a-radio :value="1">主动触发 </a-radio>
              <a-radio  :value="2">FAQ触发 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="closeModal" type="default">取消</a-button>
        <a-button @click="createFlow" type="primary">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { postData } from "@/api/webpost";

import { message } from "ant-design-vue";
import path from "@/api/path.js";
import { defineComponent, ref, onUpdated, reactive } from "vue";
export default defineComponent({
  props: {
    visible: Boolean,
    id: String
  },
  setup(props, context) {
    console.log(props);

   let appId = "";
    let vis = ref(props.visible);

    onUpdated(() => {
      vis.value = props.visible;
      appId = props.id;
    });
    const formRef = ref();
    const formState = reactive({
      name: "",
      trigger_type: "",
    });

    const closeModal = (e) => {
      resetForm();
      vis.value = false;
      context.emit("addData", false);
    };

    function createFlow() {
      console.log("newFlow", formState);
      if (formState.name.length === 0||formState.trigger_type.length===0) {
        formRef.value.validate();
      } else {
        addNewFlow();
      }
    }

    function addNewFlow() {
      let params = {
        app_id: appId,
        on_stage: true,
        flow_name: formState.name,
        trigger_type: formState.trigger_type===1?"extra_call": "faq"
      };
      console.log(params);
      let url = path.website.createFlow;
      postData(url, params).then((res) => {
        console.log(res);
        if (res.explain.indexOf("success") != -1) {
          message.success(res.explain);
          context.emit("updateData", true);
          closeModal();
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
      createFlow,
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