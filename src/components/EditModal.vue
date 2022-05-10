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
        </a-form>
        <a-form-item>
          <a-button class="btn" @click="editApp" type="primary">确认</a-button>
          <a-button class="btn" @click="closeModal" type="default"
            >取消</a-button
          >
        </a-form-item>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { postData } from "@/api/webpost";
import { getData } from "@/api/webget";

import { message } from "ant-design-vue";
import path from "@/api/path.js";
import { defineComponent, ref, onUpdated, reactive } from "vue";
export default defineComponent({
  props: {
    appId: String,
    visible: Boolean,
  },
  setup(props, context) {
    console.log(props);

    let appId = ref(props.appId);
    let vis = ref(props.visible);
    onUpdated(() => {
      console.log(props);
      
      
      vis.value = props.visible;
        appId.value = props.appId;
        if(appId.value !== undefined){
getAppInfo(appId.value);
        }
      
    });

    const formRef = ref();
    const formState = reactive({
      name: "",
      description: "",
      video: false,
      puppet: false,
      app_id: "",
      catchall_counter: 3,
      chitchat_enable: true,
      askback_enable: true,
      weather_enable: true,
      poem_enable: true,
      joke_enable: false,
    });

    function getAppInfo(app_id) {
      console.log("get app list");

      let url = path.website.getAppList;
      getData(url).then((res) => {
        for (let item of res.results) {
          if (item.app_id === app_id) {
            formState.app_id = app_id;
            formState.name = item.app_name;
            formState.video = item.config.video_call;
            formState.puppet = item.config.puppet_enable;
            formState.joke_enable = item.config.joke_enable;
            formState.poem_enable = item.config.poem_enable;
            formState.catchall_counter = item.config.catchall_counter;
            formState.chitchat_enable = item.config.chitchat_enable;
            formState.askback_enable = item.config.askback_enable;
            formState.weather_enable = item.config.weather_enable;
            break;
          }
        }
      });
    }
    const closeModal = (e) => {
       
        appId.value = undefined;
      console.log("关闭对话框");
      vis.value = false;
      context.emit("addData", false);
    };

   

    function editApp() {
      let params = {
        app_id: formState.app_id,
        name: formState.name,
        puppet_enable: formState.puppet,
        video_call: formState.video,
        catchall_counter: formState.catchall_counter,
        chitchat_enable: formState.chitchat_enable,
        askback_enable: formState.askback_enable,
        weather_enable: formState.weather_enable,
        poem_enable: formState.poem_enable,
        joke_enable: formState.joke_enable,
      };
      let url = path.website.updateApp;
      postData(url, params).then((res) => {
        message.success(res.explain);
        context.emit("updateData", true);
      });
    }


   

    return {
      closeModal,
      vis,
      formState,
      formRef,
      editApp
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