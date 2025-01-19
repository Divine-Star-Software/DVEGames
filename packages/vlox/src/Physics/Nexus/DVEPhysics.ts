import { Graph, NCS } from "@amodx/ncs/";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";
import { NexusContext } from "../../Core/Contexts/Nexus.context";
import { PhysicsSystems } from "./Systems/PhysicsSystem";
import "./Colliders/DefaultCollider";
import "../../Core/Components/Providers/DimensionProvider.component";
import "../../Core/Components/Base/Transform.component";
import "../Components/BoxCollider.component";
import "../Components/PhysicsBody.component";
import "../Components/PhysicsColliderState.component";
import RegisterTasksNexus from "../Tasks/RegisterTasksNexus";
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
    const graph = NCS.createGraph();
    NexusContext.set(graph.root, null, null, {
      dve,
    });
    this.graph = graph;
    RegisterTasksNexus(dve);

  }

  static start() {
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
