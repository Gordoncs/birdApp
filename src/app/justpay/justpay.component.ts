import {AfterContentInit, ChangeDetectorRef, Component, Directive, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
export class JustpayComponent implements OnInit, AfterContentInit, OnDestroy {
  orderInfo: any;
  allMoney: number ;
  discountPriceAmout = null;
  discounts = {
    'id' : '',
    'authCode' : '',
    'advisorName' : ''
  };
  storeInfo = JSON.parse(localStorage.getItem('storeInfo'));
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.titleService.setTitle('支付确认');
    this.routerInfo.params.subscribe((params) => this.orderInfo = params);
    this.allMoney = this.orderInfo.allMoney;
  }
  ngAfterContentInit() {
    $('#moneyInput').focus();
    this.allMoney = null;
    // this.userConfigService.wxConfigFn();
  }
  ngOnDestroy() {

  }
  cashpay() {
    const t = this;
    const order = {
      'memberId': localStorage.getItem('memberId'),
      'storeId': JSON.parse(localStorage.getItem('storeInfo'))['id'],
      'orderPriceAmount': this.allMoney,
      'discountPriceAmout': this.discountPriceAmout,
    };
    const discounts = this.discounts;
    this.alertBox.load();
    this.userConfigService.checkoutAddCashOrder(order, discounts).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.wxpay(data.data);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  sao() {
    if (this.allMoney <= 0) {
      this.alertBox.error('请输入金额再扫码');
      return;
    }
    const t = this;
    // this.checkoutGetSettleAccountsDiscounts(this.allMoney, {'id': '67', 'authCode': '235868'}, this);
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        const discounts = {
          'id' : res.resultStr.split('#')[0],
          'authCode' : res.resultStr.split('#')[2],
        };
        t.checkoutGetSettleAccountsDiscounts(t.allMoney, discounts, t);
      }
    });
  }
  checkoutGetSettleAccountsDiscounts(allMoney, discounts, t) {
    t.alertBox.load();
    t.userConfigService.checkoutGetSettleAccountsDiscounts(allMoney, discounts).
    subscribe(data => {
      t.alertBox.close();
      if (data['result']) {
        t.discounts = {
          'id' : data['data']['id'],
          'authCode' : data['data']['authCode'],
          'advisorName' : data['data']['advisorName']
        };
        t.discountPriceAmout = data['data']['discountsMoney'];
        t.changeDetectorRef.markForCheck();
        t.changeDetectorRef.detectChanges();
      } else {
        t.alertBox.error(data['message']);
      }
    });
  }
  clearDiscount() {
    this.discounts = {
      'id' : '',
      'authCode' : '',
      'advisorName' : ''
    };
    this.discountPriceAmout = null;
  }
  changeURL() {
    window.history.pushState(null, null, '/g/');
  }
  goback() {
    history.go(-1);
  }
  wxpay(orderId) {
    const t = this;
    this.alertBox.load();
    const order = {
      'memberId': localStorage.getItem('memberId'),
      'storeId': JSON.parse(localStorage.getItem('storeInfo'))['id'],
      'orderPriceAmount': this.allMoney,
      'discountPriceAmout': this.discountPriceAmout,
    };
    const discounts = this.discounts;
    this.userConfigService.paymentWechatPrepay(orderId).
    subscribe(data => {
      console.log(data);
      this.alertBox.close();
      if (data['result']) {
        wx.chooseWXPay({
          timestamp: data.paySignMap.timeStamp + '', // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
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
}
