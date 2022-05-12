<template>
  <div>
    <a-modal
      :footer="null"
      v-model:visible="vis"
      width="500px"
      @cancel="closeModal"
      title="新建应用"
    >
      <div class="form">
        <a-form :model="formState" name="addApp" id="form" ref="formRef">
          <a-form-item
            style="margin-left: -10px; margin-bottom: 10px"
            name="name"
            label="应用名称"
            :rules="[{ required: true, max: 30, message: '请输入应用名称' }]"
          >
            <a-input v-model:value="formState.name" :maxlength="30">
              <!-- <template #suffix>
                   {{formState.name.length}} 
                </template> -->
            </a-input>
            <template #extra>
              <label style="font-size: 5px">
                支持中英文、数字、符号，长度不得超过30个字符
              </label>
            </template>
          </a-form-item>
          <a-form-item
            style="margin-bottom: 10px"
            name="description"
            label="应用描述"
          >
            <a-textarea v-model:value="formState.description" :maxlength="50" />
            <template #extra>
              <label style="font-size: 5px">
                支持中英文、数字、符号，长度不得超过50个字符
              </label>
            </template>
          </a-form-item>
          <a-form-item name="puppet" label="真人接管">
            <a-switch v-model:checked="formState.puppet" />
          </a-form-item>
          <a-form-item name="video" label="视频通话">
            <a-switch v-model:checked="formState.video" />
          </a-form-item>
       
        <a-form-item>
          <a-button class="btn" @click="createApp" type="primary">确认</a-button>
          <a-button class="btn" @click="resetForm" type="default"
            >取消</a-button
          >
        </a-form-item>
         </a-form>
      </div>
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
  },
  setup(props, context) {
    console.log(props);

    let vis = ref(props.visible);
    onUpdated(() => {
      vis.value = props.visible;
    });

    const formRef = ref();
    const formState = reactive({
      name: "",
      description: "",
      video: false,
      puppet: false,
    });

    const closeModal = (e) => {
       formState.name = "";
        formState.description = "";
        formState.puppet = false;
        formState.video = false;
      console.log("关闭对话框");
      vis.value = false;
      context.emit("addData", false);
    };



    function createApp() {
      console.log("新建应用ing");
      if (formState.name.length === 0) {
        formRef.value.validate();
      } else {
        addNewApp();
      }
    }


    function addNewApp() {
      let params = {
        name: formState.name,
        puppet_enable: formState.puppet,
        video_call: formState.video,
        catchall_counter: 3,
        chitchat_enable: true,
        askback_enable: true,
        weather_enable: true,
        poem_enable: true,
        joke_enable: false,
      };
      console.log(params);
      let url = path.website.createApp;
      postData(url, params).then((res) => {
        console.log(res.ex);
        if (res.explain.indexOf("success") != -1) {
          message.success(res.explain);
          context.emit("updateData", true);
        } else {
          message.error(res.explain);
        }
      });
    }

    function resetForm() {
        formState.name = "";
        formState.description = "";
        formState.puppet = false;
        formState.video = false;
     
    }

    return {
      closeModal,
      vis,
      createApp,
      formState,
      resetForm,
      formRef,
    };
  },
});
</script>
<style scoped>
.form {
  margin: 0 50px;
}
.btn {
  margin: 0 50px;
}
</style>