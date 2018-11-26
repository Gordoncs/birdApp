import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import {JustpayComponent} from '../justpay/justpay.component';

@Injectable({
  providedIn: 'root'
})
export class PaystatusGuard implements CanDeactivate<JustpayComponent> {
  constructor(private router: Router) { }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   if (localStorage.getItem('isBecomeOrder')) {
  //     return false;
  //   } else {
  //     this.router.navigate(['newergif', {'goodsId': 5}]);
  //     localStorage.setItem('isBecomeOrder', '');
  //   }
  // }
  canDeactivate(component: JustpayComponent, currentRoute: ActivatedRouteSnapshot
                , currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('isBecomeOrder') === 'ss') {
      return true;
    } else {
      return false;
    }
  }
}
