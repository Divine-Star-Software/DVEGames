
import { DataTool } from "@divinevoxel/vlox/Tools/Data/DataTool";
import { ColliderManager } from "../Colliders/ColliderManager";

export class PhysicsDataTool extends DataTool {
  getColliderObj() {
    if (!this.checkCollisions()) return false;
    let collider = this.getCollider();
    return ColliderManager.getCollider(collider ? collider : "Box");
  }
  isSolid() {
    return !this.isAir() && this.getSubstanceStringId() != "dve_liquid";
  }
}
