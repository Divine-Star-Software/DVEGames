import { Vector3 } from "@divinevoxel/core/Math/Classes/Vector3.js";
import { BoundingBox } from "./BoundingBox";
import { CollisionResult } from "./CollisionResult.js";
import { Vector3Like } from "@amodx/math";

export class CollisionNode {
  results = new CollisionResult();
  position = Vector3Like.Create();

  constructor(public name: string, public boundingBox: BoundingBox) {}
}