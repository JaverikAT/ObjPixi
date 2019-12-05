import {Sizes} from '../enums/sizes.enum';
import {Subject} from 'rxjs';

export interface VirtualResolutionChange {
  width?: number;
  height?: number;
  size: Sizes;
}

export interface IChangeService {
  Observer: Subject<VirtualResolutionChange>;
  CurrentSize: Sizes;

  ChangeSize(size: Sizes);
  ResolutionChanged(width: number, height: number);
}
