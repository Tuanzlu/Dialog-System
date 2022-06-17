import {
  Shape
} from "@antv/x6"
export default class InfoNode extends Shape.Rect {

}
InfoNode.config({
  width: 260,
  height: 110,
  zIndex: 100,
  markup: [{
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    label: {
      text: '信息收集',
      strokeWidth: 4,
      refY: 25,
      fontSize: 16,
    },
    body: {
      stroke: "#31d0c6",
      strokeWidth: 1,
    },
  },
  ports: {
    items: [{
        group: 'in',
        id: 'p_top'
      },
      {
        group: 'port_g',
        id: 'p_bottom_right',
        label: {
          position: {
            name: "inside"
          }
        },
        attrs: {
          text: {
            text: '成功'
          },
        },
      },
      {
        group: 'port_g',
        id: 'p_bottom_left',
        label: {
          position: {
            name: "inside"
          }
        },
        attrs: {
          text: {
            text: '失败'
          },
        },
      },
    ],
    groups: {
      in: {
        position: 'top',
        zIndex: 1,
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff'
          }
        }
      },
      port_g: {
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff'
          }
        },
        position: 'bottom'
      }
    }
  },
})