import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TongxinService {
  constructor() {
    console.log('Hello TongxinProvider Provider');
  }
  public carNum = 0;
  public luckDawClickNum = 0;
  // 实例化主题Subject类对象
  private Source = new Subject<any>();
  public Status$ = this.Source.asObservable();
  // 实例化主题Subject类对象
  private Source2 = new Subject<any>();
  public Status2$ = this.Source2.asObservable();
  // 定义数据传递函数
  // 购物车图标数字变化通信
  public cartNum(data) {
    this.carNum = data;
    this.Source.next(this.carNum);
  }
  // 抽奖弹框点击确认时传输
  public luckDawClick(data) {
    this.luckDawClickNum = data;
    this.Source2.next(this.luckDawClickNum);
  }
}
