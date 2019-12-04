import { Subject} from 'rxjs';
import {DefaultChangeService} from '../defaults/default-change-service';

export enum ServiceType {
  ChangeService
}

export interface IService {
  type: ServiceType;
  service: any;
}

export class ServiceManager {

  public static Observer: Subject<IService> = new Subject<IService>();
  private static Services: IService[] = [];
  private static initialized = false;

  public static Init() {
    if (ServiceManager.initialized) {
      return;
    }
    ServiceManager.Observer = new Subject<IService>();
    ServiceManager.Services = [{
      service: new DefaultChangeService(),
      type: ServiceType.ChangeService
    }];
    ServiceManager.initialized = true;
  }

  public static RegisterService(service: IService, trigger: boolean = false) {
    ServiceManager.Services.push(service);
    if (trigger) {
      ServiceManager.Observer.next(service);
    }
  }

  public static GetService(type: ServiceType): IService  | undefined {
     for (let i = 0; i < ServiceManager.Services.length; i++) {
       if (ServiceManager.Services[i].type === type) {
         return ServiceManager.Services[i];
       }
     }
     return undefined;
  }

}
