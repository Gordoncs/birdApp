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

  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    this.userConfigService.wxConfigFn();
    const t = this;
    wx.ready(function() {
      t.wxupdateAppMessageShareData('测试给朋友', '测试描述', 'http://mp.needai.com/g/index.html?id=1', 'http://img.needai.com/index/jx1.png');
      t.wxupdateTimelineShareData('测试给朋友圈', '测试描述', 'http://mp.needai.com/g/index.html?id=2', 'http://img.needai.com/index/jx1.png');
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
  }
  /**
   * 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
   */
  wxupdateTimelineShareData(title, desc, link, imgUrl) {
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
