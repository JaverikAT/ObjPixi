import * as PIXI from 'pixi.js';
import {ScaleDirection} from '../../../interface/enums/scale-direction.enum';
import {IChangeService, VirtualResolutionChange} from '../../../interface/services/ichange-service';
import {ServiceManager, ServiceType} from '../../../services/service-manager';
import {Sizes} from '../../../interface/enums/sizes.enum';


export class ScaleArrow {
  private static Texture: PIXI.Texture =  null;
  private readonly Icon = 'assets/arrows/arrow_down.png';
  private readonly direction: ScaleDirection;
  private changeService: IChangeService;
  public DispObj: PIXI.DisplayObject;

  constructor(direction: ScaleDirection) {
    this.direction = direction;
    this.changeService = ServiceManager.GetService(ServiceType.ChangeService).service;
    this.changeService.Observer.subscribe(value => {
      this.changeEvent(value);
    });
  }

  public Init(posX, posY) {
    if (ScaleArrow.Texture === null) {
      ScaleArrow.Texture = PIXI.Texture.from(this.Icon);
    }
    const sp = new PIXI.Sprite(ScaleArrow.Texture);
    sp.anchor.set(0.5);
    sp.x = posX;
    sp.y = posY;

    switch (this.direction) {
      case ScaleDirection.Up:
        sp.angle = 180;
        break;
      case ScaleDirection.Down:
        break;
      case ScaleDirection.Left:
        sp.angle = 90;
        break;
      case ScaleDirection.Right:
        sp.angle = -90;
        break;
    }
    this.DispObj = sp;
    this.DispObj.interactive = true;
    this.DispObj.buttonMode = true;
  }

  private changeEvent(event: VirtualResolutionChange) {
    switch (event.size) {
      case Sizes.Small:
        this.DispObj.scale = new PIXI.Point(0.2, 0.2);
        break;
      case Sizes.Medium:
        this.DispObj.scale = new PIXI.Point(0.5, 0.5);
        break;
      case Sizes.Big:
        this.DispObj.scale = new PIXI.Point(1, 1);
        break;

    }
  }

}

