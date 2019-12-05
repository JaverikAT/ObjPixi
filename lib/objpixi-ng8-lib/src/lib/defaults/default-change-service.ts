import {IChangeService, VirtualResolutionChange} from '../interface/services/ichange-service';
import {Subject} from 'rxjs';
import {Sizes} from '../interface/enums/sizes.enum';

export class DefaultChangeService implements IChangeService{
  Observer: Subject<VirtualResolutionChange>;
  CurrentSize: Sizes = Sizes.Medium;

  constructor() {
    this.Observer = new Subject<VirtualResolutionChange>();
  }

  ChangeSize(size: Sizes) {
    this.Observer.next({
      size: size
    });
  }

  ResolutionChanged(width: number, height: number) {
    this.setSize(width);
    this.Observer.next({
      size: this.CurrentSize,
      height: height,
      width: width
    });
  }

  private setSize(width: number) {
    if (width >= 336 && width < 600) {
      this.CurrentSize = Sizes.Medium;
    } else if (width < 336) {
      this.CurrentSize = Sizes.Small;
    } else {
      this.CurrentSize = Sizes.Big;
    }
  }

}
