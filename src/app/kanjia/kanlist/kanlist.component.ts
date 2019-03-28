import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild, OnDestroy} from '@angular/core';
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
export class KanlistComponent implements OnInit, OnDestroy {

  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  public kanlist: any;
  public kanlists: any;
  public showxiadanbox = false;
  public chosetype = '微信支付';
  public detailInfo: any;
  public payorderId: any;
  pageTimer = {};
  one$;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService,
              private zone: NgZone, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    const t = this;
    this.bargainPersonal();
  }
  ngOnDestroy() {
    this.one$.unsubscribe();
    const t = this;
    for ( let i = 0 ; i < t.kanlist.length; i++) {
      if (t.kanlist[i].interobj) {
        clearInterval(t.kanlist[i].interobj);
        t.kanlist[i].interobj = null;
      }
    }
  }
  // 砍价详情
  bargainPersonal() {
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    const t = this;
    this.alertBox.load();
    this.one$ = this.userConfigService.bargainPersonal(bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.kanlist = data.data;
        for ( let i = 0 ; i < t.kanlist.length; i++) {
          t.kanlist[i].interobj = null;
          t.kanlist[i].interobj = setInterval(() => {
            const ts = (t.kanlist[i].expireTime - t.kanlist[i].currentTime); // 计算剩余的毫秒数
            const days = (ts) / 1000 / 60 / 60 / 24; // 获取天数
            const daysRound = Math.floor(days);
            const hours = (ts) / 1000 / 60 / 60 - (24 * daysRound); // 获取小时
            const hoursRound = Math.floor(hours);
            const minutes = (ts) / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound); // 获取分钟
            const minutesRound = Math.floor(minutes);
            const seconds = (ts) / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound); //获取秒钟
            const secondsRound = Math.round(seconds);
            if (ts > 0) {
              t.kanlist[i].timer = daysRound + '天' + hoursRound + '时' + minutesRound + '分' + secondsRound + '秒';
              t.kanlist[i].currentTime = t.kanlist[i].currentTime + 1000;
            } else if (ts < 0) {
              t.kanlist[i].timer = '活动时间已结束';
              clearInterval(t.kanlist[i].interobj);
              t.kanlist[i].interobj = null;
            }
          }, 1000);
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
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
