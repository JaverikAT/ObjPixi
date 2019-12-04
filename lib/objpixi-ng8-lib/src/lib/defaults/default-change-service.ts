import {IChangeService, VirtualResolutionChange} from '../interface/services/ichange-service';
import {Subject} from 'rxjs';
import {Sizes} from '../interface/enums/sizes.enum';

export class DefaultChangeService implements IChangeService{
  Observer: Subject<VirtualResolutionChange>;

  constructor() {
    this.Observer = new Subject<VirtualResolutionChange>();
  }

  ChangeSize(size: Sizes) {
    this.Observer.next({
      size: size
    });
  }

}
