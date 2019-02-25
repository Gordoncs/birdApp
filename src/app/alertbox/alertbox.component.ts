import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
  styleUrls: ['./alertbox.component.css']
})
export class AlertboxComponent implements OnInit {
  whichStatus: any = 'loading';
  alertMessage: any = '努力加载中...';
  alertShow = false;
  luckDrawShow = false;
  luckConShow = false;
  drawerrorShow = false;
  chosepay = false;
  luckConShowMoney = 0;
  orderAmountPayable = 0;
  public chosetype = '微信';
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
  }
  load() {
    this.whichStatus = 'loading';
    this.alertMessage = '努力加载中...';
    this.alertShow = true;
  }
  error(message) {
    this.whichStatus = 'error';
    this.alertMessage = message;
    this.alertShow = true;
  }
  success(message) {
    this.whichStatus = 'success';
    this.alertMessage = message;
    this.alertShow = true;
  }
  close() {
    this.alertShow = false;
    this.luckDrawShow = false;
    this.luckConShow = false;
    this.drawerrorShow = false;
    this.chosepay = false;
    $('#gifimg').attr('src', '');
  }
  draw() {
    $('#gifimg').attr('src', './assets/image/openbox.gif');
    this.luckDrawShow = true;
  }
  drawerror() {
    this.drawerrorShow = true;
  }
  drawResult(num) {
    this.luckConShow = true;
    this.luckConShowMoney = num;
  }
  sureFn() {
    this.close();
    this.TongXin.luckDawClick(1);
  }
  goshareFn() {
    this.close();
    this.TongXin.goshareClick(1);
  }
  chosepayFn(orderAmountPayable) {
    this.orderAmountPayable = orderAmountPayable * 1;
    if ((this.orderAmountPayable) <= 3000) {
      this.chosetype = '微信';
    } else {
      this.chosetype = '银联';
    }
    this.chosepay = true;
  }
  chosepaysureFn() {
    this.close();
    this.TongXin.chosepayClick(this.chosetype);
  }
}
