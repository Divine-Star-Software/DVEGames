import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { PhysicsBodyComponent } from "@dvegames/foundation/Physics/Components/PhysicsBody.component";
import { PhysicsColliderStateComponent } from "@dvegames/foundation/Physics/Components/PhysicsColliderState.component";
import { BoxColliderComponent } from "@dvegames/foundation/Physics/Components/BoxCollider.component";
import { NexusPhysicsLinkComponent } from "@dvegames/foundation/Physics/Components/NexusPhysicsLink.component";
import { Vector3Like } from "@amodx/math";
import { TransformComponent } from "@dvegames/foundation/Core/Components/Base/Transform.component";
import { DimensionProviderComponent } from "@dvegames/foundation/Core/Components/Providers/DimensionProvider.component";
import { Controls, KeyDownEvent } from "@amodx/controls";
import { CameraProviderComponent } from "@dvegames/foundation/Babylon/Components/Providers/CameraProvider.component";
import { FirstPersonCameraComponent } from "@dvegames/foundation/Babylon/Components/Cameras/FirstPersonCamera.component";
import { PlayerControllerComponent } from "@dvegames/foundation/Player/Components/PlayerController.component";
import { TransformNodeComponent } from "@dvegames/foundation/Babylon/Components/Base/TransformNode.component";

export class Player {
  static graph: Graph;
  static node: NodeInstance | null;

  static init(graph: Graph) {
    this.graph = graph;
  }

  static create() {
    console.log("CREATE THE PLAYER");
    this.node = this.graph.addNode(
      Node(
        {},
        [
          DimensionProviderComponent({
          }),
          TransformComponent({
            position: { x: 0, y: 100, z: 0 },
          }),
          PhysicsBodyComponent({
            mass: 70,
          }),
          BoxColliderComponent({
            size: Vector3Like.Create(0.8, 1.8, 0.8),
          }),
          TransformNodeComponent({
            mode: "sync",
          }),
          PhysicsColliderStateComponent(),
          //    BoxColliderMeshComponent(),
          NexusPhysicsLinkComponent(),
          PlayerControllerComponent(),
        ],
        Node({}, [
          TransformComponent({
            position: { x: 0, y: 1.8 / 2, z: 0 },
          }),
          TransformNodeComponent(),
          CameraProviderComponent(),
          FirstPersonCameraComponent(),
        ])
      )
    );
    console.log(this.node);

    const controller = PlayerControllerComponent.get(this.node)!;
    const camera = CameraProviderComponent.getChild(this.node)!;

    Controls.registerControls([
      {
        id: "main",
        name: "main",
        controls: [
          {
            id: "move_forward",
            groupId: "main",
            name: "Move Forward",
            input: {
              keyboard: {
                key: "w",
                mode: "down",
              },
            },
            action: (event) => {
              console.log("move forward");
              controller.data.controlObservers.moveForward.notify();
              (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
                controller.data.controlObservers.moveForwardKeyUp.notify();
              });
            },
          },
          {
            id: "move_backward",
            groupId: "main",
            name: "Move Backward",
            input: {
              keyboard: {
                key: "s",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveBackward.notify();
              (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
                controller.data.controlObservers.moveBackwardKeyUp.notify();
              });
            },
          },
          {
            id: "move_left",
            groupId: "main",
            name: "Move Left",
            input: {
              keyboard: {
                key: "a",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveLeft.notify();
              (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
                controller.data.controlObservers.moveLeftKeyUp.notify();
              });
            },
          },
          {
            id: "move_right",
            groupId: "main",
            name: "Move Right",
            input: {
              keyboard: {
                key: "d",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.moveRight.notify();
              (event as KeyDownEvent).observers.onRelease.subscribeOnce(() => {
                controller.data.controlObservers.moveRightKeyUp.notify();
              });
            },
          },
          {
            id: "jump",
            groupId: "main",
            name: "Jump",
            input: {
              keyboard: {
                key: " ",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.jump.notify();
            },
          },
          {
            id: "run",
            groupId: "main",
            name: "Run",
            input: {
              keyboard: {
                key: "Shift",
                mode: "down",
              },
            },
            action: (event) => {
              controller.data.controlObservers.run.notify();
            },
          },
        ],
      },
    ]).init();
  }
  static destroy() {
    this.node?.dispose();
    this.node = null;
  }
}
