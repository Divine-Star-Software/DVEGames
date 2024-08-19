import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";
import { TransformComponent } from "../../Components/Base/Transform.component";

type Data = {
  transform: (typeof TransformComponent)["default"];
  position?: Vector3Like;
  rotation?: Vector3Like;
  scale?: Vector3Like;
};

export const ProxyTransformTrait = NCS.registerTrait<{}, Data>({
  type: "proxy-transform",
  init(trait) {
    const node = trait.getNode();
    const transform = TransformComponent.get(node)!;

    let proxyPosition: Vector3Like;
    let proxyRotation: Vector3Like;
    let proxyScale: Vector3Like;
    trait.data = {
      transform,
      set position(position: Vector3Like) {
        proxyPosition = position;
        transform.schema.getSchema().traverse((node) => {
          if (node.property.id == "position") {
            Vector3Like.Copy(position!, node.get());
            node.enableProxy(
              () => position,
              (vec) => {
                Vector3Like.Copy(position!, vec);
              }
            );
          }
        });
      },
      get position() {
        return proxyPosition;
      },
      set rotation(rotation: Vector3Like) {
        proxyRotation = rotation;
        transform.schema.getSchema().traverse((node) => {
          if (node.property.id == "rotation") {
            Vector3Like.Copy(rotation!, node.get());
            node.enableProxy(
              () => rotation,
              (vec) => {
                Vector3Like.Copy(rotation!, vec);
              }
            );
          }
        });
      },
      get rotation() {
        return proxyRotation;
      },
      set scale(scale: Vector3Like) {
        proxyScale = scale;
        transform.schema.getSchema().traverse((node) => {
          if (node.property.id == "scale") {
            Vector3Like.Copy(scale!, node.get());
            node.enableProxy(
              () => scale,
              (vec) => {
                Vector3Like.Copy(scale!, vec);
              }
            );
          }
        });
      },
      get scale() {
        return proxyScale;
      },
    };
  },
});
