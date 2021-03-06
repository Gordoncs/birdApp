import {AfterContentInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class ComeComponent implements OnInit, AfterContentInit, OnDestroy {
  public changetitle: any = '帮砍团';
  public iskan = false;
  public nomore = false;
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
    activitySetupId: '',
    skuId: '',
    addOrder: 0
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
  public subscribe = false;
  public showshuoming = false;
  public scrollTimer = null;
  public tsstatus = true;
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
    localStorage.setItem('canshu', '');
    localStorage.setItem('fromPage', '');
    this.bargainId = this.fromJson['kanjiaid'];
    this.bargainDetail(this.fromJson['kanjiaid']);
    this.bargainTop(this.fromJson['kanjiaid']);
    this.bargainAssistor(this.fromJson['kanjiaid'], 1 , 5);
    this.bargainGoodsList();
    this.baseMemberInfo();
  }
  ngOnDestroy() {
    const t = this;
    clearInterval(t.scrollTimer);
    t.scrollTimer = null;
  }
  ngAfterContentInit() {
    const t = this;
    let startX, startY, moveEndX, moveEndY;
    $('.bangkanboxs2').on('touchstart', function (e) {
      // e.preventDefault();
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    });
    $('.bangkanboxs2').on('touchend', function (e) {
      // e.preventDefault();

      moveEndX = e.changedTouches[0].pageX;

      moveEndY = e.changedTouches[0].pageY;

      const X = moveEndX - startX;

      const Y = moveEndY - startY;
      if ( Y > 0) {
        if ($(this)[0].scrollTop + $(this).height() + 1 >= $(this)[0].scrollHeight) {
          t.pages = t.pages + 1;
          t.bargainAssistor(t.bargainId, t.pages, 5);
        }
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
        t.scrollTimer = null;
        t.scrollTimer = setInterval(function () {
          const ts = (data.data.expireTime - data.data.currentTime); // 计算剩余的毫秒数
          const days = (ts) / 1000 / 60 / 60 / 24; // 获取天数
          const daysRound = Math.floor(days);
          const hours = (ts) / 1000 / 60 / 60 - (24 * daysRound); // 获取小时
          const hoursRound = Math.floor(hours);
          const minutes = (ts) / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound); // 获取分钟
          const minutesRound = Math.floor(minutes);
          const seconds = (ts) / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound); //获取秒钟
          const secondsRound = Math.round(seconds);
          if (ts > 0) {
            t.timer = daysRound + '天' + hoursRound + '时' + minutesRound + '分' + secondsRound + '秒';
            data.data.currentTime = data.data.currentTime + 1000;
          } else if (ts < 0) {
            t.timer = '00:00:00';
            clearInterval(t.scrollTimer);
            t.scrollTimer = null;
            t.tsstatus = false;
            t.alertBox.error('活动已结束');
          }
        }, 1000);
      } else {
        this.alertBox.error(data['message']);
      }
    });
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
        if (data.data.length > 0) {
          for (let i = 0; i < data.data.length; i++) {
            this.bangkan.push(data.data[i]);
          }
        } else {
          this.nomore = true;
          // this.alertBox.error('已是最后一条数据咯～');
          $('.bangkanboxs2').unbind('touchend');
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
  // 帮砍一刀
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
        this.bargainDetail(this.fromJson['kanjiaid']);
        this.bargainTop(this.fromJson['kanjiaid']);
        this.bangkan = [];
        this.bargainAssistor(this.fromJson['kanjiaid'], 1 , 5);
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
  baseMemberInfo() {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.baseMemberInfo(memberId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.subscribe = data['data'].subscribe;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
