import { Subject } from 'rxjs';
import { OnDestroy, OnInit } from '@angular/core';

export function UnsubscribeOnDestroy(): ClassDecorator {
  return function(constructor: any) {
    const onInit = 'ngOnInit';
    const ngOnInit = constructor.prototype[onInit];
    const onDestroy = 'ngOnDestroy';
    const ngOnDestroy = constructor.prototype[onDestroy];

    constructor.prototype[onInit] = function(...args: any) {
      this['destroy$'] = new Subject<boolean>();

      if (ngOnInit) {
        ngOnInit.apply(this, args);
      }
    };

    constructor.prototype[onDestroy] = function(...args: any) {
      if (this['destroy$'] && this['destroy$'].length) {
        this['destroy$'].next(true);
        this['destroy$'].unsubscribe();
      }

      if (ngOnDestroy) {
        ngOnDestroy.apply(this, args);
      }
    };
  };
}

export interface IUnsubscribeOnDestroy extends OnInit, OnDestroy {
  destroy$: Subject<boolean>;
}
