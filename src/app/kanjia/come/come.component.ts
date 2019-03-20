import {AfterContentInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-come',
  templateUrl: './come.component.html',
  styleUrls: ['./come.component.css']
})
export class ComeComponent implements OnInit, AfterContentInit {
  public changetitle: any = '帮砍团';
  public iskan = false;
  public fromJson = {};
  public detailInfo = {
    headIconAddr : '',
    memberNick : '',
    skuPic : '',
    skuName : '',
    skuPrice : 0,
    count : '',
    hasBargainMoney : 0,
    percent: 0,
    activitySetupId: ''
  };
  public skuPic = '';
  public kantop: any;
  public bangkan = [];
  public timer: any;
  public bargainId: any;
  public pages = 1;
  public memberInfo: any =  JSON.parse(localStorage.getItem('memberInfo'));
  public helpmoney = 0;
  public imgs: any;
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService, private changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) { }

  ngOnInit() {
    this.titleService.setTitle('春鸟科美-砍价分享落地页');
    this.routerInfo.params.subscribe((params) =>
      this.fromJson = params
    );
    localStorage.setItem('kanjiainfo', '');
    this.bargainDetail(this.fromJson['kanjiaid']);
    this.bargainTop(this.fromJson['kanjiaid']);
    this.bargainAssistor(this.fromJson['kanjiaid'], 1 , 5);
    this.bargainGoodsList();
  }
  ngAfterContentInit() {
    const t = this;
    $('.bangkanboxs2').on('touchend', function (e) {
      if ($('.bangkanboxs2').scrollTop() + $('.kanfriendmain').height() > $('.kanfriendmain').height()) {
        t.pages = t.pages + 1;
        t.bargainAssistor(t.bargainId, t.pages, 5);
      }
    });
  }
  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }
  // 砍价详情
  bargainDetail(bargainId: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainDetail(bargainId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.detailInfo = data.data;
        this.skuPic = data.data.skuPic;
        this.detailInfo.percent = data.data.hasBargainMoney / data.data.skuPrice * 100;
        $('.wcline').css('width', this.detailInfo.percent + '%');
        this.countTime(data.data.currentTime, data.data.expireTime);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  // 计算倒计时
  countTime(startTime, endTime) {
    // let startTime = 1508428800; // 开始时间
    // const endTime = 1508428860; // 结束时间
    const t = this;
    setInterval(function () {
      const ts = (endTime - startTime); // 计算剩余的毫秒数
      // console.log(ts);
      let dd = parseInt((ts / 60 / 60 / 24).toString(), 10); // 计算剩余的天数
      let hh = parseInt((ts / 60 / 60 % 24).toString(), 10); // 计算剩余的小时数
      let mm = parseInt((ts / 60 % 60).toString(), 10); // 计算剩余的分钟数
      let ss = parseInt((ts % 60).toString(), 10); // 计算剩余的秒数
      dd = t.checkTime(dd);
      hh = t.checkTime(hh);
      mm = t.checkTime(mm);
      ss = t.checkTime(ss);
      if (ts > 0) {
        t.timer = 0 + '天' + hh + '时' + mm + '分' + ss + '秒';
        startTime++;
      } else if (ts < 0) {
        t.timer = '00:00:00';
        location.reload();
      }
    }, 1000);
  }

  checkTime(i) {
    if (i <= 10) {
      i = '0' + i;
    }
    return i;
  }
  back() {
    history.go(-1);
  }
  // 帮砍团
  bargainAssistor(bargainId: any, pageIndex: any, pageSize: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainAssistor(bargainId, pageIndex, pageSize).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for (let i = 0 ; i < data.data.length ; i ++ ) {
          this.bangkan.push(data.data[i]);
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  // 砍价top20
  bargainTop(bargainId: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainTop(bargainId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.kantop = data.data;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  // 帮砍团
  bargainHelp() {
    const bargainId = this.fromJson['kanjiaid'];
    const bargainMemberId = this.fromJson['faqimemberid'] || 7;
    const assistorMemberId = localStorage.getItem('memberId') || 3;
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainHelp(bargainId, bargainMemberId, assistorMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.iskan = true;
        this.helpmoney = data.data.bargainMoney;
      } else {
        this.alertBox.error(data['message']);
      }
    });
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
  goGoodsDetail(item) {
    this.router.navigate(['/goodsdetail', item]);
  }
}
