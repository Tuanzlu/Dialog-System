<template>
  <div>
    <a-drawer
      title="编辑标准问题"
      :width="670"
      v-model:visible="vis"
      @close="onClose"
    >
      <div class="form">
        <div class="upper">
          <div class="ques-form">
            <a-form
              :model="formState"
              name="editCorpus"
              id="form"
              ref="formRef"
            >
              <a-form-item
                style="margin-left: -10px; margin-bottom: 10px"
                name="query"
                label="标准问题"
                :rules="[{ required: true, message: '请输入标准问题' }]"
              >
                <a-textarea
                style="resize:none"
                  :rows="3"
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
                name="augmentation"
                label="扩展问题"
              >
                <a-textarea
                style="resize:none"
                  :rows="4"
                  :placeholder="augPlace"
                  v-model:value="formState.augmentation"
                />
              </a-form-item>
              <a-form-item
                style="margin-left: 28px"
                name="category"
                label="分类"
              >
                <a-select
                  v-model:value="formState.category"
                  style="width: 100%"
                  placeholder="请输入分类"
                  :options="categoryOptions"
                  @change="handleCategoryChange"
                ></a-select>
              </a-form-item>
              <a-form-item style="margin-left: 28px" name="label" label="标签">
                <a-select
                  v-model:value="formState.label"
                  mode="multiple"
                  style="width: 100%"
                  placeholder="请勾选标签"
                  :options="labelOptions"
                  @change="handleLabelChange"
                ></a-select>
              </a-form-item>
            </a-form>
          </div>
          <div class="ans-list">
            <div
              class="ans-item"
              v-for="(item, i) in answer_list.answer_list"
              :key="i"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
                "
              >
                <div class="header-title">回答{{ i + 1 }}</div>
                <a @click="deleteOneAnswer(i)">
                  <delete-outlined
                    v-if="answer_list.answer_list.length > 1"
                    style="color: red; margin-top: 5px"
                  />
                </a>
              </div>
              <a-form :model="item" name="editCorpus" id="form">
                <a-form-item
                  style="margin-bottom: 10px"
                  name="text"
                  label="展示文本"
                >
                  <template #extra>
                    <label style="font-size: 5px">
                      支持中英文、数字、符号，长度不得超过1000个字符
                    </label>
                  </template>
                  <div style="display: flex">
                    <a-textarea
                    style="resize:none"
                      :rows="4"
                      placeholder="请输入展示文本"
                      v-model:value="item.text.content"
                      :maxlength="1000"
                    >
                    </a-textarea>
                    <a-form-item-rest>
                      <a-switch
                        style="margin: 0 30px 0 20px"
                        v-model:checked="item.text.show"
                      />
                    </a-form-item-rest>
                  </div>
                </a-form-item>

                <a-form-item
                  style="margin-bottom: 10px"
                  name="augmentation"
                  label="语音播报"
                >
                  <template #extra>
                    <label style="font-size: 5px">
                      支持中英文、数字、符号，长度不得超过1000个字符
                    </label>
                  </template>
                  <div style="display: flex">
                    <a-textarea
                    style="resize:none"
                      :rows="4"
                      placeholder="请输入语音播报"
                      v-model:value="item.audio.content"
                    >
                    </a-textarea>
                    <a-form-item-rest>
                      <a-switch
                        style="margin: 0 30px 0 20px"
                        v-model:checked="item.audio.show"
                      />
                    </a-form-item-rest>
                  </div>
                </a-form-item>
                <a-form-item style="margin-left: 28px" name="pic" label="图片">
                  <template #extra>
                    <label style="font-size: 5px">
                      支持图片格式jpeg、png、jpg、gif，最大不超过10M
                    </label>
                  </template>
                  <div style="display: flex">
                    <a-upload
                      v-model:file-list="fileList"
                      name="avatar"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      :before-upload="beforeUpload"
                      @change="handleChange"
                    >
                      <img
                        @click="getCurImage(i)"
                        v-if="imageUrl"
                        :src="imageUrl"
                        alt="avatar"
                      />
                      <div v-else @click="getCurImage(i)">
                        <loading-outlined v-if="loading"></loading-outlined>
                        <plus-outlined v-else></plus-outlined>
                        <div class="ant-upload-text">Upload</div>
                      </div>
                    </a-upload>
                    <a-form-item-rest>
                      <a-switch
                        style="margin: 0 30px 0 20px"
                        v-model:checked="item.image.show"
                      />
                    </a-form-item-rest>
                  </div>
                </a-form-item>
                <a-form-item name="date" label="生效日期">
                  <a-range-picker
                    @change="onChange"
                    @ok="onOk(i)"
                    format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="['开始时间', '结束时间']"
                    showTime
                  />
                </a-form-item>
              </a-form>
              <a-divider style="margin-top: -10px"></a-divider>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <a-button type="primary" @click="plusOneAnswer" style="width: 100%"
          ><plus-circle-outlined />新增回答</a-button
        >
        <div class="upper-footer">
          <a-radio-group v-model:value="radioValue">
            <a-radio value="order">按顺序返回答案</a-radio>
            <a-radio value="random">随即返回答案</a-radio>
          </a-radio-group>
        </div>
        <div class="btn-footer">
          <a-button style="margin-right: 10px" @click="resetForm" type="default"
            >取消</a-button
          >
          <a-button @click="editCorpus" type="primary">确定</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, onUpdated, reactive, ref } from "vue";
import path from "@/api/path.js";
import {
  PlusCircleOutlined,
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { postData } from "@/api/webpost";
import { getData } from "@/api/webget";
import { message } from "ant-design-vue";
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default defineComponent({
  props: {
    visible: Boolean,
    id: String,
    doc: String,
  },
  components: {
    PlusCircleOutlined,
    PlusOutlined,
    LoadingOutlined,
    DeleteOutlined,
  },
  setup(props, context) {
    let vis = ref(props.visible);
    let appId = "";
    let docid = "";
    let flag = 0;
    onUpdated(() => {
      vis.value = props.visible;
      appId = props.id;
      docid = props.doc;
      if (flag === 0) {
        getCorpusDetail();
      }
    });
    const radioValue = ref("order");
    const onClose = (e) => {
      vis.value = false;

      context.emit("closeEditCorpus", false);
    };
    const labelOptions = ref([
      // {
      //   value: "a",
      //   label: "a",
      // },
      // {
      //   value: "b",
      //   label: "b",
      // },
    ]);
    const categoryOptions = ref([
      //   {
      //     value: "a",
      //     label: "a",
      //   },
      //   {
      //     value: "b",
      //     label: "b",
      //   },
    ]);
    let corpus;
    const formRef = ref();
    const formState = reactive({
      query: "",
      augmentation: "",
      category: [],
      label: [],
    });

    const answer_list = reactive({ answer_list: [] });
    function editCorpus() {
      if (formRef.value.validate()) {
        let ansFlag = 1;
        for (let oneAns of answer_list.answer_list) {
          if (oneAns.text.content.length === 0) {
            message.warning("每一个回答至少有一个可展示的内容");
            ansFlag = 0;

            break;
          }
        }
        if (ansFlag === 1) {
          let answerList = answer_list.answer_list.map((item) => {
            item.text.show = item.text.show === true ? 1 : 0;
            item.audio.show = item.audio.show === true ? 1 : 0;
            item.image.show = item.image.show === true ? 1 : 0;
            return item;
          });
          let augmentation = [formState.augmentation.split("\n")];
          let category = formState.category===[]?null:formState.category[0];
          let params = {
            app_id: appId,
            docid: docid,
            document: {
              query: formState.query,
              category: { 0: category },
              label: formState.label,
              augmentation: augmentation,
              answer: answerList,
              answer_type: corpus.answer_type,
              flow_id: corpus.flow_id,
              update_time: getDateStr(),
              reply_type: radioValue.value,
              on_stage: corpus.on_stage,
              is_trained: corpus.is_trained,
            },
          };
          let url = path.website.updateCorpus;
          postData(url, params).then((res) => {
            if (res.explain.indexOf("success") !== -1) {
              context.emit("closeEditCorpus", false);
              context.emit("updateData", true);
              message.success("edit corpus successfully!");
            }
          });
        }
      }
    }

    const handleCategoryChange = (value) => {
      console.log(`selected ${value}`);
    };
    const handleLabelChange = (value) => {
      console.log(`selected ${value}`);
    };

    function plusOneAnswer() {
      let oneItem = {
        text: { content: "", show: true },
        audio: { content: "", show: true },
        image: { content: "", show: true },
        start_time: "",
        end_time: "",
      };
      answer_list.answer_list.push(oneItem);
    }

    function deleteOneAnswer(i) {
      answer_list.answer_list.splice(i, 1);
    }

    function getDateStr() {
      let n = new Date();
      return (
        n.toLocaleDateString().replace(/\//g, "-") +
        " " +
        n.toTimeString().substr(0, 8)
      );
    }

    function resetForm() {
      formState.query = "";
      formState.augmentation = "";
      formState.category = [];
      formState.label = [];
      vis.value = false;
      context.emit("closeEditCorpus", false);
    }

    // 上传图片
    const fileList = ref([]);
    const loading = ref(false);
    const imageUrl = ref("");
    let curImageIndex = 0;
    function getCurImage(i) {
      curImageIndex = i;
    }
    const handleChange = (info) => {
      if (info.file.status === "uploading") {
        loading.value = true;
        return;
      }

      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url) => {
          imageUrl.value = base64Url;
          answer_list.answer_list[curImageIndex].image.content = base64Url;
          loading.value = false;
        });
      }

      if (info.file.status === "error") {
        loading.value = false;
        message.error("upload error");
      }
    };

    const beforeUpload = (file) => {
      // const isJpgOrPng =
      //   file.type === "image/jpeg" || file.type === "image/png";

      // if (!isJpgOrPng) {
      //   message.error("You can only upload JPG file!");
      // }

      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isLt10M) {
        message.error("Image must smaller than 10MB!");
      }

      // return isJpgOrPng && isLt10M;
      return isLt10M;
    };

    let curDateIndex = 0;

    const onOk = (i) => {
      curDateIndex = i;
    };

    const onChange = (value, dateString) => {
      let i = curDateIndex;
      answer_list.answer_list[i].start_time = dateString[0];
      answer_list.answer_list[i].end_time = dateString[1];
    };

    const getCorpusDetail = () => {
      let url = path.website.getCorpus;
      let params = {
        app_id: appId,
        docid: docid,
      };
      getData(url, params).then((res) => {
        corpus = res.result;
        formState.query = corpus.query;
        formState.augmentation = corpus.augmentation.join("\n");
        if (corpus.category === "null") {
          formState.category = [];
          
        } else {
          formState.category = [corpus.category];
        }
        formState.label = corpus.label;
        radioValue.value = corpus.reply_type;
        answer_list.answer_list = corpus.answer.map((item) => {
          item.text.show = item.text.show === 1 ? true : false;
          item.audio.show = item.audio.show === 1 ? true : false;
          item.image.show = item.image.show === 1 ? true : false;
          return item;
        });
      });
    };

    let augPlace = `请输入扩展问题（一行一个）\n第一个扩展问题\n第二个扩展问题\n...`;
    return {
      vis,
      onClose,
      editCorpus,
      formRef,
      formState,
      resetForm,
      handleCategoryChange,
      handleLabelChange,
      augPlace,
      radioValue,
      answer_list,
      fileList,
      loading,
      imageUrl,
      handleChange,
      beforeUpload,
      plusOneAnswer,
      labelOptions,
      categoryOptions,
      deleteOneAnswer,
      onChange,
      onOk,
      getCurImage,
    };
  },
});
</script>
<style scoped>
.form {
  width: 600px;
  margin: 0 auto 90px;
}
.footer {
  z-index: 9999;
  position: absolute;
  background-color: white;
  bottom: 0;
  width: 610px;
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
.header-title {
  border-left: 4px rgb(49, 104, 224) solid;
  width: 100px;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 800;
}
</style>