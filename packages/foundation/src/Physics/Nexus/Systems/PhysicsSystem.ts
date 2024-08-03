import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
import { BoxColliderComponent } from "../../Main/Components/BoxCollider.component";
import { PhysicsBodyComponent } from "../../Main/Components/PhysicsBody.component";
import { CollisionResult } from "../Classes/CollisionResult";
import { Line } from "../Classes/Line";
import { Plane } from "../Classes/Plane";
import { BoundingBox } from "../Classes/BoundingBox";
import { CollisionNode } from "../Classes/CollisionNode";
import { PhysicsDataTool } from "../Classes/PhysicsDataTool";

const previousPosiiton = Vector3Like.Create();

const COLLISION_CHECK_POSITION_OFFSET = 0.001;
const aabb = {
  start: Vector3Like.Create(),
  delta: Vector3Like.Create(),
  results: new CollisionResult(),
  line: new Line(),
  plane: new Plane(),
  dimensions: Vector3Like.Create(),
};

const boundingBox = new BoundingBox();
const between = (x: number, a: number, b: number) => {
  return x >= a && x <= b;
};

const Vectors = {
  Zero: Vector3Like.Create(),
  Up: Vector3Like.Create(0, 1, 0),
  Down: Vector3Like.Create(0, -1, 0),
  West: Vector3Like.Create(-1, 0, 0),
  East: Vector3Like.Create(1, 0, 0),
  North: Vector3Like.Create(0, 0, 1),
  South: Vector3Like.Create(0, 0, -1),
};

/** # sweepAABBN
 * Calculates the collision for physics node against a bounding box.
 * @param physicsNodePosition
 * @param boundingBox
 * @param collisionNode
 * @param delta Delata aka velocity of the physics object
 * @returns
 */
const sweepAABBN = (
  physicsNodePosition: Vector3Like,
  boundingBox: BoundingBox,
  collisionNode: CollisionNode,
  delta: Vector3Like
) => {
  let mx, my, mz, mhx, mhy, mhz;

  mx = collisionNode.position.x - (physicsNodePosition.x + boundingBox.width);
  my = collisionNode.position.y - (physicsNodePosition.y + boundingBox.height);
  mz = collisionNode.position.z - (physicsNodePosition.z + boundingBox.depth);
  mhx = boundingBox.width + collisionNode.boundingBox.width;
  mhy = boundingBox.height + collisionNode.boundingBox.height;
  mhz = boundingBox.depth + collisionNode.boundingBox.depth;

  collisionNode.results.reset();
  let hitDepth;
  const data = collisionNode.results.raw;

  aabb.line.update(Vectors.Zero, delta);
  aabb.dimensions.x = mx;
  aabb.dimensions.y = my;
  aabb.dimensions.z = mz;

  hitDepth = aabb.plane
    .update(aabb.dimensions, Vectors.West)
    .lineToPlane(aabb.line);
  // X min
  if (
    hitDepth >= 0 &&
    delta.x > 0 &&
    hitDepth < data.hitDepth &&
    between(hitDepth * delta.y, my, my + mhy) &&
    between(hitDepth * delta.z, mz, mz + mhz)
  ) {
    collisionNode.results.update(hitDepth, -1, 0, 0);
  }

  aabb.dimensions.x = mx + mhx;
  aabb.dimensions.y = my;
  aabb.dimensions.z = mz;
  hitDepth = aabb.plane
    .update(aabb.dimensions, Vectors.East)
    .lineToPlane(aabb.line);
  // X max
  if (
    hitDepth >= 0 &&
    delta.x < 0 &&
    hitDepth < data.hitDepth &&
    between(hitDepth * delta.y, my, my + mhy) &&
    between(hitDepth * delta.z, mz, mz + mhz)
  ) {
    collisionNode.results.update(hitDepth, 1, 0, 0);
  }
  aabb.dimensions.x = mx;
  aabb.dimensions.y = my;
  aabb.dimensions.z = mz;
  // Y min
  hitDepth = aabb.plane
    .update(aabb.dimensions, Vectors.Down)
    .lineToPlane(aabb.line);
  if (
    hitDepth >= 0 &&
    delta.y > 0 &&
    hitDepth < data.hitDepth &&
    between(hitDepth * delta.x, mx, mx + mhx) &&
    between(hitDepth * delta.z, mz, mz + mhz)
  ) {
    collisionNode.results.update(hitDepth, 0, -1, 0);
  }

  aabb.dimensions.x = mx;
  aabb.dimensions.y = my + mhy;
  aabb.dimensions.z = mz;
  // Y max
  hitDepth = aabb.plane
    .update(aabb.dimensions, Vectors.Up)
    .lineToPlane(aabb.line);
  if (
    hitDepth >= 0 &&
    delta.y < 0 &&
    hitDepth < data.hitDepth &&
    between(hitDepth * delta.x, mx, mx + mhx) &&
    between(hitDepth * delta.z, mz, mz + mhz)
  ) {
    collisionNode.results.update(hitDepth, 0, 1, 0);
  }

  aabb.dimensions.x = mx;
  aabb.dimensions.y = my;
  aabb.dimensions.z = mz;
  // Z min
  hitDepth = aabb.plane
    .update(aabb.dimensions, Vectors.South)
    .lineToPlane(aabb.line);
  if (
    hitDepth >= 0 &&
    delta.z > 0 &&
    hitDepth < data.hitDepth &&
    between(hitDepth * delta.x, mx, mx + mhx) &&
    between(hitDepth * delta.y, my, my + mhy)
  ) {
    collisionNode.results.update(hitDepth, 0, 0, -1);
  }
  aabb.dimensions.x = mx;
  aabb.dimensions.y = my;
  aabb.dimensions.z = mz + mhz;
  // Z max
  hitDepth = aabb.plane
    .update(aabb.dimensions, Vectors.South)
    .lineToPlane(aabb.line);
  if (
    hitDepth >= 0 &&
    delta.z < 0 &&
    hitDepth < data.hitDepth &&
    between(hitDepth * delta.x, mx, mx + mhx) &&
    between(hitDepth * delta.y, my, my + mhy)
  ) {
    collisionNode.results.update(hitDepth, 0, 0, 1);
  }

  //  node.results.update(h, nx, ny, nz);
  return collisionNode.results.raw;
};

let dataTool: PhysicsDataTool;

export const PhysicsSystems = NCS.registerSystem({
  type: "physics",
  queries: [
    NCS.createQuery({
      inclueComponents: [PhysicsBodyComponent],
    }),
  ],

  update(system) {
    console.log("update physics system", system.queries[0].nodes.size);
    if (!dataTool) dataTool = new PhysicsDataTool();
    for (const node of system.queries[0].nodes) {
      const transform = TransformComponent.get(node)!.schema;
      const body = PhysicsBodyComponent.get(node)!.schema;
      const collider = BoxColliderComponent.get(node)!;
      boundingBox.update(
        collider.schema.size.x,
        collider.schema.size.y,
        collider.schema.size.z
      );
      console.log(transform.position.x,transform.position.y,transform.position.z)
      const bboxHalfWidth = boundingBox.halfWidth;
      const bboxHalfDepth = boundingBox.halfDepth;
      const bboxHalfHeight = boundingBox.halfHeight;

      //store previous position

      Vector3Like.Copy(previousPosiiton, transform.position);
      //apply foroces

      transform.position.x =
        transform.position.x + body.acceleration.x * body.velocity.x;
      transform.position.y =
        transform.position.y + body.acceleration.y * body.velocity.y;
      transform.position.z =
        transform.position.z + body.acceleration.z * body.velocity.z;

      //do swept

      //Notice there is a cycle. We may have to run the algorithm several times until the collision is resolved
      while (true) {
        // First we calculate the movement vector for this frame
        // This is the entity's current position minus its last position.
        // The last position is set at the beggining of each frame.

        aabb.delta.x = transform.position.x - previousPosiiton.x;
        aabb.delta.y = transform.position.y - previousPosiiton.y;
        aabb.delta.z = transform.position.z - previousPosiiton.z;

        // These are the bounds of the AABB that may collide with the entity.
        const minX = Math.floor(
          Math.min(transform.position.x, previousPosiiton.x) - bboxHalfWidth
        );
        const maxX = Math.floor(
          Math.max(transform.position.x, previousPosiiton.x) + bboxHalfWidth
        );
        const minY = Math.floor(
          Math.min(transform.position.y, previousPosiiton.y) - bboxHalfHeight
        );
        const maxY = Math.floor(
          Math.max(transform.position.y, previousPosiiton.y) + bboxHalfHeight
        );
        const minZ = Math.floor(
          Math.min(transform.position.z, previousPosiiton.z) - bboxHalfDepth
        );
        const maxZ = Math.floor(
          Math.max(transform.position.z, previousPosiiton.z) + bboxHalfDepth
        );

        aabb.results.reset();
        let collisionResults = aabb.results.raw;

        // For each voxel that may collide with the entity, find the first that colides with it
        for (let y = minY; y <= maxY; y++) {
          for (let z = minZ; z <= maxZ; z++) {
            for (let x = minX; x <= maxX; x++) {
              if (!dataTool.loadInAt(x, y, z)) continue;
              const collider = dataTool.getColliderObj();

              if (!collider) continue;

              const nodes = collider.getNodes(dataTool);
              const collidersLength = nodes.length;
              for (let i = 0; i < collidersLength; i++) {
                const colliderNode = nodes[i];
                // Check swept collision

                aabb.start.x = previousPosiiton.x - bboxHalfWidth;
                aabb.start.y = previousPosiiton.y - bboxHalfHeight;
                aabb.start.z = previousPosiiton.z - bboxHalfDepth;

                const collisionCheck = sweepAABBN(
                  aabb.start,
                  boundingBox,
                  colliderNode,
                  aabb.delta
                );

                if (collisionCheck.hitDepth < 1) {
                  //  node.doCollision(collider, colliderNode, node.dataTool);
                }
                //If the voxel will not stop the entity continue
                if (!dataTool.isSolid() || !collider.isSolid) continue;
                //Check if this collision is closer than the closest so far.
                if (collisionCheck.hitDepth < collisionResults.hitDepth) {
                  aabb.results.loadIn(colliderNode.results);
                }
              }
            }
          }
        }

        // Update the entity's position
        // We move the entity slightly away from the block in order to miss seams.

        transform.position.x =
          previousPosiiton.x +
          collisionResults.hitDepth * aabb.delta.x +
          COLLISION_CHECK_POSITION_OFFSET * collisionResults.nx;
        transform.position.y =
          previousPosiiton.y +
          collisionResults.hitDepth * aabb.delta.y +
          COLLISION_CHECK_POSITION_OFFSET * collisionResults.ny;
        transform.position.z =
          previousPosiiton.z +
          collisionResults.hitDepth * aabb.delta.z +
          COLLISION_CHECK_POSITION_OFFSET * collisionResults.nz;

        // If there was no collision, end the algorithm.
        if (collisionResults.hitDepth == 1) break;

        // Wall Sliding
        // c = a - (a.b)/(b.b) b
        // c - slide vector (rejection of a over b)
        // b - normal to the block
        // a - remaining speed (= (1-h)*speed)
        const BdotB =
          collisionResults.nx * collisionResults.nx +
          collisionResults.ny * collisionResults.ny +
          collisionResults.nz * collisionResults.nz;
        if (BdotB != 0) {
          // Store the current position for the next iteration

          Vector3Like.Copy(previousPosiiton, transform.position);
          // Apply Slide
          const AdotB =
            (1 - collisionResults.hitDepth) *
            (aabb.delta.x * collisionResults.nx +
              aabb.delta.y * collisionResults.ny +
              aabb.delta.z * collisionResults.nz);
          transform.position.x +=
            (1 - collisionResults.hitDepth) * aabb.delta.x -
            (AdotB / BdotB) * collisionResults.nx;
          transform.position.y +=
            (1 - collisionResults.hitDepth) * aabb.delta.y -
            (AdotB / BdotB) * collisionResults.ny;
          transform.position.z +=
            (1 - collisionResults.hitDepth) * aabb.delta.z -
            (AdotB / BdotB) * collisionResults.nz;
        }
      }
    }
  },
});
