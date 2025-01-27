import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
import { BoxColliderComponent } from "../../Components/BoxCollider.component";
import { PhysicsBodyComponent } from "../../Components/PhysicsBody.component";
import { CollisionResult } from "../Classes/CollisionResult";
import { Line } from "../Classes/Line";
import { Plane } from "../Classes/Plane";
import { BoundingBox } from "../Classes/BoundingBox";
import { CollisionNode } from "../Classes/CollisionNode";
import { PhysicsColliderStateComponent } from "../../../Physics/Components/PhysicsColliderState.component";
import { WorldCursor } from "@divinevoxel/vlox/World/Cursor/WorldCursor";
import { ColliderManager } from "../Colliders/ColliderManager";
import { WorldSpaces } from "@divinevoxel/vlox/World/WorldSpaces";
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
const TERMINAL_VELOCITY = -50; // Cap falling speed

function applyForces(
  position: Vector3Like,
  body: (typeof PhysicsBodyComponent)["default"]["schema"],
  deltaTime: number
): void {
  if (body.isKinematic) return;

  // Apply gravity force
  body.force.y += body.mass * GRAVITY * body.gravityScale;

  // Calculate acceleration (F = ma, so a = F/m)
  const acceleration = {
    x: body.force.x / body.mass,
    y: body.force.y / body.mass,
    z: body.force.z / body.mass,
  };

  // Update velocity (v = u + at)
  body.velocity.x += acceleration.x * deltaTime;
  body.velocity.y += acceleration.y * deltaTime;
  body.velocity.z += acceleration.z * deltaTime;

  // Apply terminal velocity
  if (body.velocity.y < TERMINAL_VELOCITY) {
    body.velocity.y = TERMINAL_VELOCITY;
  }

  // Apply damping
  body.velocity.x *= 1 - body.damping.x * deltaTime;
  body.velocity.y *= 1 - body.damping.y * deltaTime;
  body.velocity.z *= 1 - body.damping.z * deltaTime;

  // Apply friction (friction is usually proportional to the normal force)
  // Assuming friction is a coefficient that directly reduces velocity
  frictionForce.x = -body.friction * body.velocity.x;
  frictionForce.y = -body.friction * body.velocity.y;
  frictionForce.z = -body.friction * body.velocity.z;

  body.velocity.x += frictionForce.x * deltaTime;
  body.velocity.y += frictionForce.y * deltaTime;
  body.velocity.z += frictionForce.z * deltaTime;

  // Reset forces for the next frame
  body.force.x = 0;
  body.force.y = 0;
  body.force.z = 0;

  // Update position based on velocity
  position.x += body.velocity.x * deltaTime;
  position.y += body.velocity.y * deltaTime;
  position.z += body.velocity.z * deltaTime;
}

function applyTransform(
  position: Vector3Like,
  body: (typeof PhysicsBodyComponent)["default"]["schema"],
  deltaTime: number
): void {
  if (!body.isKinematic) return;

  // Update position (s = ut + 0.5at^2)
  position.x += body.velocity.x * deltaTime;
  position.y += (body.velocity.y + GRAVITY * deltaTime) * deltaTime;
  position.z += body.velocity.z * deltaTime;
}

const deltaTime = 0.016;
const voxelPositon = Vector3Like.Create();

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

        // Store original position
        Vector3Like.Copy(position, transform.position);
        Vector3Like.Copy(previousPosiiton, transform.position);

        dataTool.setFocalPoint(
          "main",
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

        applyForces(position, body, deltaTime);
        applyTransform(position, body, deltaTime);

        let isGrounded = false;
        let isInLiquid = false;

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
                if (voxel.isRenderable() && voxel.getSubstanceData().isLiquid())
                  isInLiquid = true;
                const colliderId = voxel.getColliderStringId();
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

                  if (collisionCheck.hitDepth < 1) {
                    if (collisionCheck.ny == 1) isGrounded = true;
                  }
                  if (
                    !voxel.checkCollisions() ||
                    !voxel.getSubstanceData().isSolid() ||
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

        Vector3Like.Copy(transform.position, position);
        colliderState.isGrounded = isGrounded ? 1 : 0;
        colliderState.isInLiquid = isInLiquid ? 1 : 0;
      }
    }
  },
});
