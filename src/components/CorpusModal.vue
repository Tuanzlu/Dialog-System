<template>
  <div>
    <a-modal
      :footer="null"
      v-model:visible="vis"
      width="600px"
      @cancel="closeModal"
      title="添加标注数据"
    >
      <div class="labeler_item" v-if="!hasLabeler">
        <span style="width: 75px">标注人员ID:</span>
        <a-input class="id-input" @pressEnter="changeLabeler" v-model:value="intent.labeler_id"></a-input>
        <a-button @click="changeLabeler" size="small">确认</a-button>
      </div>
      <div class="labeler_id" v-if="hasLabeler">
        <text style="font-size: 10">标注人员ID：{{ intent.labeler_id }}</text>
          <a-button size="small" style="margin-left: 70%" @click="clearForm"> 清空 </a-button>

      </div>
      <div class="input-list" v-if="hasLabeler">
        
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
              class="sent-input"
              v-model:value="formState.slots[index]"
            ></a-input>
          </div>
        </div>

        <div class="input-item">
          <span>用户输入:</span>
          <a-input
            class="sent-input"
            @pressEnter="saveData"
            v-model:value="formState.userSent"
          ></a-input>
          <a-button size="small" @click="saveData">添加标注</a-button>
        </div>
        <div
          class="content-item"
          v-if="formState.systemSent"
          style="font-weight: 700"
        >
          <div>{{ formState.systemSent }}</div>
        </div>
        <div class="center-btn" >
          <a-button size="small" @click="onFinish">获取意图</a-button>
        </div>
      </div>
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
    let hasLabeler = ref(false);
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
      intent_info: "待获取",
    });
    const slotsLabel = reactive({ slotsLabel: [] });
    const alreadySlots = reactive({ alreadySlots: [] });

    const closeModal = (e) => {
      clearForm();
      hasLabeler.value = false
      intent.labeler_id = ""
      console.log("关闭对话框");
      vis.value = false;
      context.emit("addData", false);
    };

    function clearForm() {
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
      clearForm();
      getIntent();
    };
   

    function saveData() {
      console.log("saveData");
      console.log(formState);
      if(intent.intent_info === "待获取") {
          formState.systemSent = "提示：请先获取意图再添加标注"
      }else {
      saveSlot();

      }
    }

    function changeLabeler() {
      hasLabeler.value = true
      getIntent()
    }

    return {
      closeModal,
      vis,
      onFinish,
      formState,
      slotsLabel,
      saveData,
      intent,
      alreadySlots,
      clearForm,
      hasLabeler,
      changeLabeler,
    };
  },
});
</script>
<style scoped>
.form {
  margin: 0 50px;
}
.labeler_id {
  margin-bottom: 5px;
}
.labeler_item {
  margin: 0 auto 30px auto;
  width: 250px;
}
.input-list {
  margin: 0 auto;
  width: 450px;
}
.input-item {
  margin: 5px auto;
  display: flex;
  width: 350px;
  flex-direction: row;
  align-items: center;
}
.content-item {
  width: 350px;
  margin: 5px auto;
  display: flex;
  flex-direction: row;
}
.id-input {
  width: 50px;
  margin: 0 10px;
}

.sent-input {
  width: 170px;
  margin: 0 10px;
}
.btn-row {
    margin-left: 80%;
}
.center-btn {
    margin-top: 15px;
    text-align: center;
}
</style>