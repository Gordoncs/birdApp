import {AfterContentInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import * as $ from 'jquery';
import wx from 'weixin-js-sdk';
import set = Reflect.set;
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit, AfterContentInit {
  public showWhitchStatus: any = 1;
  public showWhitchStatusArr1 = [];
  public startLimt1 = 0;
  public showWhitchStatusArr2 = [];
  public startLimt2 = 0;
  public showWhitchStatusArr3 = [];
  public startLimt3 = 0;
  public showWhitchStatusArr4 = [];
  public startLimt4 = 0;
  public showWhitchStatusArr5 = [];
  public startLimt5 = 0;
  public daipayItem: any;
  /**
   * 订单状态：0=未付款，1=已付款，2=已完成，9=已取消；null=全部订单列表
   */
    // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private zone: NgZone,  private TongXin: TongxinService) {
  }

  ngOnInit() {
    // this.alertBox.chosepayFn(3000);
    /***
     * 设置title
     */
    this.titleService.setTitle('我的订单');
    this.routerInfo.params.subscribe((params) => this.showWhitchStatus = params['type']);
    this.showWitch(this.showWhitchStatus * 1);
    $(window).unbind('touchend');
    this.getchosepaytypeClickIt();
  }

  ngAfterContentInit() {
    const t = this;
    $(window).on('touchend', function (e) {
      if ($(window).scrollTop() + $(window).height() - $(document).height() >= -100) {
        $('.loadBox').show();
        if (t.showWhitchStatus === 1) {
          t.startLimt1 = t.startLimt1 + 8;
          t.orderGetMemberOrderList('', t.startLimt1, 8, 'scroll');
        }
        if (t.showWhitchStatus === 2) {
          t.startLimt2 = t.startLimt2 + 8;
          t.orderGetMemberOrderList(0, t.startLimt2, 8, 'scroll');
        }
        if (t.showWhitchStatus === 3) {
          t.startLimt3 = t.startLimt3 + 8;
          t.orderGetMemberOrderList(1, t.startLimt3, 8, 'scroll');
        }
        if (t.showWhitchStatus === 4) {
          t.startLimt4 = t.startLimt4 + 8;
          t.orderGetMemberOrderList(2, t.startLimt4, 8, 'scroll');
        }
        if (t.showWhitchStatus === 5) {
          t.startLimt5 = t.startLimt5 + 8;
          t.orderGetMemberOrderList(9, t.startLimt5, 8, 'scroll');
        }
      } else {
        $('.loadBox').fadeOut(300);
      }
    });
    $('.bigBox').css('min-height', $(window).height() + 'px');
    // this.userConfigService.wxConfigFn();
  }

  showWitch(index) {
    this.showWhitchStatus = index;
    this.startLimt1 = 0;
    this.startLimt2 = 0;
    this.startLimt3 = 0;
    this.startLimt4 = 0;
    this.startLimt5 = 0;
    if (index === 1) {
      this.orderGetMemberOrderList('', 0, 8, 'click');
    }
    if (index === 2) {
      this.orderGetMemberOrderList(0, 0, 8, 'click');
    }
    if (index === 3) {
      this.orderGetMemberOrderList(1, 0, 8, 'click');
    }
    if (index === 4) {
      this.orderGetMemberOrderList(2, 0, 8, 'click');
    }
    if (index === 5) {
      this.orderGetMemberOrderList(9, 0, 8, 'click');
    }
  }

  orderGetMemberOrderList(orderStatus, startLimit, pageNumber, form) {
    const memberId = localStorage.getItem('memberId');
    // this.alertBox.load();
    const t = this;
    this.userConfigService.orderGetMemberOrderList(memberId, orderStatus, startLimit, pageNumber)
      .subscribe(data => {
        this.alertBox.close();
        $('.loadBox').fadeOut(500);
        setTimeout(function () {
          if (data['result']) {
            // 现金支付 给detail填充
            for (let i = 0; i < data['data']['list'].length; i++) {
              const item = data['data']['list'][i];
              if (item.orderType === 9) {
                const obj = {
                  amountPrice: null,
                  checkoffNumber: null,
                  count: 1,
                  delBoolean: false,
                  goodsId: null,
                  goodsName: '金额支付',
                  goodsNumber: 1,
                  id: null,
                  insertTime: null,
                  miniPhotoAddr: './assets/image/cashImg.jpg',
                  orderId: null,
                  price: item.orderAmountPayable,
                  skuId: null,
                  skuName: null,
                  skuSpecId: null,
                  skuSpecName: null,
                  skuStyleId: null,
                  skuStyleName: null,
                  transactionPrice: null,
                  type: null,
                  updateTime: null
                };
                item.detail.push(obj);
              }
            }
            if (t.showWhitchStatus === 1) {
              if (form === 'click') {
                t.showWhitchStatusArr1 = data['data']['list'];
              } else {
                for (let i = 0; i < data['data']['list'].length; i++) {
                  t.showWhitchStatusArr1.push(data['data']['list'][i]);
                }
              }
            }
            if (t.showWhitchStatus === 2) {
              if (form === 'click') {
                t.showWhitchStatusArr2 = data['data']['list'];
              } else {
                for (let i = 0; i < data['data']['list'].length; i++) {
                  t.showWhitchStatusArr2.push(data['data']['list'][i]);
                }
              }
            }
            if (t.showWhitchStatus === 3) {
              if (form === 'click') {
                t.showWhitchStatusArr3 = data['data']['list'];
              } else {
                for (let i = 0; i < data['data']['list'].length; i++) {
                  t.showWhitchStatusArr3.push(data['data']['list'][i]);
                }
              }
            }
            if (t.showWhitchStatus === 4) {
              if (form === 'click') {
                t.showWhitchStatusArr4 = data['data']['list'];
              } else {
                for (let i = 0; i < data['data']['list'].length; i++) {
                  t.showWhitchStatusArr4.push(data['data']['list'][i]);
                }
              }
            }
            if (t.showWhitchStatus === 5) {
              if (form === 'click') {
                t.showWhitchStatusArr5 = data['data']['list'];
              } else {
                for (let i = 0; i < data['data']['list'].length; i++) {
                  t.showWhitchStatusArr5.push(data['data']['list'][i]);
                }
              }
            }
          } else {
            t.alertBox.error(data['message']);
          }
        }, 550);
      });
  }

  cancelOrder(item, index, arr) {
    this.alertBox.load();
    this.userConfigService.cancelOrder(item.id).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        arr.splice(index, 1);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  payFn(item) {
    this.daipayItem = item;
    this.alertBox.chosepayFn(item.orderAmountPayable);
    // this.wxpay(item.id);
  }

  wxpay(orderId) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.paymentWechatPrepay(orderId).subscribe(data => {
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
            if (res.errMsg === 'chooseWXPay:ok') {
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': true, 'orderNo': orderId, 'from': 'paysure'}]);
              });
            } else {
              t.zone.run(() => {
                t.router.navigate(['paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure'}]);
              });
            }
          },
          cancel: function (res) {
            t.zone.run(() => {
              t.router.navigate(['paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure'}]);
            });
          }
        });
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  changeURL() {
    window.history.pushState(null, null, '/g/');
  }
  public getchosepaytypeClickIt() {
    this.TongXin.Status4$.subscribe(res => {
      if (res === '微信支付') {
        this.wxpay(this.daipayItem.id);
      } else {
        this.unionPay(this.daipayItem.id);
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
