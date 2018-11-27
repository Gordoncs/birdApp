import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';
import wx from 'weixin-js-sdk';

@Component({
  selector: 'app-sharedpage',
  templateUrl: './sharedpage.component.html',
  styleUrls: ['./sharedpage.component.css']
})
export class SharedpageComponent implements OnInit {
  form: any;
  img: any = '';
  memberInfo: any =  JSON.parse(localStorage.getItem('memberInfo'));
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    const t = this;
    this.routerInfo.params.subscribe((params) => this.form = params['from']);
    if (this.form === 'newergif') {
      this.shareNewmember();
      const title = '抽空体验一下，颜值需要呵护，一小时容颜焕发';
      const desc = '春鸟科美超值体验活动，等你来体验，打造无纹面庞，精致神曲，水水嫩嫩，尽享魅力人生。';
      const link = 'https://mp.needai.com/g/index.html?authCode=' + this.memberInfo.authCode +
        '&guideId=' + localStorage.getItem('memberId') +
        '&frompage=newergif';
      const imgUrl = this.memberInfo.headimgurl;
      t.wxupdateAppMessageShareData(title, desc, link, imgUrl);
      t.wxupdateTimelineShareData(title, desc, link, imgUrl);
    } else if (this.form === 'newerdec') {
      this.shareZore();
      const title = this.memberInfo.nickname + '已经为您买单，科技美容免费选，速戳！！';
      const desc = '逆龄抗衰、塑形体雕、净体脱毛等15项任选其一，单已买，就差您来了。';
      const link = 'https://mp.needai.com/g/index.html?authCode=' + this.memberInfo.authCode +
        '&guideId=' + localStorage.getItem('memberId') +
        '&frompage=newerdec';
      const imgUrl = this.memberInfo.headimgurl;
      t.wxupdateAppMessageShareData(title, desc, link, imgUrl);
      t.wxupdateTimelineShareData(title, desc, link, imgUrl);
    }
  }

  /**
   * 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
   */
  wxupdateAppMessageShareData(title, desc, link, imgUrl) {
    const  witchOS = localStorage.getItem('os');
    if (witchOS === 'AndroidOS') {
      // （即将废弃）
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
        }
      });
    } else {
      wx.updateAppMessageShareData({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
          // 设置成功
        }
      });
    }
  }
  /**
   * 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
   */
  wxupdateTimelineShareData(title, desc, link, imgUrl) {
    const  witchOS = localStorage.getItem('os');
    if (witchOS === 'AndroidOS') {
      // （即将废弃）
      wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
        }
      });
    } else {
      wx.updateTimelineShareData({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
          // 设置成功
        }
      });
    }
  }
  shareNewmember() {

    this.alertBox.load();
    this.userConfigService.shareNewmember().
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.img = data['data']['imgUrl'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  shareZore() {
    const t = this;
    this.alertBox.load();
    this.userConfigService.shareZore().
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.img = data['data']['imgUrl'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
