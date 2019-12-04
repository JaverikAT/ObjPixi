import {Sizes} from '../enums/sizes.enum';
import {Subject} from 'rxjs';

export interface VirtualResolutionChange {
  width?: number;
  height?: number;
  size: Sizes;
}

export interface IChangeService {
  Observer: Subject<VirtualResolutionChange>;

  ChangeSize(size: Sizes);
}
