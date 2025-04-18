import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../../Transform.component";
import { BoxColliderComponent } from "../../BoxCollider.component";
import { PhysicsBodyComponent } from "../../PhysicsBody.component";
import { CollisionResult } from "../Classes/CollisionResult";
import { Line } from "../Classes/Line";
import { Plane } from "../Classes/Plane";
import { BoundingBox } from "../Classes/BoundingBox";
import { CollisionNode } from "../Classes/CollisionNode";
import { PhysicsColliderStateComponent } from "../../PhysicsColliderState.component";
import { WorldCursor } from "@divinevoxel/vlox/World/Cursor/WorldCursor";
import { ColliderManager } from "../Colliders/ColliderManager";

const position = Vector3Like.Create();
const delta = Vector3Like.Create();
const start = Vector3Like.Create();
const previousPosiiton = Vector3Like.Create();

const COLLISION_CHECK_POSITION_OFFSET = 0.001;
const aabb = {
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

let dataTool: WorldCursor;

const acceleration = Vector3Like.Create();
const frictionForce = Vector3Like.Create();
const GRAVITY = -9.81;
const TERMINAL_VELOCITY = -20; // Cap falling speed

function applyTransform(
  position: Vector3Like,
  body: (typeof PhysicsBodyComponent)["default"]["schema"],
  state: (typeof PhysicsColliderStateComponent)["default"]["schema"],
  deltaTime: number
): void {
  const accelerationRate = 10;
  const jumpStrength = 10;
  const maxJumpTime = 0.15;
  const maxSwimJumpTime = 0.3;
  const gravityStrength = -30;
  const waterGravityStrength = -4; // Reduced gravity underwater
  const waterJumpBoost = 20; // Controlled swimming force
  const maxSwimUpSpeed = 3; // Limit how fast player can rise
  const waterDrag = 0.6; // Slower movement in water
  const friction = 0.8;
  const sinkingForce = -1; // Slight downward force if not swimming up

  const isOnGround = state.isGrounded;
  const isSwimming = state.isInLiquid;

  // Horizontal movement smoothing
  body.velocity.x +=
    (body.targetVelocity.x - body.velocity.x) * accelerationRate * deltaTime;
  body.velocity.z +=
    (body.targetVelocity.z - body.velocity.z) * accelerationRate * deltaTime;

  body.velocity.x *= isSwimming ? waterDrag : friction;
  body.velocity.z *= isSwimming ? waterDrag : friction;

  // Swimming Mechanics
  if (isSwimming) {
    // Passive water gravity (keeps player from floating indefinitely)
    body.velocity.y += waterGravityStrength * deltaTime;


    // Cap rising speed
   

    if (state.wantsToJump && state.jumpTime < maxSwimJumpTime) {
      body.velocity.y += waterJumpBoost  * deltaTime;
      state.jumpTime += deltaTime;
    } else {
      body.velocity.y += sinkingForce * deltaTime;
    }
    if (state.jumpTime > maxSwimJumpTime) {
      state.wantsToJump = 0;
      state.jumpTime = 0;
    }


    // Extra damping to prevent bouncing too much
    if (Math.abs(body.velocity.y) > 0.5) {
      body.velocity.y *= 0.95;
    }
  } else {
    // Regular jumping
    if (state.wantsToJump && (isOnGround || isSwimming)) {
      body.velocity.y = jumpStrength;
      state.jumpTime = 0;
    }

    if (state.wantsToJump && state.jumpTime < maxJumpTime) {
      body.velocity.y += jumpStrength * 0.3 * deltaTime;
      state.jumpTime += deltaTime;
    }

    if (state.jumpTime > maxJumpTime) {
      state.wantsToJump = 0;
      state.jumpTime = 0;
    }

    // Apply normal gravity
    if (!isOnGround) {
      body.velocity.y += gravityStrength * body.gravityScale * deltaTime;
    } else {
      if (state.jumpTime == 0) body.velocity.y = 0;
    }

    if (body.velocity.y > 0 && !state.wantsToJump) {
      body.velocity.y *= 0.9;
    }
  }

  // Apply position update
  position.x += body.velocity.x * deltaTime;
  position.y += body.velocity.y * deltaTime;
  position.z += body.velocity.z * deltaTime;
}
const deltaTime = 0.016;
const voxelPositon = Vector3Like.Create();
const downPosition = Vector3Like.Create();
export const PhysicsSystems = NCS.registerSystem({
  type: "physics",
  queries: [
    NCS.createQuery({
      inclueComponents: [PhysicsBodyComponent],
    }),
  ],

  update(system) {
    if (!dataTool) dataTool = new WorldCursor();
    const node = system.node;

    for (let q = 0; q < system.queries.length; q++) {
      const query = system.queries[q];

      for (let i = 0; i < query.nodes.length; i++) {
        node.setNode(system.graph, query.nodes[i]);

        /*  const dimension =
          DimensionProviderComponent.getRequired(node).schema.dimension; */

        const transform = TransformComponent.getRequired(node).schema;
        let previousVelocityY = transform.position.y; // Store previous Y velocity

        // Store original position
        Vector3Like.Copy(position, transform.position);
        Vector3Like.Copy(previousPosiiton, transform.position);

        dataTool.setFocalPoint(
          0,
          position.x >> 0,
          position.y >> 0,
          position.z >> 0
        );

        const body = PhysicsBodyComponent.getRequired(node)!.schema;

        const collider = BoxColliderComponent.getRequired(node)!;
        const colliderState =
          PhysicsColliderStateComponent.getRequired(node)!.schema;

        boundingBox.update(
          collider.schema.size.x,
          collider.schema.size.y,
          collider.schema.size.z
        );

        const bboxHalfWidth = boundingBox.halfWidth;
        const bboxHalfDepth = boundingBox.halfDepth;
        const bboxHalfHeight = boundingBox.halfHeight;

        Vector3Like.Copy(downPosition, position);
        downPosition.y -= 0.1;
        boundingBox.setPositionVec3(downPosition);

        let isGrounded = false;
        let isInLiquid = false;

        const { minX, minY, minZ, maxX, maxY, maxZ } = boundingBox.bounds;

        for (let z = Math.floor(minZ); z <= Math.ceil(maxZ); z++) {
          for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
            voxelPositon.x = x;
            voxelPositon.y = Math.floor(minY);
            voxelPositon.z = z;
            const voxel = dataTool.getVoxel(
              voxelPositon.x,
              voxelPositon.y,
              voxelPositon.z
            );

            if (!voxel) continue;

            const colliderId = voxel.getCollider();
            if (!colliderId) continue;
            const collider = ColliderManager.getCollider(colliderId);
            if (!collider) continue;
            if (
              !voxel.checkCollisions() ||
              !voxel.getSubstanceData()["dve_is_solid"] ||
              !collider.isSolid
            )
              continue;

            const nodes = collider.getNodes(voxelPositon);
            for (const colliderNode of nodes) {
              if (boundingBox.doesIntersect(colliderNode.boundingBox)) {
                isGrounded = true;
              }
            }
          }
        }
        colliderState.isGrounded = isGrounded ? 1 : 0;

        applyTransform(position, body, colliderState, deltaTime);
        // Collision detection and resolution loop
        while (true) {
          delta.x = position.x - previousPosiiton.x;
          delta.y = position.y - previousPosiiton.y;
          delta.z = position.z - previousPosiiton.z;

          const minX = Math.floor(
            Math.min(position.x, previousPosiiton.x) - bboxHalfWidth
          );
          const maxX = Math.floor(
            Math.max(position.x, previousPosiiton.x) + bboxHalfWidth
          );
          const minY = Math.floor(
            Math.min(position.y, previousPosiiton.y) - bboxHalfHeight
          );
          const maxY = Math.floor(
            Math.max(position.y, previousPosiiton.y) + bboxHalfHeight
          );
          const minZ = Math.floor(
            Math.min(position.z, previousPosiiton.z) - bboxHalfDepth
          );
          const maxZ = Math.floor(
            Math.max(position.z, previousPosiiton.z) + bboxHalfDepth
          );

          aabb.results.reset();
          let collisionResults = aabb.results.raw;

          for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
              for (let x = minX; x <= maxX; x++) {
                const voxel = dataTool.getVoxel(x, y, z);
                voxelPositon.x = x;
                voxelPositon.y = y;
                voxelPositon.z = z;

                if (!voxel) continue;
                if (
                  voxel.isRenderable() &&
                  voxel.getSubstanceData()["dve_is_liquid"]
                )
                  isInLiquid = true;

                const colliderId = voxel.getCollider();
                if (!colliderId) continue;
                const collider = ColliderManager.getCollider(colliderId);
                if (!collider) continue;

                const nodes = collider.getNodes(voxelPositon);
                for (const colliderNode of nodes) {
                  start.x = previousPosiiton.x - bboxHalfWidth;
                  start.y = previousPosiiton.y - bboxHalfHeight;
                  start.z = previousPosiiton.z - bboxHalfDepth;

                  const collisionCheck = sweepAABBN(
                    start,
                    boundingBox,
                    colliderNode,
                    delta
                  );

                  if (
                    !voxel.checkCollisions() ||
                    !voxel.getSubstanceData()["dve_is_solid"] ||
                    !collider.isSolid
                  )
                    continue;

                  if (collisionCheck.hitDepth < collisionResults.hitDepth) {
                    aabb.results.loadIn(colliderNode.results);
                  }
                }
              }
            }
          }

          position.x =
            previousPosiiton.x +
            collisionResults.hitDepth * delta.x +
            COLLISION_CHECK_POSITION_OFFSET * collisionResults.nx;
          position.y =
            previousPosiiton.y +
            collisionResults.hitDepth * delta.y +
            COLLISION_CHECK_POSITION_OFFSET * collisionResults.ny;
          position.z =
            previousPosiiton.z +
            collisionResults.hitDepth * delta.z +
            COLLISION_CHECK_POSITION_OFFSET * collisionResults.nz;

          if (collisionResults.hitDepth == 1) break;

          const BdotB =
            collisionResults.nx * collisionResults.nx +
            collisionResults.ny * collisionResults.ny +
            collisionResults.nz * collisionResults.nz;
          if (BdotB != 0) {
            Vector3Like.Copy(previousPosiiton, position);
            const AdotB =
              (1 - collisionResults.hitDepth) *
              (delta.x * collisionResults.nx +
                delta.y * collisionResults.ny +
                delta.z * collisionResults.nz);
            position.x +=
              (1 - collisionResults.hitDepth) * delta.x -
              (AdotB / BdotB) * collisionResults.nx;
            position.y +=
              (1 - collisionResults.hitDepth) * delta.y -
              (AdotB / BdotB) * collisionResults.ny;
            position.z +=
              (1 - collisionResults.hitDepth) * delta.z -
              (AdotB / BdotB) * collisionResults.nz;
          }
        }

        // **Final Check for Falling**

        Vector3Like.Copy(transform.position, position);

        colliderState.isInLiquid = isInLiquid ? 1 : 0;
      }
    }
  },
});
