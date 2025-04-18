import { NCS } from "@amodx/ncs/";
import { Audio } from "@amodx/audio";
import { TransformComponent } from "../Transform.component";

class Data {
  constructor(public component: (typeof AudioSourceComponent)["default"]) {}
  play() {
    const transform = TransformComponent.get(this.component.node)!;
    if (transform) {
      Audio.sfx.play(this.component.schema.sfxId, {
        level: this.component.schema.level,
        _3dSoundPosition: {
          x: transform.schema.position.x,
          y: transform.schema.position.y,
          z: transform.schema.position.z,
        },
        _3dSoundData: {
          rolloffFactor: this.component.schema.rolloffFactor,
        },
      });
    } else {
      Audio.sfx.play("place", {
        level: this.component.schema.level,
      });
    }
  }
}

export const AudioSourceComponent = NCS.registerComponent({
  type: "audio-source",
  schema: NCS.schema({
    sfxId: NCS.property(""),
    level: NCS.property(0),
    rolloffFactor: NCS.property(0),
  }),
  data: NCS.data<Data>(),
  init: (component) => (component.data = new Data(component.cloneCursor())),
  dispose: (component) => component.data.component.returnCursor(),
});
