import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-effectluck',
  templateUrl: './effectluck.component.html',
  styleUrls: ['./effectluck.component.css']
})
export class EffectluckComponent implements OnInit, AfterContentInit {
  public showWitch: any = 1;
  public effectList = [];
  public luckList = [];
  public userInfo: any;
  public influenceStart = 0;
  public activityStart = 0;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('我的实力');
    this.routerInfo.params.subscribe((params) => this.userInfo = params);
    this.choseit(this.userInfo.showtype);
    this.getMemberInfluenceList(0, 8);
    this.getMemberActivityRecordList(0, 12);
  }
  ngAfterContentInit() {
    const t = this;
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        if (t.showWitch === 1) {
          t.influenceStart = t.influenceStart + 8;
          t.getMemberInfluenceList(t.influenceStart, 8);
        }
        if (t.showWitch === 2) {
          t.activityStart = t.activityStart + 12;
          t.getMemberActivityRecordList(t.activityStart, 12);
        }
      }
    });
  }
  choseit(index) {
    this.showWitch = index;
  }

  /***
   * 会员影响力列表接口
   */
  getMemberInfluenceList(startLimit, pageNumber) {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.getMemberInfluenceList(memberId, startLimit, pageNumber).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for (let i = 0; i < data['data']['list'].length ; i++) {
          this.effectList.push(data['data']['list'][i]);
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  /**
   * 会员幸运指数列表接口
   */
  getMemberActivityRecordList(startLimit, pageNumber) {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.getMemberActivityRecordList(memberId, startLimit, pageNumber).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for (let i = 0; i < data['data']['list'].length ; i++) {
          this.luckList.push(data['data']['list'][i]);
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
