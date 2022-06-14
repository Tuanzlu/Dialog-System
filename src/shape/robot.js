import { Shape } from "@antv/x6"
export default class RobotNode extends Shape.Rect {
  nodeName = '';
}
RobotNode.config({
  width: 680,
  height: 110,
  zIndex: 100,
  ports: {
    items: [
      { group: 'in', id: 'p_top' },
      { group: 'port_g', id: 'p_bottom' },
    ],
    groups: {
      in: {
        position: 'top',
        zIndex: 20,
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
        position: 'bottom',
        zIndex: 20,
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
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    }
  ],
  attrs: {
    label: {
      text: '机器人说',
      strokeWidth: 0.4,
      fontSize: 12
    },
    body: {
      stroke: "#31d0c6",
      strokeWidth: 1,
    },
  },
})
