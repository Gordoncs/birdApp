import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-faqi',
  templateUrl: './faqi.component.html',
  styleUrls: ['./faqi.component.css']
})
export class FaqiComponent implements OnInit, AfterContentInit {
  public changetitle: any = '帮砍团';
  public activitySetupId: any;
  public detailInfo = {
    skuPic : '',
    skuName : '',
    skuPrice : 0,
    count : '',
    hasBargainMoney : 0,
  };
  public skuPic = '';
  public kantop: any;
  public bangkan = [];
  public timer: any;
  public bargainId: any;
  public pages = 1;
  public memberInfo: any =  JSON.parse(localStorage.getItem('memberInfo'));
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) {
  }

  ngOnInit() {
    this.titleService.setTitle('春鸟科美-砍价发起页');
    this.routerInfo.params.subscribe((params) =>
      this.activitySetupId = params['setid']
    );
    this.bargain();

    // const title = this.memberInfo.nickname + '已经为您买单，科技美容免费选，速戳！！';
    // const desc = '逆龄抗衰、塑形体雕、净体脱毛等15项任选其一，单已买，就差您来了。';
    // const link = this.userConfigService.configUrl + '/g/index.html?authCode=' + this.memberInfo.authCode +
    //   '&guideId=' + localStorage.getItem('memberId') +
    //   '&frompage=newerdec';
    // const imgUrl = this.memberInfo.headimgurl;
    // this.wxupdateAppMessageShareData(title, desc, link, imgUrl);
    // this.wxupdateTimelineShareData(title, desc, link, imgUrl);
  }

  ngAfterContentInit() {
    const t = this;
    $('.bangkanboxs').on('touchend', function (e) {
      if ($('.bangkanboxs').scrollTop() + $('.kanfriendmain').height() >= $('.kanfriendmain').height()) {
        t.pages = t.pages + 1;
        t.bargainAssistor(t.bargainId, t.pages, 5);
      }
    });
  }

  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }

  // 砍价接口
  bargain() {
    const t = this;
    const bargainSetupId = this.activitySetupId;
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    this.alertBox.load();
    this.userConfigService.bargain(bargainSetupId, bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        t.bargainId = data.data['bargainId'];
        t.bargainDetail(data.data['bargainId']);
        t.bargainTop(data.data['bargainId']);
        t.bargainAssistor(data.data['bargainId'], 1 , 5);
      } else {
        this.alertBox.error(data['message']);
        setTimeout(function () {
          // t.router.navigate(['/index']);
        }, 3000);
      }
    });
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
        t.timer = dd + '天' + hh + '时' + mm + '分' + ss + '秒';
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

  /**
   * 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
   */
  wxupdateAppMessageShareData(title, desc, link, imgUrl) {
    wx.updateAppMessageShareData({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 设置成功
      }
    });
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户点击了分享后执行的回调函数
      }
    });
  }
  /**
   * 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
   */
  wxupdateTimelineShareData(title, desc, link, imgUrl) {
    const  witchOS = localStorage.getItem('os');
    wx.updateTimelineShareData({
      title: title, // 分享标题
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 设置成功
      }
    });
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户点击了分享后执行的回调函数
      }
    });
  }
}
