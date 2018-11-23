import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import * as $ from 'jquery';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit, AfterContentInit {
  public  showWhitchStatus: any = 1;
  public  showWhitchStatusArr1 = [];
  public  startLimt1 = 0;
  public  showWhitchStatusArr2 = [];
  public  startLimt2 = 0;
  public  showWhitchStatusArr3 = [];
  public  startLimt3 = 0;
  public  showWhitchStatusArr4 = [];
  public  startLimt4 = 0;
  public  showWhitchStatusArr5 = [];
  public  startLimt5 = 0;

  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('我的订单');
    this.showWitch(this.showWhitchStatus);
  }
  ngAfterContentInit() {
    const t = this;
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        if (t.showWhitchStatus === 1) {
          t.startLimt1 = t.startLimt1 + 8;
          t.orderGetMemberOrderList('', t.startLimt1 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 2) {
          t.startLimt2 = t.startLimt2 + 8;
          t.orderGetMemberOrderList(0, t.startLimt2 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 3) {
          t.startLimt3 = t.startLimt3 + 8;
          t.orderGetMemberOrderList(1, t.startLimt3 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 4) {
          t.startLimt4 = t.startLimt4 + 8;
          t.orderGetMemberOrderList(2, t.startLimt4 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 5) {
          t.startLimt5 = t.startLimt5 + 8;
          t.orderGetMemberOrderList(9, t.startLimt5 , 8 , 'scroll');
        }
      }
    });
    $('.bigBox').css('min-height', $(window).height() + 'px');
    this.changeURL();
  }
  showWitch(index) {
    this.showWhitchStatus = index;
    if (index === 1) {
      this.orderGetMemberOrderList('', 0 , 8 , 'click');
    }
    if (index === 2) {
      this.orderGetMemberOrderList(0, 0 , 8, 'click');
    }
    if (index === 3) {
      this.orderGetMemberOrderList(1, 0 , 8, 'click');
    }
    if (index === 4) {
      this.orderGetMemberOrderList(2, 0 , 8, 'click');
    }
    if (index === 5) {
      this.orderGetMemberOrderList(9, 0 , 8, 'click');
    }
  }

  orderGetMemberOrderList(orderStatus, startLimit, pageNumber, form) {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.orderGetMemberOrderList(memberId, orderStatus, startLimit, pageNumber).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        if (this.showWhitchStatus === 1) {
          if (form === 'click') {
            this.showWhitchStatusArr1 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr1.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 2) {
          if (form === 'click') {
            this.showWhitchStatusArr2 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr2.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 3) {
          if (form === 'click') {
            this.showWhitchStatusArr3 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr3.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 4) {
          if (form === 'click') {
            this.showWhitchStatusArr4 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr4.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 5) {
          if (form === 'click') {
            this.showWhitchStatusArr5 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr5.push(data['data']['list'][i]);
            }
          }
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  cancelOrder(item, index, arr) {
    this.alertBox.load();
    this.userConfigService.cancelOrder(item.id).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        arr.splice(index, 1);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  payFn(item) {
    this.wxpay(item.id);
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
          appId: data.paySignMap.appId,
          timestamp: data.paySignMap.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.paySignMap.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.paySignMap.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.paySignMap.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.paySignMap.paySign, // 支付签名
          success: function (res) {
            if (res.errMsg === 'chooseWXPay:ok' ) {
              t.alertBox.success('支付成功');
              t.router.navigate(['/paystatus', {'res': true, 'orderNo': orderId, 'from': 'paysure'}]);
            } else {
              t.alertBox.success('支付失败');
              t.router.navigate(['/paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure'}]);
            }
          },
          cancel: function(res) {
            t.alertBox.success('取消支付');
            t.router.navigate(['/paystatus', {'res': false, 'orderNo': orderId, 'from': 'paysure'}]);
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
}
