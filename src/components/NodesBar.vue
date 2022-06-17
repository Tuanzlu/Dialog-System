<template>
  <div class="nodes-bar">
    <div class="lli">
      <div class="node" data-type="robot-node" @mousedown="startDrag">
        机器人说
      </div>
    </div>
    <div class="lli">
      <div class="node" data-type="info-node" @mousedown="startDrag">
        信息收集
      </div>
    </div>
    <div class="lli">
      <div class="node" data-type="jump-node" @mousedown="startDrag">
        跳转
      </div>
    </div>
  </div>
</template>
<script>
import { inject, ref, watch } from "vue";
import { Addon } from "@antv/x6";

export default {
  setup() {
    const { Dnd } = Addon;

    const graph = inject("graph");
    const dnd = ref({});
    const startDrag = (e) => {
      const target = e.currentTarget;
      const type = target.getAttribute("data-type");
      let node;
      if (type === "jump-node") {
        node = graph.value.createNode({
          shape: "jump-node",
        });
      }
      if (type === "robot-node") {
        node = graph.value.createNode({
          shape: "robot-node",
        });
      }
      node = graph.value.createNode({ shape: type });
      dnd.value.start(node, e);
    };
    const initDnd = () => {
      dnd.value = new Dnd({
        target: graph.value,
        validateNode() {
          return true;
        },
      });
    };

    watch(graph, (val) => {
      console.log(val);
      initDnd();
    });

    return {
      startDrag
    }
  },
};
</script>
<style lang="scss">
.nodes-bar {
  width: 160px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.lli {
  text-align: center;
  color: #666;
  font-size: 14px;
  width: 100px;
  height: 40px;
  border: 2px solid #31d0c6;
  text-align: center;
  line-height: 40px;
  margin: 16px;
  cursor: move;
}
.node {
  width: 100%;
  height: 40px;
  text-align: center;
}

</style>
