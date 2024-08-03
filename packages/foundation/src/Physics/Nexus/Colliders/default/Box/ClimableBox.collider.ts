import { PhysicsDataTool } from "../../../Classes/PhysicsDataTool.js";
import { Collider } from "../../../Classes/Collider.js";

export class ClimableBoxCollider extends Collider {
  id = "#dve_climable_box";
  isSolid = false;
  flags = {
    ["#dve_climbable"]: 1,
  };

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
