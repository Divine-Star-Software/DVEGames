import { elm, frag, useSignal } from "@amodx/elm";
import { ToolPanelViews } from "../../DebugPanelViews";
import { Player } from "../Managers/Player";
import { NodeInstance } from "@amodx/ncs/";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { PlayerControllerComponent } from "@dvegames/vlox/Player/Components/PlayerController.component";
import { PhysicsBodyComponent } from "@dvegames/vlox/Physics/Components/PhysicsBody.component";
import { TransformComponent } from "@dvegames/vlox/Core/Components/Base/Transform.component";

function PlayerView(node: NodeInstance) {
  return frag(
    SchemaEditor({
      schemaInstance: TransformComponent.get(node)!.schema,
    }),
    SchemaEditor({
      schemaInstance: PlayerControllerComponent.get(node)!.schema,
    }),
    SchemaEditor({
      schemaInstance: PhysicsBodyComponent.get(node)!.schema,
    })
  );
}

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
