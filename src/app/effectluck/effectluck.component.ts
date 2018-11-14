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
    this.getMemberInfluenceList(1, 8);
    this.getMemberActivityRecordList(1, 8);
  }
  ngAfterContentInit() {
    $('body').scroll(function() {
      alert();
      // var $this =$(this),
      //   viewH =$(this).height(),//可见高度
      //   contentH =$(this).get(0).scrollHeight,//内容高度
      //   scrollTop =$(this).scrollTop();//滚动高度
      // //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
      // if(scrollTop/(contentH -viewH)>=0.95){ //到达底部100px时,加载新内容
      //   // 这里加载数据..
      // }
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
        this.effectList = data['data'];
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
        this.luckList = data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
