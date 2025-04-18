import { Vector3Like } from "@amodx/math";
import { Collider } from "../Classes/Collider.js";
import { ColliderManager } from "./ColliderManager.js";

ColliderManager.registerCollider(
  new (class extends Collider {
    id = "dve_cube";
    isSolid = true;
    flags = {};

    constructor() {
      super();
      this.addNode("main", Collider.createBBox(1, 1, 1));
    }
    getNodes(dataTool: Vector3Like) {
      this.nodes[0].position.x = dataTool.x;
      this.nodes[0].position.y = dataTool.y;
      this.nodes[0].position.z = dataTool.z;
      this.nodes[0].boundingBox.setPosition(
        dataTool.x + 0.5,
        dataTool.y + 0.5,
        dataTool.z + 0.5
      );
      return this.nodes;
    }
  })()
);

ColliderManager.registerCollider(
  new (class extends Collider {
    id = "dve_climable_box";
    isSolid = false;
    flags = {
      ["dve_climbable"]: 1,
    };

    constructor() {
      super();
      this.addNode("main", Collider.createBBox());
    }
    getNodes(dataTool: Vector3Like) {
      this.nodes[0].position.x = dataTool.x;
      this.nodes[0].position.y = dataTool.y;
      this.nodes[0].position.z = dataTool.z;
      return this.nodes;
    }
  })()
);

ColliderManager.registerCollider(
  new (class extends Collider {
    id = "dve_stair";
    isSolid = true;
    flags = {};

    constructor() {
      super();
      this.addNode("stair-bottom", Collider.createBBox(1, 0.5, 1));
      this.addNode("stair-top", Collider.createBBox(1, 0.5, 0.5));
    }
    getNodes(dataTool: Vector3Like) {
      this.nodes[0].position.x = dataTool.x;
      this.nodes[0].position.y = dataTool.y;
      this.nodes[0].position.z = dataTool.z;
      this.nodes[0].position.x = dataTool.x;
      this.nodes[1].position.y = dataTool.y + 0.5;
      this.nodes[0].position.z = dataTool.z;
      return this.nodes;
    }
  })()
);
