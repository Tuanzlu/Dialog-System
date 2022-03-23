<template>
  <header-nav current="robot"></header-nav>

  <div class="container">
    <div class="dialog-window">
      <div class="main-window"></div>
      <div class="bottom">
        <a-input
          class="input"
          :model="inputValue"
          placeholder="请输入您想说的话"
        ></a-input>
        <a-button class="btn" type="primary" @click="inputMethod"
          >Enter</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import HeaderNav from "@/components/HeaderNav.vue";

export default {
  components: { HeaderNav },
  setup() {
    let inputValue = ref("");
    function inputMethod() {
      console.log(inputMethod);
    }

    return {
      inputValue,
      inputMethod,
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
}
.main-window {
  height: 400px;
  width: 650px;
  margin: 10px auto;
  border: 1px grey solid;
  border-radius: 10px;
}
.bottom {
  height: 35px;
  width: 650px;
  margin: 22px auto;
  display: flex;
}
.input {
  border-radius: 10px;
}
.btn {
  height: 35px;
  width: 60px;
  border-radius: 10px;
}
</style>
