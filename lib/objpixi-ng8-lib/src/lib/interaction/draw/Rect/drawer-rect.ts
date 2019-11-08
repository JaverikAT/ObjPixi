import * as PIXI from 'pixi.js';
import {IDrawer} from '../../../interface/draw/idrawer';
import {Subject} from 'rxjs';
import {Rect} from '../../../geometries/Rect/rect';
import {IStyleRect} from '../../../styles/istyle-rect';
import {RectInfo} from '../../../geometries/Rect/rect-info';
import {IGeometry} from '../../../interface/igeometry';
import {RectFill} from '../../../geometries/Rect/rect-fill';


export class DrawerRect implements IDrawer {

  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  AutoAccept = true;
  private rect: Rect  | RectFill;
  private dragState = false;
  private startPoint: PIXI.Point;
  private isFill = false;
  defaultLineColor = 0x009688;

  rectStyle: IStyleRect = {
    fillStyle: {
      useFill: true,
      useLine: true,
      fillAlpha: 0.5,
      lineAlpha: 1,
      fillColor: 0x8d6e63,
      lineColor: this.defaultLineColor,
      lineWidth: 2
    }
  };

  constructor(isFill = false) {
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
    this.isFill = isFill;
  }

  // region IDrawer

  Init() {
    const info: RectInfo = {
      coords: {position: new PIXI.Point(), height: 0, width: 0, center: false},
      style: this.rectStyle
    };
    if (this.isFill) {
      this.rect = new RectFill(info, 'RectFill');
    } else {
      this.rect = new Rect(info, 'Rect');
    }
    this.registerEvents();
    this.rect.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'pointerdown') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.rect.GetPoints();
      points[0] = newPos;
      points[1] = newPos;
      this.dragState = true;
      this.rect.UpdatePoints(points);
      this.startPoint = newPos;
    }

    if (event.type === 'pointermove') {
      if (!this.dragState) {
        return;
      }
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.rect.GetPoints();
      points[1].x = newPos.x - this.startPoint.x;
      points[1].y = newPos.y - this.startPoint.y;
      this.rect.UpdatePoints(points);
    }
    if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
      this.dragState = false;
    }
  }

  IsValid(): boolean {
    return !(this.rect.GetPoints()[1].x === 0 || this.rect.GetPoints()[1].y === 0);
  }

  GetGeometry(): IGeometry {
    return this.rect;
  }

  // endregion

  // region events
  private registerEvents() {
    this.rect.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.rect.OnInitialized.subscribe(value => {
      this.rect.EnableControls(false);
      this.OnInitialized.next(value);
    });
  }
  // endregion
}
