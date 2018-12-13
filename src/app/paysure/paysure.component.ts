import {AfterContentInit, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import * as $ from 'jquery';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-paysure',
  templateUrl: './paysure.component.html',
  styleUrls: ['./paysure.component.css']
})
export class PaysureComponent implements OnInit, AfterContentInit, OnDestroy {
  public skuArr: any;
  public fromData: any = {};
  public paySureInfo: any = {
    'store': {
      'name': ''
    }
  };
  public allMoney: any = 0;
  public order: any = {
    'memberId':  localStorage.getItem('memberId'),
    'storeId': JSON.parse(localStorage.getItem('storeInfo'))['id'],
    'orderRemark': '',
    'subscribePhone': '',
    'linkman': '',
    'discountPriceAmout': null,
  };
  public discounts: any = {
    'id': '',
    'authCode': '',
    'advisorName': ''
  };
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付确认');
    this.routerInfo.params.subscribe((params) =>
      this.fromData = params
    );
    this.skuArr = this.fromData['skuIdArr'];
    if (this.fromData['from'] === 'shopcart') {
      this.checkoutInfo();
    } else if (this.fromData['from'] === 'detail') {
      this.checkoutOutrightPurchase();
    } else if ( this.fromData['from'] === 'newgift') {
      this.checkoutOutrightPurchase();
    } else if ( this.fromData['from'] === 'special') {
      this.checkoutOutrightPurchase();
    } else if ( this.fromData['from'] === 'zero') {
      this.order.discountPriceAmout = 398;
      this.checkoutOutrightPurchase();
    }
  }
  ngAfterContentInit() {
    // this.userConfigService.wxConfigFn();
  }

  ngOnDestroy() {
    /*this.checkoutInfo.unsubscribe();
    this.checkoutOutrightPurchase.unsubscribe();*/
  }
  checkoutInfo() {
    const memberId = localStorage.getItem('memberId');
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    const skuId = this.skuArr;
    this.alertBox.load();
    this.userConfigService.checkoutInfo(memberId, storeId, skuId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.paySureInfo = data['data'];
        this.order.subscribePhone = this.paySureInfo.hisMobile;
        this.order.linkman = this.paySureInfo.hisName;
        this.getAllMoney();
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  checkoutOutrightPurchase() {
    const memberId = localStorage.getItem('memberId');
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    const type = this.fromData['liuchengType'];
    const skuId = JSON.parse(this.skuArr);
    this.alertBox.load();
    this.userConfigService.checkoutOutrightPurchase(memberId, storeId, type, skuId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.paySureInfo = data['data'];
        this.order.subscribePhone = this.paySureInfo.hisMobile;
        this.order.linkman = this.paySureInfo.hisName;
        this.getAllMoney();
      } else {
        this.alertBox.error(data['message']);
        setTimeout(function () {
          history.go(-1);
        }, 2000);
      }
    });
  }
  getAllMoney() {
    let money = 0;
    for (let i = 0; i < this.paySureInfo.cartDetail.length; i++) {
        money = money + this.paySureInfo.cartDetail[i].price * this.paySureInfo.cartDetail[i].number;
    }
    this.allMoney =  money;
  }
  payFn() {
    if (this.order.linkman === '') {
      this.alertBox.error('请填写尊客姓名');
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(this.order.subscribePhone)) && !(/^0\d{2,3}-?\d{7,8}$/.test(this.order.subscribePhone))) {
      this.alertBox.error('请正确填写座机手机号');
      return false;
    }
    let sku = [];
    for (let i = 0; i < this.paySureInfo.cartDetail.length; i++) {
      sku.push(this.paySureInfo.cartDetail[i].id);
    }
    if (this.fromData['from'] === 'special') {
      sku = [];
      sku.push(JSON.parse(this.skuArr)['id']);
    }
    // const type = this.paySureInfo.type;
    const type = this.fromData['liuchengType'];
    const order = this.order;
    const discounts = this.discounts;
    this.alertBox.load();
    this.userConfigService.checkoutAdd(sku, type, order, discounts).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.wxpay(data.data);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  wxpay(orderId) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.paymentWechatPrepay(orderId).
    subscribe(data => {
      console.log(data);
      this.alertBox.close();
      if (data['result']) {
        wx.chooseWXPay({
          timestamp: data.paySignMap.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.paySignMap.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.paySignMap.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.paySignMap.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySignMap.paySign, // 支付签名
          success: function (res) {
            if (res.errMsg === 'chooseWXPay:ok' ) {
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': true, 'orderNo': orderId, 'from': 'paysure'}]);
              });
            } else {
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure' }]);
              });
            }
            t.changeDetectorRef.markForCheck();
            t.changeDetectorRef.detectChanges();
          },
          cancel: function(res) {
            t.zone.run(() => {
              t.router.navigate(['paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure'}]);
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

  sao() {
    const t = this;
    // this.checkoutGetSettleAccountsDiscounts(this.allMoney, {'id': '47', 'authCode': '899149'});
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
        t.discounts.id = data['data']['id'];
        t.discounts.authCode = data['data']['authCode'];
        t.discounts.advisorName = data['data']['advisorName'];
        t.order.discountPriceAmout = data['data']['discountsMoney'];
        t.changeDetectorRef.markForCheck();
        t.changeDetectorRef.detectChanges();
      } else {
        t.alertBox.error(data['message']);
      }
    });
  }
  clearDiscount() {
    this.discounts.id = '';
    this.discounts.authCode = '';
    this.order.discountPriceAmout = null;
  }
  changeURL() {
    window.history.pushState(null, null, '/g/');
  }
  payzeroFn() {
    if (this.order.linkman === '') {
      this.alertBox.error('请填写尊客姓名');
      return false;
    }
    if (!(/^1[3456789]\d{9}$/.test(this.order.subscribePhone)) && !(/^0\d{2,3}-?\d{7,8}$/.test(this.order.subscribePhone))) {
      this.alertBox.error('请正确填写座机手机号');
      return false;
    }
    const storeId =  this.order.storeId;
    const sku = [];
    for (let i = 0; i < this.paySureInfo.cartDetail.length; i++) {
      sku.push(this.paySureInfo.cartDetail[i].id);
    }
    const order = this.order;
    this.alertBox.load();
    this.userConfigService.checkoutAddFreeExperience(sku, storeId, order).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.alertBox.success(data['message']);
        this.router.navigate(['paystatus', {'res': true, 'orderNo': data.data, 'from': 'paysure'}]);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  goback() {
    history.go(-1);
  }
}
