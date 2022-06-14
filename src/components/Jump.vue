<template>
  <a-drawer title="跳转" :width="560" v-model:visible="vis" @close="onClose">
    <template #extra>
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" @click="onClose">确认</a-button>
    </template>
    <a-form :model="formState" name="addCorpus" id="form">
      <a-form-item
        style="margin-left: -10px; margin-bottom: 10px"
        name="type"
        label="跳转动作"
        :rules="[{ required: true, message: '请选择流程' }]"
      >
        <a-radio-group v-model:value="formState.type">
          <a-radio class="radio-item" :value="1"
            >跳转至流程
            <a-select
              v-if="formState.type === 1"
              v-model:value="formState.jumpTo"
              style="width: 150px; margin-left: 10px"
              placeholder="请选择流程"
              :options="labelOptions"
            ></a-select>
          </a-radio>
          <a-radio class="radio-item" :value="2">结束对话</a-radio>
          <a-radio class="radio-item" :value="3">转人工</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        v-if="formState.type!==1"
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
      <a-form-item v-if="formState.type!==1" style="margin-bottom: 10px" name="text" label="展示文本">
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
  </a-drawer>
</template>

<script>
import { getCurrentInstance, inject, reactive } from "vue";
import { postData } from "@/api/webpost";

export default {
  setup() {
    const vis = inject("jumpVis");
    let labelOptions = [
      {
        value: "test1",
        label: "test1",
      },
      {
        value: "test2",
        label: "test2",
      },
    ];
    const formState = reactive({
      type: "",
      jumpTo: "",
      text: { content: "", show: false },
      audio: { content: "", show: false },
    });

    function handleAddNewIntent() {
      console.log("add new intent");
    }
    const onClose = (e) => {
      vis.value = false;
    };
    return {
      vis,
      onClose,
      labelOptions,
      formState,
      handleAddNewIntent,
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
</style>