import { Graph, Node } from "@amodx/ncs/";
import { SceneOptionsComponent } from "@dvegames/vlox/Babylon/Scene/SceneOptions.component";
import { ToolPanelViews } from "../../ToolPanelViews";
import { frag } from "@amodx/elm";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
export default function (graph: Graph) {
  const node = graph.addNode(Node("Scene")).cloneCursor();

  const sceneOptions = SceneOptionsComponent.set(node);
  ToolPanelViews.registerView("Scene", (component) => {
    console.warn("Create scene",sceneOptions,sceneOptions.schema);
 
    return frag(
      SchemaEditor({
        schema: sceneOptions.schema,
      })
    );
  });
}
