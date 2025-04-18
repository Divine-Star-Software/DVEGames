import { NCS } from "@amodx/ncs";
import { BabylonContext } from "../Babylon/Babylon.context";
import { SchemaRegister } from "@divinevoxel/vlox/Voxels/State/SchemaRegister";
import { VoxelPropertiesRegister } from "@divinevoxel/vlox/Voxels/Data/VoxelPropertiesRegister";
import { VoxelPalettesRegister } from "@divinevoxel/vlox/Voxels/Data/VoxelPalettesRegister";
import { TextureManager } from "@divinevoxel/vlox/Textures/TextureManager";
import { VoxelExplodeParticles } from "@divinevoxel/vlox-babylon/Particles/VoxelExplodeParticles";
import { Scene } from "@babylonjs/core";
import { WorldCursor } from "@divinevoxel/vlox/World";
class Data {
  constructor(public scene: Scene) {}
  explodeAt(
    x: number,
    y: number,
    z: number,
    voxelId: string | number,
    mod: number
  ) {
    if (typeof voxelId == "number")
      voxelId = VoxelPalettesRegister.voxelIds.getStringId(
        VoxelPalettesRegister.voxels[voxelId][0]
      );
    const modState = SchemaRegister.getVoxelSchemas(voxelId)!
      .mod.startEncoding(mod)
      .toStateString();
    const particles =
      VoxelPropertiesRegister.VoxelProperties[
        VoxelPalettesRegister.voxelIds.getNumberId(voxelId)
      ]["dve_particle_data"];
    if (!particles) {
      console.warn("No particle data for:", voxelId);
      return;
    }

    const particleTexture = particles[modState];
    TextureManager.getTexture("dve_voxel")!.getTextureIndex(particleTexture);
    const explodeParticles = new VoxelExplodeParticles(
      this.scene,
      new WorldCursor()
    );
    explodeParticles.explodeAt(x, y, z, particleTexture);
  }
}

export const VoxelWorldParticlesComponent = NCS.registerComponent({
  type: "voxel-world-particles",
  data: NCS.data<Data>(),
  init(component) {
    const { scene } = BabylonContext.getRequired(component.node)!.data;
    component.data = new Data(scene);
  },
});
