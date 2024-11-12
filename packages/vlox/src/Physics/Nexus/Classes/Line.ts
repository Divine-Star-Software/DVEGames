import { Vector3Like } from "@amodx/math";
export class Line {
  start = Vector3Like.Create();
  end = Vector3Like.Create();

  update(start: Vector3Like, end: Vector3Like) {
    Vector3Like.Copy(this.start, start);
    Vector3Like.Copy(this.end, end);
    return this;
  }
}
