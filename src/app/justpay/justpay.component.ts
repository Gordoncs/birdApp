import {AfterContentInit, ChangeDetectorRef, Component, Directive, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import * as $ from 'jquery';
import wx from 'weixin-js-sdk';
import {TongxinService} from '../shared/tongxin.service';
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
  orderid: number;
  storeInfo = JSON.parse(localStorage.getItem('storeInfo'));
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone, private TongXin: TongxinService) { }

  ngOnInit() {
    this.titleService.setTitle('支付确认');
    this.routerInfo.params.subscribe((params) => this.orderInfo = params);
    this.allMoney = this.orderInfo.allMoney;
    this.getchosepaytypeClickIt();
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
        this.alertBox.chosepayFn(this.allMoney);
        this.orderid = data.data;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  public getchosepaytypeClickIt() {
    this.TongXin.Status4$.subscribe(res => {
      if (res === '微信支付') {
        this.wxpay(this.orderid);
      } else {
        this.unionPay(this.orderid);
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
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': true, 'order': JSON.stringify(order),
                  'discounts': JSON.stringify(discounts), 'orderNo': orderId, 'from': 'justpay'}]);
              });
            } else {
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': false, 'order': JSON.stringify(order),
                  'discounts': JSON.stringify(discounts), 'orderNo': orderId, 'from': 'justpay'}]);
              });
            }
            t.changeDetectorRef.markForCheck();
            t.changeDetectorRef.detectChanges();
          },
          cancel: function(res) {
            t.zone.run(() => {
              t.router.navigate(['paystatus', {'res': false, 'order': JSON.stringify(order),
                'discounts': JSON.stringify(discounts), 'orderNo': orderId, 'from': 'justpay'}]);
            });
            t.changeDetectorRef.markForCheck();
            t.changeDetectorRef.detectChanges();
          }
        });
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  unionPay(orderId) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.unionPay(orderId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        // window.location.href = data.data;
        const url = data.data.frontConsumeUrl;
        const oldjson = data.data.paySgin;
        const postparms = [];
        for (const key of Object.keys(oldjson)) {
          const json = {'name': key, 'value': oldjson[key]};
          postparms.push(json);
        }
        setTimeout(function () {
          t.fromPost(url, postparms);
        }, 500);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  /**
   * post模拟提交表单
   */
  fromPost(URL, PARAMTERS) {
    const t = this;
    t.alertBox.load();
    // 创建form表单
    const temp_form = document.createElement('form');
    temp_form.action = URL;
    // 如需打开新窗口，form的target属性要设置为'_blank'
    // temp_form.target = '_blank';
    temp_form.method = 'post';
    temp_form.style.display = 'none';
    // 添加参数
    for (const item of  Object.keys(PARAMTERS)) {
      const opt = document.createElement('input');
      opt.name = PARAMTERS[item].name;
      opt.value = PARAMTERS[item].value;
      temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    // return;
    // 提交数据
    setTimeout(function () {
      // t.alertBox.close();
      temp_form.submit();
    }, 500);
  }
}
