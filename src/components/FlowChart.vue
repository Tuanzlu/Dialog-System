<template>
  <div style="display: flex; flex-direction: column">
    <div style="margin-top: -40px; display: flex; justify-content: flex-end">
      <a-button type="primary" @click="handleSave">保存</a-button>
    </div>

    <div class="layout">
      <nodes-bar></nodes-bar>
      <div class="cavs" id="container"></div>
    </div>
  </div>

  <robot-word :visible="robotWordVis"></robot-word>
  <jump :visible="jumpVis"></jump>
  <info-collect :visible="infoCollectVis"></info-collect>
</template>

<script>
import Jump from "@/components/Jump.vue";
import RobotWord from "@/components/RobotWord";
import InfoCollect from "@/components/InfoCollect.vue";
import { useRoute } from "vue-router";

import {
  provide,
  ref,
  reactive,
  onMounted,
  watch,
  onUpdated,
  inject,
} from "vue";
import { Graph } from "@antv/x6";
import path from "@/api/path.js";
import { postData } from "@/api/webpost";
import NodesBar from "@/components/NodesBar.vue";
import registerNode from "@/shape/registerNode";
import cellHover from "@/composables/cellHover";
import cellSelect from "@/composables/cellSelect";
import connectEdge from "@/composables/connectEdge";
import blankEvent from "@/composables/blankEvent";
import { message } from "ant-design-vue";

import {
  EditOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
export default {
  components: {
    RobotWord,
    Jump,
    InfoCollect,
    EditOutlined,
    CloseCircleOutlined,
    PlusCircleOutlined,
    NodesBar,
  },
  props: {
    flowId: String,
    id: String,
  },
  setup(props, context) {
    let flowInfo = inject("flow_info");
    let flow_id = inject("flow_id");
    registerNode(Graph);
    const route = useRoute();

    let node_list = [];
    let edge_list = [];
    const graph = ref({});
    const curCell = ref({});
    let infoCollectVis = ref(false);
    let robotWordVis = ref(false);
    let jumpVis = ref(false);
    let appId = route.params.id;
    let tmp = reactive({tmp:[]});
    const init = () => {
      let test = [];
      for (let item of flowInfo.value.edge_list) {
        let edge = {
          shape: "edge",
          attrs: {
            line: {
              stroke: "#808080",
              strokeWidth: 1,
              strokeDasharray: "",
            },
          },
          id: Math.random().toString(),
          zIndex: -1,
          source: {
            cell: item.aendIndex,
            port: "p_bottom",
          },
          target: {
            cell: item.zendIndex,
            port: "p_top",
          },
        };
        test.push(edge);
      }

      test.push(
        {
          
           position: {
            x: 210,
            y: 50,
          },
          shape: 'start-node',
          id: '32f1b845-9232-4051-b742-8bbf1c7d23a1',
          zIndex: 1,
        }
      )
      for (let item of flowInfo.value.node_list) {
        let node = {
          position: {
            x: 210,
            y: 50,
          },
          shape: item.node_type,
          id: item.index,
          zIndex: 1,
        };
        if (item.node_type === "start_node") {
          continue;
        } else if (item.node_type === "slot_node") {
          node.shape = "info-node";
          node.position.x += Math.floor(Math.random() * 450 + 1);
          node.position.y += Math.floor(Math.random() * 450 + 1);
        } else if (item.node_type === "intent_node") {
          node.shape = "robot-node";

          node.position.x += Math.floor(Math.random() * 450 + 1);
          node.position.y += Math.floor(Math.random() * 450 + 1);
        } else if (item.node_type === "end_node") {
          node.shape = "jump-node";

          node.position.x += Math.floor(Math.random() * 450 + 1);
          node.position.y += Math.floor(Math.random() * 450 + 1);
        }

        test.push(node);
      }

      graph.value = new Graph({
        container: document.getElementById("container"),
        width: "100%",
        height: "100%",
        selecting: true, // 点选/框选，默认禁用。
        snapline: true,
        grid: {
          size: 10, // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        highlighting: {
          // 当链接桩可以被链接时，在链接桩外围渲染一个 2px 宽的红色矩形框
          magnetAvailable: {
            name: "stroke",
            args: {
              padding: 4,
              attrs: {
                "stroke-width": 4,
                stroke: "skyblue",
              },
            },
          },
          magnetAdsorbed: {
            name: "stroke",
            args: {
              padding: 4,
              attrs: {
                "stroke-width": 8,
                stroke: "skyblue",
              },
            },
          },
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          sourceAnchor: {
            name: "center",
          },
          targetAnchor: "center",
          connectionPoint: "anchor",
          // connector: 'smooth',
          router: "manhattan",
          validateMagnet({ magnet }) {
            return magnet.getAttribute("port-group") !== "in";
          },
          createEdge() {
            return this.createEdge({
              zIndex: -1,
              attrs: {
                line: {
                  strokeDasharray: "5 5",
                  stroke: "#808080",
                  strokeWidth: 1,
                  targetMarker: {
                    name: "block",
                    args: {
                      size: "6",
                    },
                  },
                },
              },
            });
          },
          validateConnection({ targetView, sourceMagnet, targetMagnet }) {
            // 只能从输出链接桩创建连接
            if (
              !sourceMagnet ||
              sourceMagnet.getAttribute("port-group") === "in"
            ) {
              return false;
            }

            // 只能连接到输入链接桩
            if (
              !targetMagnet ||
              targetMagnet.getAttribute("port-group") !== "in"
            ) {
              return false;
            }
            if (!sourceMagnet || !targetMagnet) {
              return false;
            }

            // 判断目标链接桩是否可连接
            const portId = targetMagnet.getAttribute("port");
            const node = targetView.cell;
            const port = node.getPort(portId);
            if (!port) {
              return false;
            }

            return true;
          },
        },
      });

      console.log("test", test);
      tmp.tmp = reactive(test);
      
      console.log("tmp", tmp.tmp);

      graph.value.fromJSON(tmp.tmp);
      // cellEvents(graph);
      cellHover(graph);
      cellSelect(graph, curCell);
      connectEdge(graph);
      blankEvent(graph, curCell);
    };

    function addOneEdge(item) {
      console.log("edge", item);
      let edge = {
        aendType: "start_node",
        aendIndex: item.source.cell,
        zendIndex: item.target.cell,
      };
      edge_list.push(edge);
    }

    function addStartNode(item) {
      console.log("start-node", item);
      let node = { index: item.id, node_type: "start_node" };
      node_list.push(node);
    }

    function addJumpNode(item) {
      console.log("jump-node", item);
      let node = {
        index: item.id,
        node_type: "end_node",
        // text: { content: "本次对话先到这里，谢谢！", show: 1 },
        // audio: { content: "本次对话先到这里，谢谢！", show: 1 },
        end_type: "end",
        flow_id: flow_id.value,
      };
      node_list.push(node);
    }

    function addInfoNode(item) {
      console.log("info-node", item);
      let node = {
        index: item.id,
        node_type: "slot_node",
        // text: { content: "请问您想要什么房间？", show: 1 },
        // audio: { content: "请问您想要什么房间？", show: 1 },
        slots: [
          // { slot_id: "", ask_query: "再说一次您的房型吧？", ask_counter: 2 },
        ],
      };
      node_list.push(node);
    }

    function addRobotNode(item) {
      console.log("robot-node", item);
      let node = {
        index: item.id,
        node_type: "intent_node",
        // text: { content: "请问您想办理什么业务", show: 1 },
        // audio: { content: "请问您想办理什么业务", show: 1 },
        intents: [{ intent_id: "__default" }],
      };

      node_list.push(node);
    }

    function handleSave() {
      let struct = graph.value.toJSON();
      console.log(struct);
      node_list = [];
      edge_list = [];
      new Promise((resolve, reject) => {
        for (let item of struct.cells) {
          if (item.shape === "edge") {
            addOneEdge(item);
          } else if (item.shape === "start-node") {
            addStartNode(item);
          } else if (item.shape === "jump-node") {
            addJumpNode(item);
          } else if (item.shape === "info-node") {
            addInfoNode(item);
          } else if (item.shape === "robot-node") {
            addRobotNode(item);
          }
        }
        console.log("nodeList", node_list);
        console.log("edgeList", edge_list);
        resolve();
      }).then(() => {
        updateFlow();
      });
    }
 function getDateStr() {
      let n = new Date();
      return (
        n.toLocaleDateString().replace(/\//g, "-") +
        " " +
        n.toTimeString().substr(0, 8)
      );
    }
    function updateFlow() {
      let url = path.website.updateFlow;
      let params = {
        app_id: appId,
        flow_name: flowInfo.value.flow_name,
        trigger_type: flowInfo.value.trigger_type,
        flow_id: flow_id.value,
        node_list: node_list,
        edge_list: edge_list,
        on_stage: flowInfo.value.on_stage,
        create_time:flowInfo.value.create_time,
        update_time: getDateStr()
      };
      console.log("params", params);
      postData(url, params).then((res) => {
        console.log(res);
        if (res.explain.indexOf("success") !== -1) {
          message.success("update successfully!");
        } else {
          message.error(res.explain);
        }
      });
    }

    onMounted(init);
    provide("graph", graph);
    provide("infoCollectVis", infoCollectVis);
    provide("robotWordVis", robotWordVis);
    provide("jumpVis", jumpVis);
    provide("tmp",tmp);
    watch(curCell, () => {
      console.log("curCell", curCell.value);
      if (curCell.value !== null) {
        if (curCell.value.attrs.label.text === "开始对话") {
          console.log("start");
        } else if (curCell.value.attrs.label.text === "信息收集") {
          infoCollectVis.value = true;
        } else if (curCell.value.attrs.label.text === "机器人说") {
          robotWordVis.value = true;
        } else if (curCell.value.attrs.label.text === "跳转") {
          jumpVis.value = true;
        }
      }
    });

    return {
      handleSave,
      robotWordVis,
      jumpVis,
      infoCollectVis,
    };
  },
};
</script>

<style scoped>
.layout {
  display: flex;
  box-sizing: border-box;
  width: 950px;
  height: 100vh;
  padding: 10px 0;
}
.cavs {
  width: 100%;
  height: 100%;
  border: 1px solid #000;
}
</style>