import { BoundingBox } from "./BoundingBox.js";
import { CollisionNode } from "./CollisionNode.js";
import { Vector3Like } from "@amodx/math";

export abstract class Collider {
  static createBBox(
    width: number = 1,
    height: number = width,
    depth: number = width
  ) {
    const bbox = new BoundingBox(width, height, depth);
    bbox.setPositionVec3(Vector3Like.Create());
    return bbox;
  }
  nodes: CollisionNode[] = [];
  abstract id: string;
  abstract isSolid: boolean;
  abstract flags: Record<string, number>;

  addNode(name: string, boundingBox: BoundingBox) {
    this.nodes.push(new CollisionNode(name, boundingBox));
  }

  abstract getNodes(dataTool: Vector3Like): CollisionNode[];

  hasFlag(id: string) {
    return this.flags[id] !== undefined;
  }
}
