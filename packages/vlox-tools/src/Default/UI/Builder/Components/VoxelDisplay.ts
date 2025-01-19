import { elm, frag, Signal, useRef, useSignal } from "@amodx/elm";
import { IntProp, Schema, SelectProp } from "@amodx/schemas";
import { SchemaRegister } from "@divinevoxel/vlox/VoxelState/SchemaRegister";
import { VoxelPaintDataComponent } from "@dvegames/vlox/Core/Components/Voxels/VoxelPaintData.component";
import { Builder } from "../../../Managers/Builder";
import { SchemaEditor } from "../../../../UI/Schemas/SchemaEditor";
import { VoxelIndex } from "@divinevoxel/vlox/VoxelData/VoxelIndex";
import { VoxelTextureIndex } from "@divinevoxel/vlox/VoxelIndexes/VoxelTextureIndex";
import { Observable } from "@amodx/core/Observers";
import { MouseVoxelBuilderComponent } from "@dvegames/vlox/Building/Components/MouseVoxelBuilder.component";

elm.css(/* css */ `

.voxel-display {
  display: flex;
  flex-direction: row;
  align-content: center;
  width: 100%;


  .voxel-image-conatiner {
    width: 100px;
    height: 100%;

    .voxel-image {
      width: 64px;
      height: 64px;
      margin: auto;
      display: block;
      image-rendering: pixelated;
    }
  }

  .voxel-content-conatiner {
    display: flex;
    flex-direction : column;
    width: 100%;
    .voxel-title {
      font-size: 16px;
    }
    .voxel-schema-conatiner {
      width: 100%;

      .schema-editor {
        width: 100%;
        
        .form-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
          .label {
            width: 100%;
          }
          .input {
            width: 100%;
          }
        }
      }
    }
  }
}

  
`);

const schemaUpdated = new Observable();

function SchemaForm(voxelId: string) {
  const paintData = VoxelPaintDataComponent.get(Builder.node)!;
  const voxelSchema = SchemaRegister.getVoxelSchemas(voxelId);
  voxelSchema.shapeState.startEncoding();
  voxelSchema.modState.startEncoding();
  const updated = () => {
    paintData.schema.shapeState = voxelSchema.shapeState.getEncoded();
    paintData.schema.mod = voxelSchema.modState.getEncoded();
    schemaUpdated.notify();
  };

  const shapeStateSchema = voxelSchema.shapeState.nodes.length
    ? Schema.CreateInstance<Record<string, any>>(
        ...voxelSchema.shapeState.nodes.map((node) => {
          if (!node.valuePalette) {
            return IntProp(node.id, {
              initialize(schemaNode) {
                schemaNode.enableProxy(
                  () => voxelSchema.shapeState.getNmber(node.id),
                  (value) => {
                    voxelSchema.shapeState.setNumber(node.id, value);
                    updated();
                  }
                );
              },
            });
          }
          return SelectProp(node.id, {
            options: node.valuePalette._palette,
            initialize(schemaNode) {
              schemaNode.enableProxy(
                () => voxelSchema.shapeState.getValue(node.id),
                (value) => {
                  voxelSchema.shapeState.setValue(node.id, value);
                  updated();
                }
              );
            },
          });
        })
      )
    : null;

  const voxelModSchema = voxelSchema.modState.nodes.length
    ? Schema.CreateInstance<Record<string, any>>(
        ...voxelSchema.modState.nodes.map((node) => {
          if (!node.valuePalette) {
            return IntProp(node.id, {
              initialize(schemaNode) {
                schemaNode.enableProxy(
                  () => voxelSchema.modState.getNmber(node.id),
                  (value) => {
                    voxelSchema.modState.setNumber(node.id, value);
                    updated();
                  }
                );
              },
            });
          }
          return SelectProp(node.id, {
            options: node.valuePalette._palette,
            initialize(schemaNode) {
              schemaNode.enableProxy(
                () => voxelSchema.modState.getValue(node.id),
                (value) => {
                  voxelSchema.modState.setValue(node.id, value);
                  updated();
                }
              );
            },
          });
        })
      )
    : null;

  const loadIn = () => {
    voxelSchema.shapeState.startEncoding(paintData.schema.shapeState);
    voxelSchema.modState.startEncoding(paintData.schema.mod);
    if (shapeStateSchema) {
      voxelSchema.shapeState.nodes.forEach((node) => {
        if (node.valuePalette) {
          shapeStateSchema[node.id] = voxelSchema.shapeState.getValue(node.id);
          return;
        }
        shapeStateSchema[node.id] = voxelSchema.shapeState.getNmber(node.id);
      });
    }
    if (voxelModSchema) {
      voxelSchema.modState.nodes.forEach((node) => {
        if (node.valuePalette) {
          voxelModSchema[node.id] = voxelSchema.modState.getValue(node.id);
          return;
        }
        voxelModSchema[node.id] = voxelSchema.modState.getNmber(node.id);
      });
    }
  };
  const mouseBuilder = MouseVoxelBuilderComponent.get(Builder.node)!;
  mouseBuilder.data.voxelPickedObserver.subscribe(SchemaForm, () => {
    loadIn();
  });
  Builder.voxelUpdated.subscribe(SchemaForm, () => {
    loadIn();
  });

  return frag(
    (shapeStateSchema &&
      SchemaEditor({
        schemaInstance: shapeStateSchema,
      })) ||
      null,
    (voxelModSchema &&
      SchemaEditor({
        schemaInstance: voxelModSchema,
      })) ||
      null
  );
}
export default function VoxelDisplay() {
  const mouseBuilder = MouseVoxelBuilderComponent.get(Builder.node)!;
  const paintData = VoxelPaintDataComponent.get(Builder.node)!;
  const imageRef = useRef<HTMLImageElement>();
  const schameRef = useRef<HTMLDivElement>();
  const titleRef = useRef<HTMLHeadingElement>();

  const updateVoxel = () => {
    schameRef.current!.innerHTML = "";
    schameRef.current!.append(SchemaForm(paintData.schema.id));
  };
  const updateDisplay = () => {
    const state = VoxelIndex.instance.getStateFromPaintData(paintData.schema);
    if (!state) {
      imageRef.current!.src = "";
      return;
    }
    titleRef.current!.innerText = state.data.name || state.data.id;
    const image = VoxelTextureIndex.getImage(state.voxelId, state.data.id);
    if (!image) {
      imageRef.current!.src = "";
      return;
    }
    imageRef.current!.src = image.src;
  };

  let voxelId = "";

  schemaUpdated.subscribe(() => {
    updateDisplay();
  });

  mouseBuilder.data.voxelPickedObserver.subscribe(() => {
    if (paintData.schema.id != voxelId) {
      voxelId = paintData.schema.id;
      updateVoxel();
    }
    updateDisplay();
  });

  Builder.voxelUpdated.subscribe(() => {
    if (paintData.schema.id != voxelId) {
      voxelId = paintData.schema.id;
      updateVoxel();
    }
    updateDisplay();
  });

  return elm(
    "div",
    {
      className: "voxel-display",
    },
    elm(
      "div",
      {
        className: "voxel-image-conatiner",
      },
      elm("img", {
        className: "voxel-image",
        ref: imageRef,
      })
    ),
    elm(
      "div",
      {
        className: "voxel-content-conatiner",
      },
      elm(
        "h2",
        {
          className: "voxel-title",
          ref: titleRef,
        },
        "Select Voxel"
      ),
      elm("div", {
        className: "voxel-schema-conatiner",
        ref: schameRef,
      })
    )
  );
}
