import {AfterContentInit, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild, OnDestroy} from '@angular/core';
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
export class FaqiComponent implements OnInit, AfterContentInit, OnDestroy {
  public changetitle: any = '帮砍团';
  public activitySetupId: any;
  public nomore = false;
  public detailInfo = {
    skuPic : '',
    skuName : '',
    skuPrice : 0,
    count : '',
    hasBargainMoney : 0,
    percent: 0,
    addOrder: 0
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
  public showshuoming = false;
  public tsstatus = true;
  public frombargainId = null;
  public fromdata = null;
  public scrollTimer = null;
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService, private changeDetectorRef: ChangeDetectorRef,
              private zone: NgZone) {
  }

  ngOnInit() {
    this.titleService.setTitle('春鸟科美-砍价发起页');
    this.routerInfo.params.subscribe((params) =>
      this.fromdata = params
    );
    this.activitySetupId = this.fromdata['setid'];
    this.frombargainId = this.fromdata['frombargainId'] || '';
    if (this.frombargainId) {
      this.bargainId = this.frombargainId;
      this.bargainDetail(this.frombargainId);
      this.bargainTop(this.frombargainId);
      this.bargainAssistor(this.frombargainId, 1 , 5);
      this.setsharefn();
      this.baseMemberInfo();
    } else {
      this.bargain();
      this.baseMemberInfo();
    }
    this.getchosepaytypeClickIt();
  }
  ngOnDestroy() {
    const t = this;
    clearInterval(t.scrollTimer);
    t.scrollTimer = null;
  }
  ngAfterContentInit() {
    const t = this;
    let startX, startY, moveEndX, moveEndY;
    $('.bangkanboxs').on('touchstart', function (e) {
      // e.preventDefault();
      startX = e.touches[0].pageX;
      startY = e.touches[0].pageY;
    });
    $('.bangkanboxs').on('touchend', function (e) {
      // e.preventDefault();

      moveEndX = e.changedTouches[0].pageX;

      moveEndY = e.changedTouches[0].pageY;

      const X = moveEndX - startX;

      const Y = moveEndY - startY;
      if ( Y < 0) {
        // console.log($(this).height(), $(this)[0].scrollHeight, $(this)[0].scrollTop);
        // console.log($(this)[0].scrollTop + $(this).height() + 1 >= $(this)[0].scrollHeight);
        if ($(this)[0].scrollTop + $(this).height() + 1 >= $(this)[0].scrollHeight) {
          t.pages = t.pages + 1;
          t.bargainAssistor(t.bargainId, t.pages, 5);
        }
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
    const skuid = this.fromdata.skuid;
    this.alertBox.load();
    this.userConfigService.bargain(bargainSetupId, bargainMemberId, skuid).subscribe(data => {
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
        t.scrollTimer = null;
        t.scrollTimer = setInterval(function () {
          const ts = (data.data.expireTime - data.data.currentTime); // 计算剩余的毫秒数
          const days = (ts) / 1000 / 60 / 60 / 24; // 获取天数
          const daysRound = Math.floor(days);
          const hours = (ts) / 1000 / 60 / 60 - (24 * daysRound); // 获取小时
          const hoursRound = Math.floor(hours);
          const minutes = (ts) / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound); // 获取分钟
          const minutesRound = Math.floor(minutes);
          const seconds = (ts) / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound); //获取秒钟
          const secondsRound = Math.round(seconds);
          if (ts > 0) {
            t.timer = daysRound + '天' + hoursRound + '时' + minutesRound + '分' + secondsRound + '秒';
            data.data.currentTime = data.data.currentTime + 1000;
          } else if (ts < 0) {
            t.timer = '00:00:00';
            clearInterval(t.scrollTimer);
            t.scrollTimer = null;
            t.tsstatus = false;
            t.alertBox.error('活动已结束');
          }
        }, 1000);
      } else {
        this.alertBox.error(data['message']);
      }
    });
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
        if (data.data.length > 0) {
          for (let i = 0 ; i < data.data.length ; i ++ ) {
            this.bangkan.push(data.data[i]);
          }
        } else {
          this.nomore = true;
          // this.alertBox.error('已是最后一条数据咯～');
          $('.bangkanboxs').unbind('touchend');
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
