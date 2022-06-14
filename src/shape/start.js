import { Shape } from "@antv/x6"
export default class StratNode extends Shape.Circle {

}
StratNode.config({
  width: 80,
  height: 80,
  zIndex: 100,
  markup: [
    {
      tagName: 'circle',
      selector: 'body'
    },{
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    label: {
      text: '开始对话',
      strokeWidth: 0.4,
      fontSize: 12,
    },
    body: {
      stroke: '#31d0c6',
      strokeWidth: 2,
    },
  },
  ports: {
    items: [
      { group: 'port_g', id: 'p_bottom' },
    ],
    groups: {
      port_g: {
        position: 'bottom',
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
    }
  },
})
