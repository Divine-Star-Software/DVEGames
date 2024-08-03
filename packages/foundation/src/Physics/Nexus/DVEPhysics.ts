import { Graph, NCS } from "@amodx/ncs/";
import { DivineVoxelEngineNexus } from "@divinevoxel/foundation/Contexts/Nexus/DivineVoxelEngineNexus";
import { NexusContext } from "../../Core/Contexts/Nexus.context";
import { PhysicsSystems } from "./Systems/PhysicsSystem";

let loopHandle: any;
let isRunning = false;
const updateLoop = () => {
  const updateFrequency = 16;

  if (!isRunning) return;

  DVEPhysics.graph.update();

  loopHandle = setTimeout(handle, updateFrequency);
};
const handle = () => updateLoop();
export class DVEPhysics {
  static graph: Graph;

  static async init(dve: DivineVoxelEngineNexus) {
    const graph = NCS.createGraph({});
    NexusContext.set(graph.root, undefined, {
      dve,
    });
    this.graph = graph;
  }

  static start() {
    console.log("START PHYSICS SYSTEM");
    PhysicsSystems.set(this.graph);
    isRunning = true;
    updateLoop();
  }

  static stop() {
    PhysicsSystems.remove(this.graph);
    isRunning = false;
    if (loopHandle) {
      clearTimeout(loopHandle);
    }
  }
}
