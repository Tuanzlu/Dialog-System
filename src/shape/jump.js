
import { Shape } from "@antv/x6"
export default class JumpNode extends Shape.Rect {

}
JumpNode.config({
  width: 260,
  height: 80,
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
      text: '跳转',
      strokeWidth: 4,
      fontSize: 16,
      refY: 25
    },
    body: {
      stroke: "#31d0c6",
      strokeWidth: 1,
    },
  },
  ports: {
    items: [
      { group: 'in', id: 'p_top' }
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
      }
    }
  },
})

