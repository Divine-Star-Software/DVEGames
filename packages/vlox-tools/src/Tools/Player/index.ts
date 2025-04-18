import { frag } from "@amodx/elm";
import { ToolPanelViews } from "../../ToolPanelViews";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Graph, Node, NodeCursor } from "@amodx/ncs/";
import { PhysicsBodyComponent } from "@dvegames/vlox/Physics/PhysicsBody.component";
import { PhysicsColliderStateComponent } from "@dvegames/vlox/Physics/PhysicsColliderState.component";
import { BoxColliderComponent } from "@dvegames/vlox/Physics/BoxCollider.component";
import { NexusPhysicsLinkComponent } from "@dvegames/vlox/Physics/NexusPhysicsLink.component";
import { Vector3Like } from "@amodx/math";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
import { Controls, KeyDownEvent } from "@amodx/controls";
import { CameraProviderComponent } from "@dvegames/vlox/Babylon/Providers/CameraProvider.component";
import { FirstPersonCameraComponent } from "@dvegames/vlox/Babylon/Cameras/FirstPersonCamera.component";
import { PlayerControllerComponent } from "@dvegames/vlox/Debug/Player/PlayerController.component";
import { TransformNodeComponent } from "@dvegames/vlox/Babylon/TransformNode.component";
import { elm, useSignal } from "@amodx/elm";

class Player {
  static graph: Graph;
  static node: NodeCursor | null;

  static init(graph: Graph) {
    this.graph = graph;
  }

  static create() {
    console.warn("create the demo player");
    this.node = this.graph
      .addNode(
        Node(
          "Player",
          [
            DimensionProviderComponent(),
            TransformComponent(
              {
                position: { x: 0, y: 100, z: 0 },
              },
              "shared-array"
            ),
            PhysicsBodyComponent(
              {
                mass: 70,
              },
              "shared-binary-object"
            ),
            BoxColliderComponent(
              {
                size: Vector3Like.Create(0.8, 1.8, 0.8),
              },
              "shared-binary-object"
            ),
            TransformNodeComponent({
              mode: "sync",
            }),
            PhysicsColliderStateComponent(null, "shared-binary-object"),
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
      )
      .cloneCursor();

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
            action: (event: KeyDownEvent) => {
              controller.data.controlObservers.moveForward.notify();
              event.addEventListener(
                "release",
                () => {
                  controller.data.controlObservers.moveForwardKeyUp.notify();
                },
                { once: true }
              );
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
              event.addEventListener(
                "release",
                () => {
                  controller.data.controlObservers.moveBackwardKeyUp.notify();
                },
                { once: true }
              );
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
              event.addEventListener(
                "release",
                () => {
                  controller.data.controlObservers.moveLeftKeyUp.notify();
                },
                { once: true }
              );
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
              event.addEventListener(
                "release",
                () => {
                  controller.data.controlObservers.moveRightKeyUp.notify();
                },
                { once: true }
              );
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

function PlayerView(node: NodeCursor) {
  return frag(
    SchemaEditor({
      schema: TransformComponent.get(node)!.schema,
    }),
    SchemaEditor({
      schema: PlayerControllerComponent.get(node)!.schema,
    }),
    SchemaEditor({
      schema: PhysicsBodyComponent.get(node)!.schema,
    })
  );
}

export default function (graph: Graph) {
  ToolPanelViews.registerView("Player", (component) => {
    const update = useSignal();
    return frag(
      elm(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
          },
        },
        elm(
          "button",
          {
            onclick() {
              Player.create();
              update.broadcast();
            },
          },
          "Create Player"
        ),
        elm(
          "button",
          {
            onclick() {
              Player.destroy();
              update.broadcast();
            },
          },
          "Desotry Player"
        )
      ),
      elm("div", {
        signal: [
          update((elm) => {
            if (!Player.node!) return (elm.innerHTML = "");
            elm.append(PlayerView(Player.node!));
          }),
        ],
      }),
      (Player.node && PlayerView(Player.node!)) || null
    );
  });
}
