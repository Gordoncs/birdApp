import {Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../../shared/user-config.service';
import {TongxinService} from '../../shared/tongxin.service';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-indec',
  templateUrl: './indec.component.html',
  styleUrls: ['./indec.component.css']
})
export class IndecComponent implements OnInit {
  public imgs: any;
// 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    this.titleService.setTitle('春鸟科美-砍价介绍页');
    this.bargainGoodsList();
  }
  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }
  bargainGoodsList() {
    this.alertBox.load();
    this.userConfigService.bargainGoodsList().
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.imgs = data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  back() {
    history.go(-1);
  }
}
