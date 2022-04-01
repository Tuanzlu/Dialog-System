<template>
  <div>
    <a-modal
      :footer="null"
      v-model:visible="vis"
      width="600px"
      @cancel="closeModal"
      title="新增标注数据"
    >
      <!-- <template #footer>
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" @click="addData">确认</a-button>
      </template> -->

      <div class="input-list">
        <a-button style="margin-right: 10px" @click="clearForm">
          清空
        </a-button>
        <!-- <a-form
          layout="inline"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
          :model="intent"
        >
          <a-form-item
            label="标注人员ID"
            name="labeler_id"
            :rules="[{ required: true, message: '请输入标注人员ID!' }]"
          >
            <a-input
              class="id-input"
              v-model:value="intent.labeler_id"
            ></a-input>
          </a-form-item>
        
          <a-form-item>
            <a-button html-type="submit">获取意图</a-button>
          </a-form-item>
        </a-form> -->
        <a-button @click="onFinish">获取意图</a-button>
        <div class="content-item" v-if="intent.intent_id">
          <span style="width: 70px">意图ID:</span>
          <div>{{ intent.intent_id }}</div>
        </div>
        <div class="content-item" v-if="intent.intent_info">
          <span style="width: 70px">意图内容:</span>
          <div>{{ intent.intent_info }}</div>
        </div>
        <div v-if="alreadySlots.alreadySlots">
          <div
            class="input-item"
            v-for="(item, index) in alreadySlots.alreadySlots"
            :key="index"
          >
            <span style="min-width: 40px">{{ item.key }}:</span>
            {{ item.value }}
          </div>
        </div>
        <div v-if="slotsLabel['slotsLabel']">
          <div
            class="input-item"
            v-for="(item, index) in slotsLabel['slotsLabel']"
            :key="index"
          >
            <span style="min-width: 40px">{{ item }}:</span>
            <a-input
              class="id-input"
              v-model:value="formState.slots[index]"
            ></a-input>
          </div>
        </div>
        <div class="input-item">
          <span style="width: 75px">标注人员ID:</span>
          <a-input class="id-input" v-model:value="intent.labeler_id"></a-input>
        </div>
        <div class="input-item">
          <span style="width: 65px">用户输入:</span>
          <a-input
            class="sent-input"
            v-model:value="formState.userSent"
          ></a-input>
          <a-button @click="saveData">添加标注</a-button>
        </div>
        <div
          class="content-item"
          v-if="formState.systemSent"
          style="font-weight: 1000"
        >
          <span style="width: 70px">系统反馈:</span>
          <div>{{ formState.systemSent }}</div>
        </div>
      </div>

      <!-- <a-form class="form" name="tag dialog data" :model="formState" @finish="onFinish">
          <a-form-item label="标注人员ID" name="labeler_id">
              <a-input v-model:value="formState.labeler_id"></a-input>
          </a-form-item>
          <a-form-item label="意图ID" name="intent_id">
              <a-input v-model:value="formState.intent_id" ></a-input>
          </a-form-item>
          <a-form-item label="意图内容" name="intent_info">
             关闭空调
          </a-form-item>
          <template v-for="item,index in slotsLabel" :key="index" >
              <a-form-item name="item" label="item" >
              <a-input v-model:value="formState.slots[index]" ></a-input>
          </a-form-item>
          </template>
           <a-form-item label="用户输入" name="userSent">
              <a-input v-model:value="formState.userSent" ></a-input>
          </a-form-item>
          <a-form-item label="系统回复" name="systemSent">
              {{formState.systemSent}}
          </a-form-item>
      </a-form> -->
    </a-modal>
  </div>
</template>
<script>
import { postData } from "@/api/webpost";
import { getData } from "@/api/webget";

import path from "@/api/path.js";
import {
  defineComponent,
  getCurrentInstance,
  ref,
  onUpdated,
  reactive,
} from "vue";
export default defineComponent({
  props: {
    visible: Boolean,
  },
  setup(props, context) {
    const instance = getCurrentInstance();
    console.log(props.visible);
    let vis = ref(props.visible);
    onUpdated(() => {
      vis.value = props.visible;
    });

    const formState = reactive({
      slots: [],
      userSent: "",
      systemSent: "",
    });
    const intent = reactive({
      labeler_id: "",
      intent_id: "",
      intent_info: "待获取",
    });
    const slotsLabel = reactive({ slotsLabel: [] });
    const alreadySlots = reactive({ alreadySlots: [] });

    const addData = (e) => {
      //   console.log(e);s
      console.log(formState);
      console.log("提交数据并关闭");
      vis.value = false;
      context.emit("addData", false);
    };

    const closeModal = (e) => {
      clearForm();
      console.log("仅关闭对话框");
      vis.value = false;
      context.emit("addData", false);
    };

    function clearForm() {
      intent.labeler_id = "";
      intent.intent_id = "";
      intent.intent_info = "待获取";
      formState.userSent = "";
      formState.slots = [];
      formState.systemSent = "";
      slotsLabel.slotsLabel = [];
      alreadySlots.alreadySlots = [];
    }

    let getIntentRes = {
      activate_slot_values: {},
      needvalue_list: [],
      slot_values: {},
    };

    // api
    function getIntent() {
      console.log(instance);
      //调用封装的postData函数，获取服务器返回值
      let url = path.website.getIntent;
      getData(url).then((res) => {
        console.log(res);
        getIntentRes.activate_slot_values = res.activate_slot_values;
        getIntentRes.slot_values = res.slot_values;
        getIntentRes.needvalue_list = res.needvalue_list;
        intent.intent_info = res.intent_name;
        slotsLabel.slotsLabel = res.needvalue_list;
        let tmpList = res.activate_slot_values;
        if (tmpList) {
          alreadySlots.alreadySlots = [];
          for (let item in tmpList) {
            console.log(item);
            if (tmpList[item] != "undefined") {
              alreadySlots.alreadySlots.push({
                key: item,
                value: tmpList[item],
              });
            }

            console.log(alreadySlots.alreadySlots);
          }
        } else {
          alreadySlots[alreadySlots] = [];
        }
      });
    }

    function saveSlot() {
      console.log(instance);
      let params = {
        labeler_id: intent.labeler_id,
        intent_name: intent.intent_info,
        values_list: formState.slots,
        user_utterance: formState.userSent,
        needvalue_list: getIntentRes.needvalue_list,
        slot_values: getIntentRes.slot_values,
      };
      //调用封装的postData函数，获取服务器返回值
      let url = path.website.saveSlot;
      postData(url, params).then((res) => {
        console.log(res);

        context.emit("updateData", true);
        formState.systemSent = res;
      });
    }

    const onFinish = (values) => {
      console.log("Success:", values);
      getIntent();
    };
    const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
    };

    function saveData() {
      console.log("saveData");

      console.log(formState);
      saveSlot();
    }

    return {
      addData,
      closeModal,
      vis,
      onFinish,
      onFinishFailed,
      formState,
      slotsLabel,
      saveData,
      intent,
      alreadySlots,
      clearForm,
    };
  },
});
</script>
<style scoped>
.form {
  margin: 0 50px;
}

.input-item {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.content-item {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
}
.id-input {
  width: 100px;
  margin: 0 10px;
}

.sent-input {
  width: 400px;
  margin: 0 10px;
}
</style>