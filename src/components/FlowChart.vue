<template>
  <div class="layout">
    <nodes-bar></nodes-bar>
    <div class="cavs" id="container"></div>
  </div>

  <robot-word :visible="robotWordVis"></robot-word>
  <jump :visible="jumpVis"></jump>
  <info-collect :visible="infoCollectVis"></info-collect>
</template>

<script>
import Jump from "@/components/Jump.vue";
import RobotWord from "@/components/RobotWord";
import InfoCollect from "@/components/InfoCollect.vue";
import { provide, ref, reactive, onMounted, watch, inject } from "vue";
import { Graph } from "@antv/x6";
import NodesBar from "@/components/NodesBar.vue";
import registerNode from "@/shape/registerNode";
import cellHover from "@/composables/cellHover";
import cellSelect from "@/composables/cellSelect";
import connectEdge from "@/composables/connectEdge";
import blankEvent from "@/composables/blankEvent";
import { getCurrentInstance } from "vue";
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

  setup() {
    registerNode(Graph);
    const graph = ref({});
    const curCell = ref({});
    let infoCollectVis = ref(false);
    let robotWordVis = ref(false);
    let jumpVis = ref(false);
    // console.log(node);
    const test = reactive([
      {
        position: {
          x: 210,
          y: 50,
        },
        shape: "start-node",
        id: "32f1b845-9232-4051-b742-8bbf1c7d23a1",
        zIndex: 1,
      },
    ]);
    const init = () => {
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
            // if (!sourceMagnet || sourceMagnet.getAttribute('port-group') === 'in') {
            //   return false;
            // }

            // // 只能连接到输入链接桩
            // if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'in') {
            //   return false;
            // }
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
      graph.value.fromJSON(test);
      // cellEvents(graph);
      cellHover(graph);
      cellSelect(graph, curCell);
      connectEdge(graph);
      blankEvent(graph, curCell);
    };

    onMounted(init);
    provide("graph", graph);
    provide("infoCollectVis", infoCollectVis);
    provide("robotWordVis", robotWordVis);
    provide("jumpVis", jumpVis);
    watch(curCell, () => {
      console.log("selectedKeys", curCell.value);
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
  width: 100%;
  height: 100vh;
  padding: 10px;
}
.cavs {
  width: 100%;
  height: 100%;
  border: 1px solid #000;
}
</style>