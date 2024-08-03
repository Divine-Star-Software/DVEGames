import { PhysicsDataTool } from "../../../Classes/PhysicsDataTool.js";
import { Collider } from "../../../Classes/Collider.js";

export class BoxCollider extends Collider {
  id = "#dve_box";
  isSolid = true;
  flags = {};

  constructor() {
    super();
    this.addNode("main", Collider.createBBox());
  }
  getNodes(dataTool: PhysicsDataTool) {
    this.nodes[0].position.x = dataTool.x;
    this.nodes[0].position.y = dataTool.y;
    this.nodes[0].position.z = dataTool.z;
    return this.nodes;
  }
}
