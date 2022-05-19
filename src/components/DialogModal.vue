<template>
  <a-drawer
    :width="550"
    v-model:visible="vis"
    title="对话测试"
    @close="onClose"
  >
    <div class="dialog-window">
      <div class="upper-container">
        <div class="main-window" id="main-window">
          <div
            class="one-dialog"
            v-for="(dialog, index) in dialogs"
            :key="index"
          >
            <div v-if="dialog.user" class="right-dialog">
              <div class="bubble-tail-right">
                {{ dialog.user }}
              </div>
            </div>
            <div class="left-dialog" v-if="dialog.robot">
              <div class="bubble-tail-left">{{ dialog.robot }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-container">
        <a-input
          style="margin-bottom: 60px"
          :bordered="false"
          @pressEnter="getReply"
          v-model:value="inputValue"
          placeholder="请输入您的问题"
        ></a-input>
        <a-button
          :disabled="inputValue === ''"
          @click="getReply"
          size="small"
          type="primary"
          >发送</a-button
        >
      </div>
    </div>
  </a-drawer>
</template>

<script>
import { onUpdated, watch, onMounted, ref, reactive } from "vue";
import path from "@/api/path";
import { postData } from "@/api/webpost";
export default {
  props: {
    visible: Boolean,
    app_id: String,
  },
  setup(props, context) {

    let inputValue = ref();
    let vis = ref(props.visible);
    let appId = props.app_id;
    let mainWindow = ref();
    const dialogs = reactive([
      {
        robot: "您好，欢迎来到这里",
        user: "",
      },
    ]);
    let session = undefined;
    onUpdated(() => {
      vis.value = props.visible;
      appId = props.app_id;
      
    });

    function getReply() {
      dialogs.push({ robot: "", user: inputValue.value });
      if(session === undefined) {
        session = Date.now();
      }
      console.log("session",session)
      let url = path.website.replyModel;
      let params = {
        app_id: appId,
        device: "mac",
        language: "zh",
        query: inputValue.value,
        session: session,
        trace: Date.now(),
      };

      postData(url, params).then((res) => {
        inputValue.value = "";
        console.log(res);
        dialogs[dialogs.length - 1].robot = res.text;
      });
    }

    function onClose() {
      context.emit("closeChatModal", false);
      vis.value = false;
      session = undefined;
      dialogs.splice(1,dialogs.length-1)
      inputValue.value = ""
    }

    watch(dialogs, () => {
      mainWindow = document.getElementById("main-window");
      mainWindow.scrollTop = mainWindow.scrollHeight;
     
      
      console.log(mainWindow);
    },{
      deep: true
    });

    return {
      vis,
      onClose,
      getReply,
      inputValue,
      dialogs,
    };
  },
};
</script>

<style>
.dialog-window {
  margin: -24px;
  /* display: flex;
  flex-direction: column; */
}
.upper-container {
  padding: 0 16px;
  overflow-y: auto;
}
.bottom-container {
  padding: 16px 16px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.main-window {
  background-color: #f5f5f5;
  width: 100%;
  overflow-y: auto;
  padding: 14px 14px 30px 14px;
  height: 380px;
}
.one-dialog {
  margin: 10px 0;
}
.right-dialog {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.bubble-tail-right {
  max-width: 80%;
  padding: 4px 10px;
  line-height: 24px;
  background-color: #fff;
  border-radius: 14px;
  white-space: pre-wrap;
}
.bubble-tail-left {
  max-width: 80%;

  padding: 4px 10px;
  line-height: 24px;
  background-color: #fff;
  border-radius: 14px;
  white-space: pre-wrap;
}
.left-dialog {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

</style>