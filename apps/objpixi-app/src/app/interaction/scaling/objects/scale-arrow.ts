import * as PIXI from 'pixi.js';


export class ScaleArrow {
  private readonly Icon = 'assets/right-arrow.png';
  // private readonly Icon = 'assets/bunny.png';
  private direction: ScaleArrowDirection;

  public DispObj: PIXI.DisplayObject;

  constructor(direction: ScaleArrowDirection) {
    this.direction = direction;
  }

  public Init(posX, posY) {
    const sp = PIXI.Sprite.from(this.Icon);
    sp.anchor.set(0.5);
    sp.scale.set(0.1, 0.1);
    sp.x = posX;
    sp.y = posY;

    switch (this.direction) {
      case ScaleArrowDirection.Up:
        sp.angle = -90;
        break;
      case ScaleArrowDirection.Down:
        sp.angle = 90;
        break;
      case ScaleArrowDirection.Left:
        sp.angle = 180;
        break;
      case ScaleArrowDirection.Right:
        break;
    }
    this.DispObj = sp;
  }

}

export enum ScaleArrowDirection {
  Up,
  Down,
  Left,
  Right
}
