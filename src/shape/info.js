import { Shape } from "@antv/x6"
export default class InfoNode extends Shape.Rect {

}
InfoNode.config({
  width: 260,
  height: 110,
  zIndex: 100,
  markup: [
    {
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
      strokeWidth: 0.4,
      fontSize: 12,
    },
    body: {
      stroke: "#31d0c6",
      strokeWidth: 1,
    },
  },
  ports: {
    items: [
      { group: 'port_g', id: 'p_top' },
      { group: 'port_g', id: 'p_bottom_right' },
      { group: 'port_g', id: 'p_bottom_left' },
    ],
    groups: {
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
        position: 'ellipseSpread'
      }
    }
  },
})
