import { Graph, NCS } from "@amodx/ncs/";
import { DivineVoxelEngineNexus } from "@divinevoxel/vlox/Contexts/Nexus/DivineVoxelEngineNexus";
import { NexusContext } from "../../Contexts/Nexus.context";
import { PhysicsSystems } from "./Systems/PhysicsSystem";
import "./Colliders/DefaultCollider";
import "../../Providers/DimensionProvider.component";
import "../../Transform.component";
import "../BoxCollider.component";
import "../PhysicsBody.component";
import "../PhysicsColliderState.component";
import RegisterTasksNexus from "../Tasks/RegisterTasksNexus";
let loopHandle: any;
let isRunning = false;
const updateFrequency = 16;

let lastTime = 0;
const updateLoop = () => {
  if (!isRunning) return;

  DVEPhysics.graph.update();

  loopHandle = setTimeout(updateLoop, updateFrequency);
};

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
    lastTime = performance.now();
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
