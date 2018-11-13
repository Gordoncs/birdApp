import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TongxinService {
  public carNum = 0;
  constructor() {
    console.log('Hello TongxinProvider Provider');
  }
  // 实例化主题Subject类对象
  private Source = new Subject<any>();
  public Status$ = this.Source.asObservable();
  // 定义数据传递函数
  // 购物车图标数字变化通信
  public cartNum(data) {
    this.carNum = data;
    this.Source.next(this.carNum);
  }
}
