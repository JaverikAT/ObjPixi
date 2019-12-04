import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';
import {IChangeService, VirtualResolutionChange} from '../../interface/services/ichange-service';
import {ServiceManager, ServiceType} from '../../services/service-manager';
import {Sizes} from '../../interface/enums/sizes.enum';

export class Mover {
  private static Texture: PIXI.Texture = null;
  private readonly Icon = 'assets/arrows/arrow_move.png';
  private Container: PIXI.Container;
  private originPoint: PIXI.Rectangle;
  private originPosition = new PIXI.Point();
  private crossSprite: PIXI.DisplayObject;
  private dragMode = false;
  private lastPosition: PIXI.Point;
  public OnRequestRender: Subject<null>;
  public OnMoved: Subject<MoveDelta>;
  public OnMoveEnd: Subject<null>;
  private offsets: [number, number] = [0, 0];
  private changeServe: IChangeService;

  constructor(offsets?: [number, number]) {
    this.OnRequestRender = new Subject();
    this.OnMoved = new Subject();
    this.OnMoveEnd = new Subject();
    if (offsets !== undefined) {
      this.offsets = offsets;
    }
    this.changeServe = ServiceManager.GetService(ServiceType.ChangeService).service;
    this.changeServe.Observer.subscribe(value => {
      this.changeEvent(value);
    })
  }

  public Generate(rect: PIXI.Rectangle) {
    if (Mover.Texture === null) {
      Mover.Texture = PIXI.Texture.from(this.Icon);
    }
    this.Container = new PIXI.Container();
    this.Container.visible = false;
    this.originPoint = rect;
    const sprite = new PIXI.Sprite(Mover.Texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.zIndex = 10;
    sprite.angle = 45;
    this.crossSprite = sprite;
    this.centerSprite();
    this.registerEvents();
    this.Container.addChild(this.crossSprite);
    this.OnRequestRender.next();
  }

  private changeEvent(event: VirtualResolutionChange) {
    switch (event.size) {
      case Sizes.Small:
        this.crossSprite.scale = new PIXI.Point(0.2, 0.2);
        break;
      case Sizes.Medium:
        this.crossSprite.scale = new PIXI.Point(0.5, 0.5);
        break;
      case Sizes.Big:
        this.crossSprite.scale = new PIXI.Point(1, 1);
        break;
    }
  }

  private centerSprite() {
    this.crossSprite.x = this.originPoint.x + (this.originPoint.width / 2);
    this.crossSprite.y = this.originPoint.y + (this.originPoint.height / 2);
    this.crossSprite.x += this.offsets[0];
    this.crossSprite.y += this.offsets[1];
    this.originPosition.set(this.crossSprite.x, this.crossSprite.y);
    this.lastPosition = this.originPosition;
  }

  public recenter(rect: PIXI.Rectangle) {
    this.originPoint = rect;
    this.centerSprite();
  }

  public GetObject(): PIXI.DisplayObject {
    return this.Container;
  }

  public SetVisibility(visible: boolean) {
    this.Container.visible = visible;
    this.OnRequestRender.next();
  }

  // region Init
  private registerEvents() {
    this.crossSprite.on('pointerdown', event1 => {
      this.dragMode = true;
    });
    this.crossSprite.on('pointerup', event1 => {
      this.dragMode = false;
      this.OnMoveEnd.next();
    });
    this.crossSprite.on('pointerupoutside', event1 => {
      this.dragMode = false;
      this.OnMoveEnd.next();
    });
    this.crossSprite.on('pointermove', event1 => {
      if (!this.dragMode) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      if (newPos.x < 0 || newPos.y < 0) {
        return;
      }
      const moveDelta: MoveDelta = {
        x: newPos.x - this.lastPosition.x,
        y: newPos.y - this.lastPosition.y
      };
      this.lastPosition = newPos;
      this.crossSprite.x += moveDelta.x;
      this.crossSprite.y += moveDelta.y;
      this.OnMoved.next(moveDelta);
    });
  }

  // endregion

}

export interface MoveDelta {
  x: number;
  y: number;
}
