import { PhysicsDataTool } from "../../../Classes/PhysicsDataTool.js";
import { Collider } from "../../../Classes/Collider.js";

export class StairCollider extends Collider {
  id = "#dve_stair";
  isSolid = true;
  flags = {};

  constructor() {
    super();
    this.addNode("stair-bottom", Collider.createBBox(1, 0.5, 1));
    this.addNode("stair-top", Collider.createBBox(1, 0.5, 0.5));
  }
  getNodes(dataTool: PhysicsDataTool) {
    this.nodes[0].position.x = dataTool.x;
    this.nodes[0].position.y = dataTool.y;
    this.nodes[0].position.z = dataTool.z;
    this.nodes[0].position.x = dataTool.x;
    this.nodes[1].position.y = dataTool.y + 0.5;
    this.nodes[0].position.z = dataTool.z;
    return this.nodes;
  }
}