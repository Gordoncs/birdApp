import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';
import {MyindexComponent} from '../myindex/myindex.component';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.css']
})
export class OrderdetailComponent implements OnInit {
  public hhh: any;
  public mmm: any;
  public sss: any;
  public orderId: any;
  public detailInfo: any;
  public userInfo: any;
  public iscomplete = false;
  public allServers = 0;
  public useServers = 0;
  /**
   * 订单状态：0=未付款，1=已付款，2=已完成，9=已取消；null=全部订单列表
   */
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('订单详情');

    // const countDown_time = '00:29:59';
    // this.count_down(countDown_time);
    this.routerInfo.params.subscribe((params) => this.orderId = params['orderId']);
    this.orderGetOrderInfo(this.orderId);
    this.getMemberIndexInfo();
  }
  count_down(countDown_time) {
    const that = this;
    const time = countDown_time.split(':');
    let hhh = parseInt(time[0], 10);
    let mmm = parseInt(time[1], 10);
    let sss = parseInt(time[2], 10);
    that.sss = (sss < 10) ? '0' + sss : sss;
    that.mmm = (mmm < 10) ? '0' + mmm : mmm;
    that.hhh = (hhh < 10) ? '0' + hhh : hhh;
    const Interval = setInterval(function () {
      if (sss > 0) {
        sss = sss - 1;
      } else {
        console.log('时间到')
        clearInterval(Interval);
      }
      if (sss === 0) {
        if (mmm > 0) {
          mmm--;
          sss = 59;
        }
        if (mmm === 0 && hhh > 0) {
          hhh--;
          sss = 59;
          mmm = 59;
        }
      }
      that.sss = (sss < 10) ? '0' + sss : sss;
      that.mmm = (mmm < 10) ? '0' + mmm : mmm;
      that.hhh = (hhh < 10) ? '0' + hhh : hhh;
    }, 1000);
  }
  orderGetOrderInfo(orderId) {
    this.alertBox.load();
    this.userConfigService.orderGetOrderInfo(orderId)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.detailInfo = data['data'];
          this.detailInfo.consumeVerificationQRcode = 'data:image/jpeg;base64,' + this.detailInfo.consumeVerificationQRcode;
          let allServers = 0;
          let useServers = 0;
          if (this.detailInfo.orderStatus === 1) {
            for (let i = 0 ; i < this.detailInfo.detail.length ; i++) {
              allServers = allServers + this.detailInfo.detail[i].goodsNumber * 1;
              useServers = useServers + (this.detailInfo.detail[i].checkoffNumber || 0) * 1;
            }
            this.allServers = allServers;
            this.useServers = useServers;
          }
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
  payFn() {
    this.wxpay(this.detailInfo.orderNo);
  }
  wxpay(orderNo) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.paymentWechatPrepay(orderNo).
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
              t.router.navigate(['/paystatus', {'res': true, 'orderNo': orderNo, 'from': 'paysure'}]);
            } else {
              t.alertBox.success('支付失败');
              t.router.navigate(['/paystatus', {'res': false, 'orderNo': orderNo, 'from': 'paysure'}]);
            }
          },
          cancel: function(res) {
            t.alertBox.success('取消支付');
            t.router.navigate(['/paystatus', {'res': false, 'orderNo': orderNo, 'from': 'paysure'}]);
          }
        });
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
