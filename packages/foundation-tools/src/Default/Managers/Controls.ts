import { Graph, Node, NodeInstance } from "@amodx/ncs/";
import { BabylonContext } from "@dvegames/foundation/Babylon/Contexts/Babylon.context";
import { CrossHairsComponent } from "@dvegames/foundation/Babylon/Components/Interaction/CrossHairs.component";
export class Controls {
  static context: (typeof BabylonContext)["default"];
  static canvas: HTMLCanvasElement;
  static node: NodeInstance;
  private static listener: () => void;

  static init(graph: Graph) {
    this.context = BabylonContext.getRequired(graph.root);
    this.canvas = this.context.data.engine.getRenderingCanvas()!;

    this.node = graph.addNode(Node({}));
  }

  static setPointerLock(locked: boolean) {
    if (locked) {
      this.listener = () => {
        this.canvas.requestPointerLock();
      };
      this.canvas.addEventListener("click", this.listener);
    } else {
      document.exitPointerLock();
      this.canvas.removeEventListener("click", this.listener);
    }
  }

  static setCrossHairs(enabled: boolean) {
    if (enabled) {
      CrossHairsComponent.set(this.node);
    } else {
      CrossHairsComponent.remove(this.node);
    }
  }
}
