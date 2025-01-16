import { NCS, NodeCursor } from "@amodx/ncs";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Color3,
  TransformNode,
  Quaternion,
  Axis,
} from "@babylonjs/core";
import { GenMap } from "./GenMap/GenMap";
import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { DimensionProviderComponent } from "../../Core/Components/Providers/DimensionProvider.component";
import { BabylonContext } from "../../Babylon/Contexts/Babylon.context";

class Data {
  constructor(public _cleanUp: () => void) {}
}
export const GenWorldMapComponent = NCS.registerComponent<{}, Data>({
  type: "gen-world-map",

  init(component) {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.zIndex = "200";
    container.style.width = "250px";
    container.style.height = "250px";
    container.style.top = "0";
    container.style.left = "0";
    container.style.padding = "0";
    container.style.margin = "0";
    document.body.append(container);

    const canvas = document.createElement("canvas");

    const worldGenButton = document.createElement("button");
    const biomesButton = document.createElement("button");

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.zIndex = "250";

    worldGenButton.innerText = "World Gen";
    biomesButton.innerText = "Biomes";

    container.appendChild(canvas);

    // Babylon.js setup
    const engine = new Engine(canvas);
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera(
      "",
      Math.PI,
      0,
      800,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.panningSensibility = 1;
    const light = new HemisphericLight("", new Vector3(0, 1, 0), scene);
    light.specular.set(0, 0, 0);
    scene.activeCamera = camera;

    const material = new StandardMaterial("", scene);
    material.diffuseColor = new Color3(0, 1, 1);

    let map: GenMap = new GenMap();
    let isBig = true;
    let renderState = { isBig: true };

    const context = BabylonContext.getRequired(component.node);
    console.log("GEN WORLD MAP", context);

    const followCamera = context.data.scene.activeCamera!;

    const follow = new TransformNode("follow", scene);
    const fixedParent = new TransformNode("fixedParent", scene);

    // Resize observer
    let lastWidth = 0,
      lastHeight = 0;
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width !== lastWidth || height !== lastHeight) {
        engine.resize();
        lastWidth = width;
        lastHeight = height;
      }
    });

    resizeObserver.observe(container);

    engine.runRenderLoop(() => {
      const followPosition = followCamera.globalPosition;

      if (!renderState.isBig) {
        follow.position.copyFrom(followPosition);
        fixedParent.position.copyFrom(followPosition);

        const direction = camera.getDirection(new Vector3(0, 0, 1)).normalize();
        const normalized = new Vector3(direction.x, 0, direction.z).normalize();
        const angle = Math.atan2(normalized.x, normalized.z);
        const rotationQuaternion = Quaternion.RotationAxis(Axis.Y, angle);

        follow.rotationQuaternion = rotationQuaternion;
        follow.position.y = 10;
        fixedParent.position.y = 10;
        camera.radius = 800;
        camera.setTarget(follow.position);
      }
      scene.render();
    });

    map.init(scene);

    const dimension = DimensionProviderComponent.get(component.node);

    const interval = new SafeInterval(() => {
      const followPosition = followCamera.globalPosition;

      map.updateTiles([
        dimension?.schema.dimension || "main",
        followPosition.x,
        followPosition.y,
        followPosition.z,
      ]);
    }, 500);
    interval.start();

    component.data = new Data(() => {
      interval.stop();
      engine.dispose();
      container.remove();
    });
  },
  dispose(component) {
    component.data._cleanUp();
  },
});
