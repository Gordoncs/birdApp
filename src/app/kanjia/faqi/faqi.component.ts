import {AfterContentInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-faqi',
  templateUrl: './faqi.component.html',
  styleUrls: ['./faqi.component.css']
})
export class FaqiComponent implements OnInit, AfterContentInit {
  public changetitle: any = '帮砍团';
  public activitySetupId: any;
  public detailInfo = {
    skuPic : '',
    skuName : '',
    skuPrice : 0,
    count : '',
    hasBargainMoney : 0,
    percent: 0
  };
  public sharetips = false;
  public skuPic = '';
  public kantop: any;
  public bangkan = [];
  public timer: any;
  public bargainId: any;
  public pages = 1;
  public memberInfo: any =  JSON.parse(localStorage.getItem('memberInfo'));
  public chosetype = '微信支付';
  public subscribe = false;
  public payorderId: any;
  public showxiadanbox = false;
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService, private changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.titleService.setTitle('春鸟科美-砍价发起页');
    this.routerInfo.params.subscribe((params) =>
      this.activitySetupId = params['setid']
    );
    this.bargain();
    this.getchosepaytypeClickIt();
    this.baseMemberInfo();
  }

  ngAfterContentInit() {
    const t = this;
    $('.bangkanboxs').on('touchend', function (e) {
      if ($('.bangkanboxs').scrollTop() + $('.kanfriendmain').height() > $('.kanfriendmain').height()) {
        t.pages = t.pages + 1;
        t.bargainAssistor(t.bargainId, t.pages, 5);
      }
    });
  }

  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }

  // 砍价接口
  bargain() {
    const t = this;
    const bargainSetupId = this.activitySetupId;
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    this.alertBox.load();
    this.userConfigService.bargain(bargainSetupId, bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        t.bargainId = data.data['bargainId'];
        t.bargainDetail(data.data['bargainId']);
        t.bargainTop(data.data['bargainId']);
        t.bargainAssistor(data.data['bargainId'], 1 , 5);
        t.setsharefn();
      } else {
        // this.alertBox.error(data['message']);
        t.bargainId = data.data['bargainId'];
        t.bargainDetail(data.data['bargainId']);
        t.bargainTop(data.data['bargainId']);
        t.bargainAssistor(data.data['bargainId'], 1 , 5);
        t.setsharefn();
      }
    });
  }

  // 砍价详情
  bargainDetail(bargainId: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainDetail(bargainId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.detailInfo = data.data;
        this.skuPic = data.data.skuPic;
        this.detailInfo.percent = data.data.hasBargainMoney / data.data.skuPrice * 100;
        $('.wcline').css('width', this.detailInfo.percent + '%');
        this.countTime(data.data.currentTime, data.data.expireTime);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  // 计算倒计时
  countTime(startTime, endTime) {
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
        t.timer = 0 + '天' + hh + '时' + mm + '分' + ss + '秒';
        startTime++;
      } else if (ts < 0) {
        t.timer = '00:00:00';
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
  // 帮砍团
  bargainAssistor(bargainId: any, pageIndex: any, pageSize: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainAssistor(bargainId, pageIndex, pageSize).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for (let i = 0 ; i < data.data.length ; i ++ ) {
          this.bangkan.push(data.data[i]);
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  // 砍价top20
  bargainTop(bargainId: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainTop(bargainId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.kantop = data.data;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  /**
   * 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
   */
  wxupdateAppMessageShareData(title, desc, link, imgUrl) {
    wx.updateAppMessageShareData({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 设置成功
      }
    });
    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      type: '', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户点击了分享后执行的回调函数
      }
    });
  }
  /**
   * 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
   */
  wxupdateTimelineShareData(title, desc, link, imgUrl) {
    const  witchOS = localStorage.getItem('os');
    wx.updateTimelineShareData({
      title: title, // 分享标题
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 设置成功
      }
    });
    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgUrl, // 分享图标
      success: function () {
        // 用户点击了分享后执行的回调函数
      }
    });
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
    };
    this.router.navigate(['/paysure', {'from': 'kanjia', 'skuIdArr': JSON.stringify(skuId), 'liuchengType': 3}]);
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
      'id': this.bargainId,
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
  goGoodsDetail(item) {
    this.router.navigate(['/goodsdetail', item]);
  }
  setsharefn() {
    const title = '我在砍价做美容，就差你1刀了！帮个忙哦！！';
    const desc = '由春鸟国际为粉丝提供的超值福利，全城覆盖，绝无隐消，无需剁手，遇见更美的你。';
    const link = this.userConfigService.configUrl + '/g/index.html?authCode=' + this.memberInfo.authCode +
      '&guideId=' + localStorage.getItem('memberId') + '&kanjiaid=' + this.bargainId +
      '&frompage=kanjia';
    const imgUrl = 'http://img2.spbird.com/bargain/share.jpg';
    this.wxupdateAppMessageShareData(title, desc, link, imgUrl);
    this.wxupdateTimelineShareData(title, desc, link, imgUrl);
  }
  baseMemberInfo() {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.baseMemberInfo(memberId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.subscribe = data['data'].subscribe;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
