import { Vector3Like } from "@amodx/math";
import { NCS } from "@amodx/ncs/";

/**
 * Provide a position and direction for other components to use.
 */
export const PositionDirectionProviderComponent = NCS.registerComponent({
  type: "position-direction",
  data: NCS.data<{ position: Vector3Like; direction: Vector3Like }>(),
  init(component) {
    component.data = {
      position: Vector3Like.Create(),
      direction: Vector3Like.Create(),
    };
  },
});
