<template>
  <header-nav current="robot"></header-nav>

  <div class="container">
    <div class="dialog-window">
      <div class="debug-bar">
        调试模式：<a-switch
          v-model:checked="mode"
          checked-children="开启"
          un-checked-children="关闭"
        />
      </div>
      <div class="main-window" id="main-window">
        <div class="one-dialog" v-for="(dialog, index) in dialogs" :key="index">
          <div v-if="dialog.user" class="right-dialog">
            <div class="bubble-tail-right">
              {{ dialog.user }}
            </div>
            <div class="triangle-right"></div>
          </div>
          <div class="left-dialog" v-if="dialog.robot.text">
            <div class="triangle-left"></div>
            <div class="bubble-tail-left">
              <div style="padding-bottom:10px">{{ dialog.robot.text }}</div>
              <div v-if="mode&&index!==0" style="border-top: 1px solid black">
                intent：{{dialog.robot.intent}}
              </div>
              <div v-if="mode&&index!==0">
                active_slots：{{dialog.robot.active_slots}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <a-input
          class="input"
          v-model:value="inputValue"
          placeholder="请输入您想说的话"
          @pressEnter="inputMethod"
        ></a-input>
        <a-button
          :disabled="inputValue === ''"
          class="btn"
          type="primary"
          @click="inputMethod"
          >发送</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUpdated, reactive, ref } from "vue";
import HeaderNav from "@/components/HeaderNav.vue";
import { postData } from "@/api/webpost";
import path from "@/api/path.js";
import { message } from "ant-design-vue";

export default {
  components: { HeaderNav },
  setup() {
    let mode = ref(false); // false为默认对话状态，true为调试状态
    let inputValue = ref("");
    let session = "";
    const dialogs = reactive([
      {
        robot: {
          text: "您好，我是商汤智能汽车助手小糖，请问有什么可以帮您～",
          intent: "",
          active_slots:{}
        },
        user: "",
      },
    ]);

    function getResponse() {
      if (inputValue.value === "") {
        message.info("请输入您想说的话");
      } else {
        dialogs.push({ robot: 
        {
          text: "",
          intent: "",
          active_slots: {}
        }, user: inputValue.value });
        let params;
        if (session.length === 0) {
          params = {
            query: inputValue.value,
          };
        } else {
          params = {
            query: inputValue.value,
            sessionId: session,
          };
        }
        //调用封装的postData函数，获取服务器返回值
        let url = path.website.getDialogResponse;
        postData(url, params).then((res) => {
          console.log(res);
          if(session.length === 0) {
            session = res.sessionId;
          }
          dialogs[dialogs.length - 1].robot.text = res.reply;
          dialogs[dialogs.length - 1].robot.intent = res.intent;
          dialogs[dialogs.length - 1].robot.active_slots = res.active_slots;
          inputValue.value = "";
        });
      }
    }
    let mainWindow = ref();
    onMounted(() => {
      mainWindow = document.getElementById("main-window");
    });

    onUpdated(() => {
      mainWindow.scrollTop = mainWindow.scrollHeight;
    });
    function inputMethod() {
      getResponse();
    }

    return {
      inputValue,
      inputMethod,
      dialogs,
      mode,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
}
.dialog-window {
  height: 500px;
  width: 700px;
  margin: 20px auto 0 auto;
  border: 1px grey solid;
  border-radius: 35px;
  background-color: rgb(241, 244, 245);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.main-window {
  height: 380px;
  width: 650px;
  margin: 10px auto;
  background-color: white;
  border: 1px grey solid;
  border-radius: 10px;
  overflow-y: auto;
}
.bottom {
  height: 35px;
  width: 650px;
  margin: 22px auto;
  display: flex;
}
.input {
  border-radius: 10px;
  margin-right: 10px;
}
.btn {
  height: 35px;
  width: 60px;
  border-radius: 10px;
}
.one-dialog {
  display: flex;
  flex-direction: column;
  align-content: space-around;
  margin: 20px 0;
}
.bubble-tail-left {
  /* position: absolute; */
  width: 250px;
  padding: 10px;
  min-height: 50px;
  border-radius: 10px;
  word-wrap: break-word;
  background-color: rgb(211, 217, 231);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.bubble-tail-right {
  width: 200px;
  min-height: 50px;
  padding: 10px;
  word-wrap: break-word;
  border-radius: 10px;
  background-color: rgb(221, 240, 224);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.left-dialog {
  display: flex;
  justify-content: flex-start;
  /* padding-left: 15px; */
}
.right-dialog {
  display: flex;
  justify-content: flex-end;
}
.triangle-left {
  width: 0px;
  height: 0px;
  margin-top: 15px;
  border-top: 8px solid transparent;
  border-left: 10px solid transparent;
  border-right: 10px solid rgb(211, 217, 231);
  border-bottom: 8px solid transparent;
}
.triangle-right {
  width: 0px;
  height: 0px;
  margin-top: 15px;

  border-top: 8px solid transparent;
  border-left: 10px solid rgb(221, 240, 224);
  border-right: 10px solid transparent;
  border-bottom: 8px solid transparent;
}
.debug-bar {
  margin: 10px 30px 0 0;
  display: flex;
  justify-content: flex-end;
}
</style>
