import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

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
  luckConShowMoney = 0;
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
  }
  draw() {
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
}
