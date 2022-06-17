<template>
  <a-drawer
    destroyOnClose
    title="信息收集"
    :width="560"
    v-model:visible="vis"
    @close="onClose"
  >
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onClose">确认</a-button>
    </template>
    <div class="form">
      <a-form :model="formState" name="addCorpus" id="form">
        <a-form-item
          v-if="formState.type !== 1"
          style="margin-bottom: 10px"
          name="augmentation"
          label="语音播报"
        >
          <template #extra>
            <label style="font-size: 5px">
              支持中英文、数字、符号，长度不得超过500个字符
            </label>
          </template>
          <div style="display: flex">
            <a-textarea
              style="resize: none"
              :rows="4"
              :maxlength="500"
              placeholder="请输入语音播报"
              v-model:value="formState.audio.content"
            >
            </a-textarea>
            <a-form-item-rest>
              <a-switch
                style="margin: 0 30px 0 20px"
                v-model:checked="formState.audio.show"
              />
            </a-form-item-rest>
          </div>
        </a-form-item>
        <a-form-item
          v-if="formState.type !== 1"
          style="margin-bottom: 10px"
          name="text"
          label="展示文本"
        >
          <template #extra>
            <label style="font-size: 5px">
              支持中英文、数字、符号，长度不得超过500个字符
            </label>
          </template>
          <div style="display: flex">
            <a-textarea
              style="resize: none"
              :rows="4"
              placeholder="请输入展示文本"
              v-model:value="formState.text.content"
              :maxlength="500"
            >
            </a-textarea>
            <a-form-item-rest>
              <a-switch
                style="margin: 0 30px 0 20px"
                v-model:checked="formState.text.show"
              />
            </a-form-item-rest>
          </div>
        </a-form-item>
      </a-form>
    </div>
    <div class="slot-list">
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        "
      >
        <div>收集信息</div>
        <a>增加系统槽位</a>
      </div>
      <div class="slot-item" v-for="(item, i) in slot_list.slot_list" :key="i">
        <div
          style="
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;
          "
        >
          <div style="margin-right: 15px">槽位{{ i + 1 }}</div>
          <a @click="deleteOneAnswer(i)" v-if="slot_list.slot_list.length > 1">
            删除槽位
          </a>
        </div>
        <a-form :model="item" name="addCorpus" id="form">
          <a-form-item
            style="margin-left: -10px"
            name="slot_name"
            label="槽位名称"
            :rules="[{ required: true, message: '请选择槽位' }]"
          >
            <a-select
              v-model:value="item.slot_name"
              style="width: 150px"
              placeholder="请选择槽位名称"
              :options="slotOptions"
            ></a-select>
          </a-form-item>
          <a-form-item
            style="margin-left: -10px; margin-bottom: 10px"
            name="ques_text"
            label="追问话术"
            :rules="[{ required: true, message: '请输入追问话术' }]"
          >
            <template #extra>
              <label style="font-size: 5px">
                支持中英文、数字、符号，长度不得超过500个字符
              </label>
            </template>
            <div style="display: flex">
              <a-textarea
                style="resize: none"
                :rows="4"
                placeholder="请输入追问文本"
                v-model:value="item.ques_text"
                :maxlength="500"
              >
              </a-textarea>
            </div>
          </a-form-item>
          <a-form-item
            style="margin-left: -10px"
            name="ques_times"
            label="追问次数"
            :rules="[{ required: true, message: '请选择追问次数' }]"
          >
            <a-select
              v-model:value="item.ques_times"
              style="width: 150px"
              placeholder="请选择追问次数"
              :options="timesOptions"
            ></a-select>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="footer">
      <a-button
        type="primary"
        @click="plusOneAnswer"
        style="width: 100%; margin-bottom: 20px"
        >新增槽位</a-button
      >
    </div>
  </a-drawer>
</template>

<script>
import { getCurrentInstance, ref, inject, reactive } from "vue";
import { postData } from "@/api/webpost";

export default {
  setup() {
    const vis = inject("infoCollectVis");
    const slotOptions = ref([
    
    ]);
    let timesOptions = [
      {
        value: "0",
        label: "0",
      },
      {
        value: "1",
        label: "1",
      },
      {
        value: "2",
        label: "2",
      },
      {
        value: "3",
        label: "3",
      },
      {
        value: "4",
        label: "4",
      },
      {
        value: "5",
        label: "5",
      },
      {
        value: "6",
        label: "6",
      },
      {
        value: "7",
        label: "7",
      },
      {
        value: "8",
        label: "8",
      },
      {
        value: "9",
        label: "9",
      },
      {
        value: "10",
        label: "10",
      },
    ];

    const formState = reactive({
      text: { content: "", show: false },
      audio: { content: "", show: false },
    });
    const slot_list = reactive({ slot_list: [] });
    let slot_item = {
      slot_name: [],
      ques_text: "",
      ques_times: [],
    };
    slot_list.slot_list.push(slot_item);
    function plusOneAnswer() {
      let oneItem = {
        slot_name: [],
        ques_text: "",
        ques_times: [],
      };
      slot_list.slot_list.push(oneItem);
    }

    function deleteOneAnswer(i) {
      slot_list.slot_list.splice(i, 1);
    }
    function handleAddNewSlot() {
      console.log("add new slot");
    }
    const onClose = (e) => {
      console.log(vis.value);
      vis.value = false;
    };
    return {
      vis,
      onClose,
      slotOptions,
      timesOptions,
      formState,
      handleAddNewSlot,
      plusOneAnswer,
      slot_list,
      deleteOneAnswer,
    };
  },
};
</script>

<style scoped>
.radio-item {
  display: flex;
  height: 30px;
  line-height: 30px;
}
.footer {
  z-index: 9999;
  position: absolute;
  background-color: white;
  bottom: 0;
  width: 510px;
  margin: 0 auto;
  overflow: hidden;
}
.btn-footer {
  display: flex;
  justify-content: flex-end;
}
.upper-footer {
  margin-top: 20px;
}
.slot-list {
  margin-bottom: 50px;
}
</style>