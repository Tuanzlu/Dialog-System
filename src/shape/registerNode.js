
import JumpNode from "./jump"
import StartNode from "./start"
import InfoNode from "./info"
import RobotNode from "./robot"
import ShuntNode from "./shunt"

export default (Graph) => {
  Graph.registerNode('general-node', JumpNode, true)
  Graph.registerNode('start-node', StartNode, true)
  Graph.registerNode('end-node', InfoNode, true)
  Graph.registerNode('special-node', RobotNode, true)
  Graph.registerNode('shunt-node', ShuntNode, true)
}
