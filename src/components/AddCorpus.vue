<template>
  <div>
    <a-drawer
      title="新增标准问题"
      :width="670"
      v-model:visible="vis"
      @close="onClose"
    >
      <div class="form">
        <div class="upper">
          <div class="ques-form">
            <a-form :model="formState" name="addCorpus" id="form" ref="formRef">
              <a-form-item
                style="margin-left: -10px; margin-bottom: 10px"
                name="query"
                label="标准问题"
                :rules="[
                  { required: true, max: 30, message: '请输入标准问题' },
                ]"
              >
                <a-textarea
                  rows="3"
                  placeholder="请输入标准问题"
                  v-model:value="formState.query"
                  :maxlength="100"
                >
                </a-textarea>
                <template #extra>
                  <label style="font-size: 5px">
                    支持中英文、数字、符号，长度不得超过100个字符
                  </label>
                </template>
              </a-form-item>
              <a-form-item
                style="margin-bottom: 10px"
                name="augamentation"
                label="扩展问题"
              >
                <a-textarea
                  rows="4"
                  :placeholder="augPlace"
                  v-model:value="formState.description"
                />
              </a-form-item>
              <a-form-item name="puppet" label="分类">
                <a-select
                  ref="select"
                  v-model:value="formState.type"
                  style="width: 120px"
                  @focus="focus"
                  @change="handleChange"
                >
                  <a-select-option value="jack">Jack</a-select-option>
                  <a-select-option value="lucy">Lucy</a-select-option>
                  <a-select-option value="disabled" disabled
                    >Disabled</a-select-option
                  >
                  <a-select-option value="Yiminghe">yiminghe</a-select-option>
                </a-select>
              </a-form-item>
            
            </a-form>
          </div>
          <div class="ans-list">
            <div class="ans-item"></div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="upper-footer"></div>
        <div class="btn-footer">
            <a-button class="btn" @click="createApp" type="primary"
                  >确认</a-button
                >
                <a-button class="btn" @click="resetForm" type="default"
                  >取消</a-button
                >
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, onUpdated, reactive, ref } from "vue";
import path from "@/api/path.js";

import { postData } from "@/api/webpost";
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

    const onClose = (e) => {
      vis.value = false;

      context.emit("closeAddCorpus", false);
    };
    const formRef = ref();
    const formState = reactive({
      query: "",
      augmentation: "",
      type: "",
      tag: "",
    });

    function createCorpus() {
      let params = {
        app_id: "XVeEZF0I",
        document: {
          query: "介绍一下李大钊",
          category: { 0: "一级分类", 1: "二级分类", 2: "三级分类" },
          label: ["服务"],
          augmentation: ["介绍一下李大钊吧", "李大钊", "请介绍一下李大钊吧"],
          answer: [
            {
              text: { content: "李大钊，出生于....", show: 1 },
              audio: { content: "李大钊，出生于....", show: 1 },
              image: { content: "", show: 1 },
              start_time: "",
              end_time: "",
            },
          ],
          answer_type: "answer",
          flow_id: "flow_id",
          update_time: "",
          reply_type: "order",
          on_stage: 1,
          is_trained: 0,
        },
      };
      let url = path.website.createCorpus;
      postData(url, params).then((res) => {
        console.log(res);
      });
      console.log("create success");
    }
    const focus = () => {
      console.log("focus");
    };

    const handleChange = (value) => {
      console.log(`selected ${value}`);
    };

    function resetForm() {
      formState.name = "";
      formState.description = "";
      formState.puppet = false;
      formState.video = false;
    }

    let augPlace = `请输入扩展问题（一行一个）\n第一个扩展问题\n第二个扩展问题\n...`;
    return {
      vis,
      onClose,
      createCorpus,
      formRef,
      formState,
      resetForm,
      focus,
      handleChange,
      augPlace,
    };
  },
});
</script>
<style scoped>
.form {
  border: 1px red solid;
  width: 620px;
  min-height: 600px;
  margin: 0 auto;
}
.footer {
  border: 1px blue solid;
  height: 200px;
  position: absolute;
  bottom: 0;
  width: 620px;
  margin: 0 auto;
}
</style>