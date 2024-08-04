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
    trait.data = {
      transform,
    };
    transform.schema.getSchema().traverse((node) => {
      if (node.property.id == "position" && trait.data.position) {
        node.enableProxy(
          () => trait.data.position,
          (vec) => {
            Vector3Like.Copy(trait.data.position!, vec);
          }
        );
      }
      if (node.property.id == "rotation" && trait.data.rotation) {
        node.enableProxy(
          () => trait.data.rotation,
          (vec) => Vector3Like.Copy(trait.data.rotation!, vec)
        );
      }
      if (node.property.id == "scale" && trait.data.scale) {
        node.enableProxy(
          () => trait.data.scale,
          (vec) => Vector3Like.Copy(trait.data.scale!, vec)
        );
      }
    });
  },
});
