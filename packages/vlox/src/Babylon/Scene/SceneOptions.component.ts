import { NCS } from "@amodx/ncs/";
import { BabylonContext } from "../Babylon.context";

export const SceneOptionsComponent = NCS.registerComponent({
  type: "scene-options",
  schema: NCS.schema({
    shade: NCS.property({
      doSun: NCS.property(true),
      doRGB: NCS.property(true),
      doAO: NCS.property(true),
      doColor: NCS.property(true),
    }),
    levels: NCS.property({
      base: NCS.property(0),
      sun: NCS.property(0),
    }),
    effects: NCS.property({
      enabled: NCS.property(true),
    }),
    fog: NCS.property({
      mode: NCS.property(0),
      density: NCS.property(0),
      heightFactor: NCS.property(0),
      color: NCS.property(
        { r: 1, g: 1, b: 1 },
        {
          type: "color-3",
        }
      ),
      startBlend: NCS.property(0),
      blendEnd: NCS.property(0),
    }),
    sky: NCS.property({
      horizon: NCS.property(0),
      horizonStart: NCS.property(0),
      horizonEnd: NCS.property(0),
      color: NCS.property(
        { r: 1, g: 1, b: 1 },
        {
          type: "color-3",
        }
      ),
      blendStart: NCS.property(0),
      blendEnd: NCS.property(0),
    }),
  }),

  init(component) {
    const { renderer } = BabylonContext.getRequired(component.node).data;
    const options = renderer.voxelScene.options;

    const index = component.schema.getSchemaIndex();
    const cursor = component.schema.getCursor();

    console.warn(index, index.shade.doSun, options.shade.doSun, options.shade);
    // Setting proxies for each property individually
    cursor.setProxy(index.shade.doSun, options.shade, "doSun");
    cursor.setProxy(index.shade.doRGB, options.shade, "doRGB");
    cursor.setProxy(index.shade.doAO, options.shade, "doAO");
    cursor.setProxy(index.shade.doColor, options.shade, "doColor");

    cursor.setProxy(index.levels.base, options.levels, "baseLevel");
    cursor.setProxy(index.levels.sun, options.levels, "sunLevel");

    cursor.setProxy(index.effects.enabled, options.effects, "enabled");

    cursor.setProxy(index.fog.mode, options.fog, "mode");
    cursor.setProxy(index.fog.density, options.fog, "density");
    cursor.setProxy(index.fog.heightFactor, options.fog, "heightFactor");

    cursor.setProxy(index.fog.color.r, options.fog.color, "r");
    cursor.setProxy(index.fog.color.g, options.fog.color, "g");
    cursor.setProxy(index.fog.color.b, options.fog.color, "b");
    cursor.setProxy(index.fog.startBlend, options.fog, "start");
    cursor.setProxy(index.fog.blendEnd, options.fog, "end");

    cursor.setProxy(index.sky.horizon, options.sky, "horizon");
    cursor.setProxy(index.sky.horizonStart, options.sky, "horizonStart");
    cursor.setProxy(index.sky.horizonEnd, options.sky, "horizonEnd");
    cursor.setProxy(index.sky.color.r, options.sky.color, "r");
    cursor.setProxy(index.sky.color.g, options.sky.color, "g");
    cursor.setProxy(index.sky.color.b, options.sky.color, "b");
    cursor.setProxy(index.sky.blendStart, options.sky, "startBlend");
    cursor.setProxy(index.sky.blendEnd, options.sky, "endBlend");
  },
});
