import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js';
import {Rect} from '../../geometries/Rect/rect';
import {GeoEvent} from '../../geometries/base-geo';
import {ScaleArrow} from '../../interaction/scaling/objects/scale-arrow';
import {MatGridTile} from '@angular/material';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {IGeometry} from '../../interface/igeometry';
import {Ellipse} from '../../geometries/Ellipse/ellipse';
import {PolyLine} from '../../geometries/Poly/Polyline/poly-line';
import {PolyGon} from '../../geometries/Poly/Polygon/poly-gon';
import {Line} from '../../geometries/Line/line';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, AfterViewInit {

  @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
  @ViewChild('tilePixi', {static: false}) tilePixi: MatGridTile;
  App: PIXI.Application;
  Renderer: PIXI.Renderer;
  Stage: PIXI.Container;
  myArrow: ScaleArrow;
  ScaleValue: number;
  ScalingRect: BasicScaler = new BasicScaler();
  Geometries: Array<IGeometry> = [];

  private ratio: number;
  private winWidth = 800;
  private winHeight = 600;

  constructor() {
  }

  static mapRange(val, inMin, inMax, outMin, outMax): number {
    return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  ngOnInit() {
    this.Renderer = PIXI.autoDetectRenderer({width: 800, height: 600});
    this.App = new PIXI.Application({width: 800, height: 600});
    this.ratio = 800 / 600;
    this.Stage = new PIXI.Container();
    this.Stage.x = 0;
    this.Stage.y = 0;
    this.Stage.width = 800;
    this.Stage.height = 600;
    this.ScalingRect.OnRequestRender.subscribe(() => {
      this.ForceRender();
    });
  }

  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.Renderer.view);
    this.Renderer.render(this.Stage);
    // this.App.stage.addChild(this.Stage);
  }

  onTileResize(event) {
    // @ts-ignore
    const w = this.tilePixi._element.nativeElement.offsetWidth;
    // @ts-ignore
    const h = this.tilePixi._element.nativeElement.offsetHeight;

    if (w / h >= this.ratio) {
      this.winWidth = window.innerHeight * this.ratio;
      this.winHeight = window.innerHeight;
    } else {
      this.winWidth = window.innerWidth;
      this.winHeight = window.innerWidth / this.ratio;
    }
    if (this.winWidth > 800) {
      this.winWidth = 800;
    }
    if (this.winHeight > 600) {
      this.winHeight = 600;
    }
    this.App.renderer.resize(this.winWidth, this.winHeight);
    this.Renderer.view.style.width = this.winWidth + 'px';
    this.Renderer.view.style.height = this.winHeight + 'px';
    this.Renderer.render(this.Stage);
  }


  onAddCircle() {
    const g = new PIXI.Graphics();
    g.beginFill(0xe91e63);
    g.drawCircle(400, 300, 100);
    g.endFill();
    this.onAddObject(g);
  }

  onAddRect() {
    const newRect = new Rect({width: 100, height: 100, center: true, position: new PIXI.Point(400, 300)});
    this.registerGeoEvents(newRect);
    newRect.Init();
    this.Geometries.push(newRect);
  }

  onAddEllipse() {
    const newEllipse = new Ellipse({width: 100, height: 120, center: true, position: new PIXI.Point(400, 300)});
    this.registerGeoEvents(newEllipse);
    newEllipse.Init();
    this.Geometries.push(newEllipse);
  }

  onAddLine() {
    const line = new Line({
      p1: new PIXI.Point(200, 300),
      p2: new PIXI.Point(400, 300),
      lineWidth: 3,
      pointRadius: 6
    });
    this.registerGeoEvents(line);
    line.Init();
    this.Geometries.push(line);
  }

  onAddPolyLine() {
    const midX = 400;
    const midY = 300;
    const offset = 100;
    const polyLine = new PolyLine({
      lineWidth: 2, pointRadius: 6, points: [
        new PIXI.Point(midX - offset, midY - offset),
        new PIXI.Point(midX + offset, midY - offset),

        new PIXI.Point(midX + offset, midY + offset),
        new PIXI.Point(midX - offset, midY + offset)
      ]
    });
    this.registerGeoEvents(polyLine);
    polyLine.Init();
    this.Geometries.push(polyLine);
  }

  onAddPolygon() {
    const midX = 400;
    const midY = 300;
    const offset = 100;
    const polygon = new PolyGon({
      lineWidth: 2, pointRadius: 6, points: [
        new PIXI.Point(midX - offset, midY - offset),
        new PIXI.Point(midX + offset, midY - offset),

        new PIXI.Point(midX + offset, midY + offset),
        new PIXI.Point(midX - offset, midY + offset)
      ]
    });
    this.registerGeoEvents(polygon);
    polygon.Init();
    this.Geometries.push(polygon);
  }

  private registerGeoEvents(geo: IGeometry) {
    geo.OnRequestRender.subscribe({
      next: value => {
        this.ForceRender();
      }
    });
    geo.OnInitialized.subscribe({
      next: value => {
        this.onAddObject(value);
      }
    });
    geo.OnInteraction.subscribe({
      next: value => {
        this.onObjectEvent(value);
      }
    });
  }

  onAddArrow() {
    this.myArrow = new ScaleArrow(ScaleDirection.Left);
    this.myArrow.Init(100, 100);
    this.onAddObject(this.myArrow.DispObj);
  }


  onScaleStage() {
    this.Stage.scale.set(this.ScaleValue);
  }

  onAddObject(obj: PIXI.DisplayObject) {
    this.Stage.addChild(obj);
    this.Renderer.render(this.Stage);
    setTimeout(() => {
      this.Renderer.render(this.Stage);
    }, 10);
  }

  ForceRender() {
    this.Renderer.render(this.Stage);
  }


  onObjectEvent(event: GeoEvent) {
    console.log('Event from [%s]- %s type: %s', event.target.GetId(), event.target.GetName(), event.event.type);

    switch (event.event.type) {
      case 'click':
        this.clearExcept(event.target.GetId());
        break;
    }
  }

  private clearExcept(id: string) {
    this.Geometries.filter(value => value.GetId() !== id).forEach(value => {
      value.ClearSelection();
    });
  }

}
