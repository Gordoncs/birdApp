import {AfterContentInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
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
  public detailInfo: any ;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService,
              private changeDetectorRef: ChangeDetectorRef, private zone: NgZone) { }
  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付结果');
    this.routerInfo.params.subscribe((params) => this.fromData = params);
    this.status = this.fromData.res;
    if ( this.status === 'true' ) {
      this.orderGetOrderInfo(this.fromData.orderNo);
    }
    this.getMemberIndexInfo();
    localStorage.setItem('isBecomeOrder', 'ss');
    this.TongXin.cartNum(1);
    this.getchosepaytypeClickIt();
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }
  ngAfterContentInit() {
    // this.userConfigService.wxConfigFn();
    // this.pushHistory();
    // const  t = this;
    // window.addEventListener('popstate', function(e) {
    //   console.log(e);
    //   // t.router.navigate(['orderdetail', {id: t.fromData.orderNo}]);
    // });
  }
  public getchosepaytypeClickIt() {
    this.TongXin.Status4$.subscribe(res => {
      if (res === '微信支付') {
        this.paysurepay(this.fromData.orderNo);
      } else {
        this.unionPay(this.fromData.orderNo);
      }
    });
  }
  pay() {
    this.alertBox.chosepayFn(1);
    // if (this.fromData.from === 'uniony') {
    //   this.unionPay(this.fromData.orderNo);
    // } else {
    //   this.paysurepay(this.fromData.orderNo);
    // }

    // if (this.fromData.from === 'justpay') {
    //   this.justpaypay(JSON.parse(this.fromData.order), JSON.parse(this.fromData.discounts));
    // }
    // if (this.fromData.from === 'paysure') {
    //   this.paysurepay(this.fromData.orderNo);
    // }
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
              t.fromData  = {'res': 'true', 'orderNo': orderId, 'from': 'paysure'};
              t.status = t.fromData.res;
              t.orderGetOrderInfo(t.fromData.orderNo);
              window.history.pushState('', '', 'paystatus;res=true;orderNo=' + orderId + ';from=paysure');
              t.changeDetectorRef.markForCheck();
              t.changeDetectorRef.detectChanges();
            } else {
              t.fromData  = {'res': 'false', 'orderNo': orderId, 'from': 'paysure'};
              t.status = t.fromData.res;
              window.history.pushState('', '', 'paystatus;res=false;orderNo=' + orderId + ';from=paysure');
              t.changeDetectorRef.markForCheck();
              t.changeDetectorRef.detectChanges();
            }
          },
          cancel: function(res) {
            t.fromData  = {'res': 'false', 'orderNo': orderId, 'from': 'paysure'};
            t.status = t.fromData.res;
            window.history.pushState('', '', 'paystatus;res=false;orderNo=' + orderId + ';from=paysure');
            t.changeDetectorRef.markForCheck();
            t.changeDetectorRef.detectChanges();
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
              localStorage.setItem('isBecomeOrder', 'ss');
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': true, 'order': JSON.stringify(order),
                  'discounts': JSON.stringify(discounts), 'from': 'justpay'}]);
              });
            } else {
              localStorage.setItem('isBecomeOrder', 'ss');
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': false, 'order': JSON.stringify(order),
                  'discounts': JSON.stringify(discounts), 'from': 'justpay'}]);
              });
            }
          },
          cancel: function(res) {
            localStorage.setItem('isBecomeOrder', 'ss');
            t.zone.run(() => {
              t.router.navigate(['paystatus', {'res': false, 'order': JSON.stringify(order),
                'discounts': JSON.stringify(discounts), 'from': 'justpay'}]);
            });
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
  go398() {
    localStorage.setItem('isBecomeOrder', 'ss');
    this.zone.run(() => {
      this.router.navigate(['newerdec', {'nums': this.userInfo.presentRemnant}]);
    });
  }
  gogift() {
    localStorage.setItem('isBecomeOrder', 'ss');
    this.zone.run(() => {
      this.router.navigate(['newergif', {'goodsId': 5}]);
    });
  }
  godetail() {
    localStorage.setItem('isBecomeOrder', 'ss');
    this.zone.run(() => {
      this.router.navigate(['orderdetail', {id: this.fromData.orderNo}]);
    });
  }
  goback() {
    localStorage.setItem('isBecomeOrder', 'ss');
    this.zone.run(() => {
      this.router.navigate(['index']);
    });
  }

  orderGetOrderInfo(orderId) {
    this.userConfigService.orderGetOrderInfo(orderId)
      .subscribe((data) => {
        if (data['result']) {
          this.detailInfo = data['data'];
          this.detailInfo.consumeVerificationQRcode = 'data:image/jpeg;base64,' + this.detailInfo.consumeVerificationQRcode;
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
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
