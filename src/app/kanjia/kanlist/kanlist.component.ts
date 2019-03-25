import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-kanlist',
  templateUrl: './kanlist.component.html',
  styleUrls: ['./kanlist.component.css']
})
export class KanlistComponent implements OnInit {

  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  public kanlist: any;
  public showxiadanbox = false;
  public chosetype = '微信支付';
  public detailInfo: any;
  public payorderId: any;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService,
              private zone: NgZone, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.bargainPersonal();
    // this.getchosepaytypeClickIt();
  }
  // 砍价详情
  bargainPersonal() {
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainPersonal(bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for ( let i = 0 ; i < data.data.length; i++) {
          this.countTime(data.data[i].currentTime, data.data[i].expireTime, data.data[i]);
        }
        this.kanlist = data.data;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  // 计算倒计时
  countTime(startTime, endTime, obj) {
    // let startTime = 1508428800; // 开始时间
    // const endTime = 1508428860; // 结束时间
    const t = this;
    setInterval(function () {
      const ts = (endTime - startTime); // 计算剩余的毫秒数
      // console.log(ts);
      let dd = parseInt((ts / 60 / 60 / 24).toString(), 10); // 计算剩余的天数
      let hh = parseInt((ts / 60 / 60 % 24).toString(), 10); // 计算剩余的小时数
      let mm = parseInt((ts / 60 % 60).toString(), 10); // 计算剩余的分钟数
      let ss = parseInt((ts % 60).toString(), 10); // 计算剩余的秒数
      dd = t.checkTime(dd);
      hh = t.checkTime(hh);
      mm = t.checkTime(mm);
      ss = t.checkTime(ss);
      if (ts > 0) {
        obj.timer = 0 + '天' + hh + '时' + mm + '分' + ss + '秒';
        startTime++;
      } else if (ts < 0) {
        obj.timer = '00:00:00';
        location.reload();
      }
    }, 1000);
  }

  checkTime(i) {
    if (i <= 10) {
      i = '0' + i;
    }
    return i;
  }
  back() {
    history.go(-1);
  }
  goGoodsDetail(item) {
    this.router.navigate(['/goodsdetail', item]);
  }
  paychoseFn() {
    this.alertBox.chosepayFn(1);
    // this.wxpay(item.id);
  }
  payFn() {
    const skuId = {
      'id': this.detailInfo['skuId'],
      'goodsId': this.detailInfo['goodsId'],
      'skuSpecId': this.detailInfo['skuSpecId'] || 0,
      'skuStyleId': this.detailInfo['skuStyleId'] || 0,
      'goodsType': this.detailInfo['goodsType'],
      'bargainId': this.detailInfo['id']
    };
    this.router.navigate(['/paysure', {'from': 'kanjia', 'skuIdArr': JSON.stringify(skuId),
      'liuchengType': 3}]);
    return;
    const sku = [this.detailInfo['skuId']];
    const type = 3;
    const order = {
      'memberId':  localStorage.getItem('memberId'),
      'storeId': JSON.parse(localStorage.getItem('storeInfo'))['id'],
      'orderRemark': '',
      'subscribePhone': '',
      'linkman': '',
      'discountPriceAmout': null,
    };
    const discounts = {
      'id': this.detailInfo.id,
      'authCode': ''
    };
    this.alertBox.load();
    this.userConfigService.checkoutAdd(sku, type, order, discounts).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        if (data.data.payment) {
          this.payorderId = data.data.orderId;
          // this.paychoseFn();
          this.router.navigate(['orderdetail', {id: data.data.orderId}]);
        } else {
          this.zone.run(() => {
            this.router.navigate(['paystatus', {'res': true, 'orderNo': data.data.orderId, 'from': 'paysure'}]);
          });
        }
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
  public getchosepaytypeClickIt() {
    this.TongXin.Status4$.subscribe(res => {
      this.chosetype = res;
      if ( this.chosetype === '微信支付') {
        this.wxpay(this.payorderId);
      } else {
        this.unionPay(this.payorderId);
      }
    });
  }
}
