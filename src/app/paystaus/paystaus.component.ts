import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-paystaus',
  templateUrl: './paystaus.component.html',
  styleUrls: ['./paystaus.component.css']
})
export class PaystausComponent implements OnInit, AfterContentInit {
  public status = 'false';
  public fromData: any = {};
  public userInfo: any = {};
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }
  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付结果');
    this.routerInfo.params.subscribe((params) => this.fromData = params);
    this.status = this.fromData.res;
    console.log(this.fromData);
    this.getMemberIndexInfo();
  }
  ngAfterContentInit() {
    // this.userConfigService.wxConfigFn();
    // this.pushHistory();
    const  t = this;
    window.addEventListener('popstate', function(e) {
      t.router.navigate(['orderdetail', {id: t.fromData.orderNo}]);
    });
  }
  pay() {
    if (this.fromData.from === 'justpay') {
      this.justpaypay(JSON.parse(this.fromData.order), JSON.parse(this.fromData.discounts));
    }
    if (this.fromData.from === 'paysure') {
      this.paysurepay(this.fromData.orderNo);
    }
  }
  paysurepay(orderId) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.paymentWechatPrepay(orderId).
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
              t.router.navigate(['paystatus', {'res': true, 'orderNo': orderId, 'from': 'paysure'}]);
            } else {
              t.router.navigate(['paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure' }]);
            }
          },
          cancel: function(res) {
            t.router.navigate(['paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure'}]);
          }
        });
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  justpaypay(order, discounts) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.checkoutAddCashOrder(order, discounts).
    subscribe(data => {
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
              t.router.navigate(['paystatus', {'res': true, 'order': JSON.stringify(order),
                'discounts': JSON.stringify(discounts), 'from': 'justpay'}]);
            } else {
              t.router.navigate(['paystatus', {'res': false, 'order': JSON.stringify(order),
                'discounts': JSON.stringify(discounts), 'from': 'justpay'}]);
            }
          },
          cancel: function(res) {
            t.router.navigate(['paystatus', {'res': false, 'order': JSON.stringify(order),
              'discounts': JSON.stringify(discounts), 'from': 'justpay'}]);
          }
        });
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  getMemberIndexInfo() {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.getMemberIndexInfo(memberId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.userInfo = data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  changeURL() {
    window.history.pushState(null, null, '/g/');
  }
  pushHistory() {
    const state = {
      title: 'myCenter',
      url: '__SELF__'
    };
    window.history.pushState(state, state.title, state.url);
  }
}
