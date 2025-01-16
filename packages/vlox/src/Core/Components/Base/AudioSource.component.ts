import { NCS } from "@amodx/ncs/";
import { Audio } from "@amodx/audio";
import { TransformComponent } from "./Transform.component";
interface Data {}
class Logic {
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

class AudioSourceComponentSchema {
  sfxId: string;
  level: number;
  rolloffFactor: number;
}

export const AudioSourceComponent = NCS.registerComponent<
  AudioSourceComponentSchema,
  Data,
  Logic
>({
  type: "audio-source",
  schema: NCS.schemaFromObject(new AudioSourceComponentSchema()),
  init(component) {
    component.logic =  new Logic(component.cloneCursor());
  },
});
