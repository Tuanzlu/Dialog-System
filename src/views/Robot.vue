<template>
  <header-nav current="robot"></header-nav>

  <div class="container">
    <div class="dialog-window">
      <div class="main-window" id="main-window">
        <div class="one-dialog" v-for="(dialog, index) in dialogs" :key="index">
          <div v-if="dialog.user" class="right-dialog">
            <div class="bubble-tail-right">
              {{ dialog.user }}
            </div>
            <div class="triangle-right"></div>
          </div>
          <div class="left-dialog" v-if="dialog.robot">
            <div class="triangle-left"></div>
            <div class="bubble-tail-left">{{ dialog.robot }}</div>
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
    let inputValue = ref("");
    let session = Date.now();
    const dialogs = reactive([
      {
        robot: "您好，我是商汤智能汽车助手小糖，请问有什么可以帮您～",
        user: "",
      },
    ]);

    function getResponse() {
      if (inputValue.value === "") {
        message.info("请输入您想说的话");
      } else {
        dialogs.push({ robot: "", user: inputValue.value });

        let params = {
          query: inputValue.value,
          session: session,
        };
        //调用封装的postData函数，获取服务器返回值
        let url = path.website.getDialogResponse;
        postData(url, params).then((res) => {
          console.log(res);
          dialogs[dialogs.length - 1].robot = res.reply;
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
  background-color: rgb(245, 241, 241);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.main-window {
  height: 400px;
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
  background-color: gainsboro;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.bubble-tail-right {
  width: 200px;
  min-height: 50px;
  padding: 10px;
  word-wrap: break-word;
  border-radius: 10px;
  background-color: gainsboro;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}
.left-dialog {
  display: flex;
  justify-content: flex-start;
  padding-left: 15px;
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
  border-right: 10px solid rgb(240, 235, 235);
  border-bottom: 8px solid transparent;
}
.triangle-right {
  width: 0px;
  height: 0px;
  margin-top: 15px;

  border-top: 8px solid transparent;
  border-left: 10px solid gainsboro;
  border-right: 10px solid transparent;
  border-bottom: 8px solid transparent;
}
</style>
