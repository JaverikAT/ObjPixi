import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../igeometry';


export interface IDrawer {
  OnRequestRender: Subject<null>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  /***
   * If set to true, draw-wizard will accept geometry at next click
   */
  AutoAccept: boolean;
  Init();
  OnEvent(event: PIXI.interaction.InteractionEvent);

  /**
   *
   * @return true if points for geometry is valid
   */
  IsValid(): boolean;
  GetGeometry(): IGeometry;
}
