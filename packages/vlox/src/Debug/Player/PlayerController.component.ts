import { Observable } from "@amodx/core/Observers";
import { Vector3 } from "@babylonjs/core";
import { NCS, Schema } from "@amodx/ncs/";
import { TransformComponent } from "../../Transform.component";
import { PhysicsBodyComponent } from "../../Physics/PhysicsBody.component";
import { CameraProviderComponent } from "../../Babylon/Providers/CameraProvider.component";
import { CameraDirectionComponent } from "../../Babylon/Cameras/CameraDirection.component";
import { BabylonContext } from "../../Babylon/Babylon.context";
import { PhysicsColliderStateComponent } from "../../Physics/PhysicsColliderState.component";

class PlayerControllerComponentObservers {
  moveForward = new Observable();
  moveForwardKeyUp = new Observable();
  moveBackward = new Observable();
  moveBackwardKeyUp = new Observable();
  moveLeft = new Observable();
  moveLeftKeyUp = new Observable();
  moveRight = new Observable();
  moveRightKeyUp = new Observable();
  jump = new Observable();
  run = new Observable();
  keyUp = new Observable();
}

class ComponentSchema {
  jumpTime = 20;
  jumpForce = 20;
  speed = 10;
}

export const PlayerControllerComponent = NCS.registerComponent({
  type: "player-controler-component",
  schema: NCS.schemaFromObject(new ComponentSchema()),
  data: NCS.data<{
    cleanUp: () => void;
    state: (typeof PhysicsColliderStateComponent)["default"];
    body: (typeof PhysicsBodyComponent)["default"];
    controlObservers: PlayerControllerComponentObservers;
  }>(),
  init(component) {
    const tranformComponent = TransformComponent.get(component.node);
    component.data = {
      cleanUp: () => {
        return scene.unregisterBeforeRender(directionUpdate);
      },
      body: PhysicsBodyComponent.getRequired(component.node),
      state: PhysicsColliderStateComponent.getRequired(component.node),
      controlObservers: new PlayerControllerComponentObservers(),
    };
    const data = component.data;
    const { scene, engine } = BabylonContext.get(component.node)!.data;
    const body = PhysicsBodyComponent.get(component.node)!.data;

    const cameraProvider = CameraProviderComponent.getChild(component.node)!;

    const cameraDirectionTrait = CameraDirectionComponent.set(
      cameraProvider.node
    );

    let moveForward = 0;
    let moveBackward = 0;
    let moveLeft = 0;
    let moveRight = 0;
    let jumping = 0;

    //update physics data

    const force = new Vector3();

    let jumpTime = 0;
    const directionUpdate = () => {
      /*      const position = physicsBodyComponent.physicsRoot.getAbsolutePosition();
      voxelPickerComponent.pick(
        [position.x, position.y, position.z],
        [direction.x, direction.y, direction.z],
        10
      ); */
      //if (!onGround) return;
      /*       if(data.state.schema.isInLiquid) {
        data.body.schema.gravityScale = .1;
      } else {
        data.body.schema.gravityScale = 1;
      } */
      const speed = component.schema.speed;
      const jumpSpeed = component.schema.jumpForce;

      if (moveForward == 1) {
        cameraDirectionTrait.data.forwardXZDirection.scaleToRef(speed, force);
      }
      if (moveBackward == 1) {
        cameraDirectionTrait.data.forwardXZDirection.scaleToRef(-speed, force);
      }
      if (moveRight == 1) {
        cameraDirectionTrait.data.sideDirection.scaleToRef(speed, force);
      }
      if (moveLeft == 1) {
        cameraDirectionTrait.data.sideDirection.scaleToRef(-speed, force);
      }
      if (jumping) {
        jumpTime -= engine.getDeltaTime();
        force.y = jumpSpeed;
        if (jumpTime <= 0) {
          jumping = 0;
          force.y = 0;
          body.component.schema!.velocity.y = 0;
        }
      } else {
        force.y = 0;
      }

      body.setVelocity(force);

      force.x = 0;
      force.y = 0;
      force.z = 0;
    };
    scene.registerBeforeRender(directionUpdate);

    component.data.controlObservers.moveForward.subscribe(this, () => {
      moveForward = 1;
    });
    component.data.controlObservers.moveForwardKeyUp.subscribe(this, () => {
      moveForward = 0;
    });

    component.data.controlObservers.moveBackward.subscribe(this, () => {
      moveBackward = 1;
    });
    component.data.controlObservers.moveBackwardKeyUp.subscribe(this, () => {
      moveBackward = 0;
    });

    component.data.controlObservers.moveLeft.subscribe(this, () => {
      moveLeft = 1;
    });
    component.data.controlObservers.moveLeftKeyUp.subscribe(this, () => {
      moveLeft = 0;
    });

    component.data.controlObservers.moveRight.subscribe(this, () => {
      moveRight = 1;
    });
    component.data.controlObservers.moveRightKeyUp.subscribe(this, () => {
      moveRight = 0;
    });

    component.data.controlObservers.jump.subscribe(this, () => {
      if (
        jumping ||
        (!data.state.schema.isGrounded && !data.state.schema.isInLiquid)
      )
        return;
      data.state.schema.wantsToJump = 1;
      /*       jumping = 1;
      body.component.schema!.velocity.y = component.schema.jumpForce;
      jumpTime = component.schema.jumpTime; */
    });
  },
  update(component) {
    if (component.data.state.schema.isInLiquid) {
      component.data.body.schema.gravityScale = 0.1;
    } else {
      component.data.body.schema.gravityScale = 1;
    }
  },
  dispose(component) {
    component.data.cleanUp();
  },
});
