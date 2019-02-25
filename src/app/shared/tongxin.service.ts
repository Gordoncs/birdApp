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
  public goshareClickNum = 0;
  public chosepayval;
  // 实例化主题Subject类对象
  private Source = new Subject<any>();
  public Status$ = this.Source.asObservable();
  // 实例化主题Subject类对象
  private Source2 = new Subject<any>();
  public Status2$ = this.Source2.asObservable();
  // 实例化主题Subject类对象
  private Source3 = new Subject<any>();
  public Status3$ = this.Source3.asObservable();
  // 定义数据传递函数
  // 实例化主题Subject类对象
  private Source4 = new Subject<any>();
  public Status4$ = this.Source4.asObservable();
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
  // 抽奖弹框没有次数点击弹框分享按钮时传输
  public goshareClick(data) {
    this.goshareClickNum = data;
    this.Source3.next(this.goshareClickNum);
  }
  // 未付款列表 去支付弹框状态传输返回
  public chosepayClick(data) {
    this.chosepayval = data;
    this.Source4.next(this.chosepayval);
  }
}
