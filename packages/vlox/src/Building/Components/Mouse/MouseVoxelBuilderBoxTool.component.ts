import { NCS, Node, NodeInstance } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../../Core/Components/Voxels/Interaction/VoxelMousePick.component";
import { VoxelRemoverComponent } from "../../../Core/Components/Voxels/Interaction/VoxelRemover.component";
import { VoxelPlacerComponent } from "../../../Core/Components/Voxels/Interaction/VoxelPlacer.component";
import { Vec3Array, Vector3Like } from "@amodx/math";
import { VoxelBoxVolumeComponent } from "../../../Core/Components/Voxels/Volumes/VoxelBoxVolume.component";
import { VoxelBoxVolumeMeshComponent } from "../../../Core/Components/Voxels/Volumes/VoxelBoxVolumeMesh.component";
import { TransformComponent } from "../../../Core/Components/Base/Transform.component";
import {
  Camera,
  Matrix,
  PointerEventTypes,
  Scene,
  Vector3,
} from "@babylonjs/core";
import { Observable } from "@amodx/core/Observers";
import { BabylonContext } from "../../../Babylon/Contexts/Babylon.context";
import { IntProp, StringProp } from "@amodx/schemas";

interface Schema {
  defaultExtrusion: number;
}
interface Data {
  readonly node: NodeInstance | null;
}

class BuilderBox {
  node: NodeInstance;
  canceled = new Observable();
  constructor(
    public component: (typeof MouseVoxelBuilderBoxToolComponent)["default"]
  ) {}

  async init() {
    this.node = await this.component.node.graph.addNode(
      Node({}, [
        TransformComponent({}),
        VoxelBoxVolumeComponent(),
        VoxelBoxVolumeMeshComponent(),
      ]),
      this.component.node
    );
    VoxelBoxVolumeMeshComponent.get(this.node)!.data.box.renderingGroupId = 3;
  }

  async dispose() {
    await this.node.dispose();
  }

  async cancel() {
    this.canceled.notify();
    await this.dispose();
  }
}

export const getSize = (start: Vector3, end: Vector3) => {
  return new Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
};

const getIntersection = (
  scene: Scene,
  camera: Camera,
  planeOrigin: Vector3,
  planeNormal: Vector3
) => {
  const pickRay = scene.createPickingRay(
    scene.pointerX,
    scene.pointerY,
    Matrix.Identity(),
    camera
  );

  const distance =
    Vector3.Dot(planeOrigin.subtract(pickRay.origin), planeNormal) /
    Vector3.Dot(pickRay.direction, planeNormal);

  const intersectionPoint = pickRay.origin.add(
    pickRay.direction.scale(distance)
  );

  return intersectionPoint;
};
export const MouseVoxelBuilderBoxToolComponent = NCS.registerComponent<
  Schema,
  Data
>({
  type: "mouse-voxel-builder-box-tool",
  schema: [IntProp("defaultExtrusion")],

  init(component) {
    const remover = VoxelRemoverComponent.get(component.node)!;
    const placer = VoxelPlacerComponent.get(component.node)!;
    const { scene } = BabylonContext.getRequired(component.node).data;

    let enabled = false;

    let box: BuilderBox | null = null;

    const keydown = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        enabled = true;
        document.body.style.cursor = "crosshair";
      }
    };

    const keyup = (event: KeyboardEvent) => {
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        enabled = false;
        document.body.style.cursor = "default";

        box?.cancel();
        box = null;
      }
    };

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    const startBox = async (
      pickedPosition: Vec3Array,
      pickedNormal: Vec3Array,
      onDone: (box: BuilderBox) => Promise<any>
    ) => {
      const newbox = new BuilderBox(component);
      await newbox.init();
      box = newbox;

      const camera = scene.activeCamera!;

      const volumeTransform = TransformComponent.get(newbox.node)!;
      Vector3Like.CopyFromArray(
        volumeTransform.schema.position,
        Vector3Like.AddArray(pickedPosition, pickedNormal)
      );
      const volume = VoxelBoxVolumeComponent.get(newbox.node)!;

      const planeOrigin = new Vector3(
        ...Vector3Like.AddArray(pickedPosition, pickedNormal)
      );
      const planeNormal = new Vector3(...pickedNormal);

      let cacneled = false;
      const done = async () => {
        scene.onPointerObservable.remove(pointerMove);
        await onDone(newbox);
        newbox.dispose();
        box = null;
      };
      newbox.canceled.subscribeOnce(() => {
        cacneled = true;
        scene.onPointerObservable.remove(pointerMove);
      });

      let offset = component.schema.defaultExtrusion;

      if (pickedNormal[0] > 0 || pickedNormal[1] > 0 || pickedNormal[2] > 0) {
        offset++;
      }

      const getMinMax = (...points: Vec3Array[]): [Vec3Array, Vec3Array] => {
        if (points.length === 0) {
          throw new Error(
            "At least one point is required to calculate min/max."
          );
        }

        let min: Vec3Array = [...points[0]];
        let max: Vec3Array = [...points[0]];

        for (const point of points) {
          for (let i = 0; i < 3; i++) {
            if (point[i] < min[i]) {
              min[i] = point[i];
            }
            if (point[i] > max[i]) {
              max[i] = point[i];
            }
          }
        }

        return [min, max];
      };

      const update = () => {
        const size = getSize(
          new Vector3(...Vector3Like.AddArray(pickedPosition, pickedNormal)),
          getIntersection(scene, camera, planeOrigin, planeNormal).floor()
        );

        const point1 = Vector3Like.AddArray(pickedPosition, pickedNormal);

        const point2 = Vector3Like.AddArray(point1, [
          size.x || 1,
          size.y || 1,
          size.z || 1,
        ]);
        const minPoint: Vec3Array = [
          Math.min(point1[0], point2[0]),
          Math.min(point1[1], point2[1]),
          Math.min(point1[2], point2[2]),
        ];
        const maxPoint: Vec3Array = [
          Math.max(point1[0], point2[0]),
          Math.max(point1[1], point2[1]),
          Math.max(point1[2], point2[2]),
        ];

        if (size.x < 0) maxPoint[0] += 1;
        if (size.y < 0) maxPoint[1] += 1;
        if (size.z < 0) maxPoint[2] += 1;

        const normalOffset = Vector3Like.AddArray(
          pickedPosition,
          Vector3Like.MultiplyScalarArray(pickedNormal, offset)
        );

        const [finalMin, finalMax] = getMinMax(
          minPoint,
          maxPoint,
          normalOffset
        );

        const finalSize: Vec3Array = [
          Math.abs(finalMax[0] - finalMin[0]),
          Math.abs(finalMax[1] - finalMin[1]),
          Math.abs(finalMax[2] - finalMin[2]),
        ];
        if (finalSize[0] == 0 && finalSize[1] == 0 && finalSize[2] == 0) {
          volume.logic.setPoints([
            pickedPosition,
            Vector3Like.AddArray(pickedPosition, pickedNormal),
          ]);
        } else {
          volume.logic.setPoints([finalMin, finalMax]);
        }
      };

      update();
      const pointerMove = scene.onPointerObservable.add((event) => {
        if (cacneled) return;
        if (event.type == PointerEventTypes.POINTERUP) {
          done();
          return;
        }
        if (event.type == PointerEventTypes.POINTERWHEEL) {
          const delta = (event.event as WheelEvent).deltaY;

          delta < 0 ? offset++ : offset--;
          update();
        }
        if (event.type == PointerEventTypes.POINTERMOVE) {
          update();
        }
      });
    };

    const handlePlace = (
      pickedPosition: Vec3Array,
      pickedNormal: Vec3Array
    ) => {
      startBox(pickedPosition, pickedNormal, async (newbox) => {
        placer.logic.placeArea(
          ...VoxelBoxVolumeComponent.get(newbox.node)!.logic.getPoints()
        );
      });
    };
    const handleRemove = (
      pickedPosition: Vec3Array,
      pickedNormal: Vec3Array
    ) => {
      startBox(
        Vector3Like.SubtractArray(pickedPosition, pickedNormal),
        pickedNormal,
        async (newbox) => {
          remover.logic.removeArea(
            ...VoxelBoxVolumeComponent.get(newbox.node)!.logic.getPoints()
          );
        }
      );
    };

    VoxelMousePickComponent.get(component.node)!.data.voxelPicked.subscribe(
      component,
      ({ button, data: { pickedPosition, pickedNormal } }) => {
        if (!enabled) return;
        if (button == 0) {
          handlePlace(pickedPosition, pickedNormal);
        }
        if (button == 2) {
          handleRemove(pickedPosition, pickedNormal);
        }
      }
    );

    component.observers.disposed.subscribeOnce(() => {
      VoxelMousePickComponent.get(component.node)!.data.voxelPicked.unsubscribe(
        component
      );
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    });
  },
});
