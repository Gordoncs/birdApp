import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import * as $ from 'jquery';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-justpay',
  templateUrl: './justpay.component.html',
  styleUrls: ['./justpay.component.css']
})
export class JustpayComponent implements OnInit {
  orderNo = '15419898898701503418';
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    this.titleService.setTitle('支付确认');
  }
  wxpay() {
    console.log(this.orderNo);
    this.alertBox.load();
    this.userConfigService.paymentWechatPrepay(this.orderNo).
    subscribe(data => {
      console.log(data);
      this.alertBox.close();
      if (data['result']) {
        wx.chooseWXPay({
          appId: data.paySignMap.appId,
          timestamp: data.paySignMap.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.paySignMap.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.paySignMap.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.paySignMap.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySignMap.paySign, // 支付签名
          success: function (res) {
            if (res.errMsg === 'chooseWXPay:ok' ) {
              this.alertBox.success('支付成功');
              this.router.navigate(['/paystatus', true]);
            } else {
              this.alertBox.success('支付失败');
              this.router.navigate(['/paystatus', false]);
            }
          },
          cancel: function(res) {
            this.alertBox.success('取消支付');
            this.router.navigate(['/paystatus', false]);
          }
        });
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
