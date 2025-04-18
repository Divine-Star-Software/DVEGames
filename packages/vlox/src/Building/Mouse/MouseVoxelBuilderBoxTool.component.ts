import { NCS, Node, NodeCursor } from "@amodx/ncs";
import { VoxelMousePickComponent } from "../../Interaction/VoxelMousePick.component";

import { Vec3Array, Vector3Like } from "@amodx/math";
import { VoxelBoxVolumeComponent } from "../../Voxels/Volumes/VoxelBoxVolume.component";
import { VoxelBoxVolumeMeshComponent } from "../../Voxels/Volumes/VoxelBoxVolumeMesh.component";
import { TransformComponent } from "../../Transform.component";
import {
  
  Matrix,
  PointerEventTypes,
  
  Vector3,
} from "@babylonjs/core";
import { Observable } from "@amodx/core/Observers";
import { BabylonContext } from "../../Babylon/Babylon.context";
import { VoxelBoxSelection } from "@divinevoxel/vlox/Templates/Selection/VoxelBoxSelection";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";
import { VoxelPaintDataComponent } from "../../Voxels/VoxelPaintData.component";
import { VoxelUpdateProviderComponent } from "../../Providers/VoxelUpdateProvider.component";

export const MouseVoxelBuilderBoxToolComponent = NCS.registerComponent({
  type: "mouse-voxel-builder-box-tool",
  schema: NCS.schema({
    defaultExtrusion: NCS.property(0),
  }),
  data: NCS.data<() => void>(),
  init(component) {
    component = component.cloneCursor();
    const { updater } = VoxelUpdateProviderComponent.getRequired(
      component.node
    ).data;
    const paintData = VoxelPaintDataComponent.getRequired(component.node);
    const { scene } = BabylonContext.getRequired(component.node).data;

    const selection = new VoxelBoxSelection();
    let enabled = false;
    const canceled = new Observable();

    let box: NodeCursor | null = null;

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

        canceled.notify();
        box = null;
      }
    };

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    const startBox = async (
      pickedPosition: Vector3Like,
      pickedNormal: Vector3Like,
      onDone: (box: NodeCursor) => Promise<any>
    ) => {
      box = component.node.graph
        .addNode(
          Node({}, [
            TransformComponent(),
            VoxelBoxVolumeComponent(),
            VoxelBoxVolumeMeshComponent(),
          ]),
          component.node.index
        )
        .cloneCursor();
      VoxelBoxVolumeMeshComponent.get(box)!.data.renderingGroupId = 3;

      const camera = scene.activeCamera!;

      const volumeTransform = TransformComponent.get(box)!;
      Vector3Like.Copy(
        volumeTransform.schema.position,
        Vector3Like.Add(pickedPosition, pickedNormal)
      );
      const volume = VoxelBoxVolumeComponent.get(box)!;
      const planeOrigin = new Vector3(
        ...Vector3Like.ToArray(Vector3Like.Add(pickedPosition, pickedNormal))
      );
      const planeNormal = new Vector3(
        pickedNormal.x,
        pickedNormal.y,
        pickedNormal.z
      );

      let isDone = false;
      let cacneled = false;
      const done = async () => {
        if (!box) return;
        scene.onPointerObservable.remove(pointerMove);
        await onDone(box);
        box.dispose();
        box = null;
        isDone = true;
      };
      canceled.subscribeOnce(() => {
        cacneled = true;
        scene.onPointerObservable.remove(pointerMove);
      });

      let offset = component.schema.defaultExtrusion;

      if (pickedNormal.x > 0 || pickedNormal.y > 0 || pickedNormal.z > 0) {
        offset++;
      }

      const update = () => {
        const pickRay = scene.createPickingRay(
          scene.pointerX,
          scene.pointerY,
          Matrix.Identity(),
          camera
        );

        const distance =
          Vector3.Dot(planeOrigin.subtract(pickRay.origin), planeNormal) /
          Vector3.Dot(pickRay.direction, planeNormal);

        const intersectionPoint = pickRay.origin
          .add(pickRay.direction.scale(distance))
          .floor();

        selection.reConstruct(
          pickedPosition,
          pickedNormal,
          intersectionPoint,
          planeNormal,
          offset
        );

        volume.data.setPoints([
          Vector3Like.ToArray(selection.origin),
          Vector3Like.ToArray(selection.end),
        ]);
      };

      update();
      const pointerMove = scene.onPointerObservable.add((event) => {
        if (cacneled || isDone) {
          return;
        }
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

    const mousePick = VoxelMousePickComponent.get(component.node)!;
    const listener = mousePick!.data.voxelPicked.listener(
      ({ button, picked }) => {
        if (!enabled) return;
        if (!picked.position || !picked.normal) return;
        if (button == 0) {
          startBox(picked.position, picked.normal, async (newbox) => {
            if (!newbox) return;
            const [start, end] =
              VoxelBoxVolumeComponent.get(newbox)!.data.getPoints();
            updater.paintArea(
              0,
              Vector3Like.Create(...start),
              Vector3Like.Create(...end),
              PaintVoxelData.ToRaw(paintData.schema),
              {}
            );
          });
        }
        if (button == 2) {
          startBox(picked.position, picked.normal, async (newbox) => {
            if (!newbox) return;
            const [start, end] =
              VoxelBoxVolumeComponent.get(newbox)!.data.getPoints();
            updater.eraseArea(
              0,
              Vector3Like.Create(...start),
              Vector3Like.Create(...end),
              {}
            );
          });
        }
      }
    );
    mousePick!.data.voxelPicked.subscribe(listener);

    component.data = () => {
      mousePick!.data.voxelPicked.unsubscribe(listener);
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  },
  dispose(component) {
    component.data();
  },
});
