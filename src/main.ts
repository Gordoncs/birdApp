import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import wx from 'weixin-js-sdk';
import * as MobileDetect from 'mobile-detect';
import * as $ from 'jquery';
if (environment.production) {
  enableProdMode();
}

// 记录进入app的url，后面微信sdk
if (window['entryUrl'] === '' || window['entryUrl'] === undefined || window['entryUrl'] === null) {
  window['entryUrl'] = location.href.split('#')[0];
}
const md = new MobileDetect(window.navigator.userAgent);
const locationUrl = location.href;
let signatureUrl = '';
// 判断是否为外部跳转过来的页面
if (locationUrl.indexOf('?') > -1) {
  const currUrl = location.href.split('#')[0];
  const canshu = locationUrl.substr(locationUrl.indexOf('?') + 1) || '';
  localStorage.setItem('canshu', canshu);
  signatureUrl = '/signature?redirectUrl=#' + location.href.split('#')[1] + '&currUrl=' + currUrl;
} else {
  const currUrl = location.href.split('#')[0];
  const parms = location.href.split('#')[1] === undefined ? '' : ('#' + location.href.split('#')[1]);
  // alert('配置currUrl:' + currUrl);
  signatureUrl = '/signature?redirectUrl=' + 'g/index.html' + parms + '&currUrl=' + currUrl + parms;
  // alert('配置signatureUrl:' + signatureUrl);
}


const xhr = new XMLHttpRequest();

const configWeixin = function () {
  const platformBrowserDynamics = function() {
    platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
  };
  platformBrowserDynamics();
  const data = JSON.parse(this.response);

  if (data.result.success) {
    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.result.data.appId, // 必填，公众号的唯一标识
      timestamp: data.result.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.result.data.noncestr, // 必填，生成签名的随机串
      signature: data.result.data.signature, // 必填，签名
      jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation', 'uploadImage', 'chooseImage',
        'chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
    });
    wx.ready(function() {
      wx.getLocation({
        success: function (res) {
          localStorage.setItem('latitude', res.latitude);
          localStorage.setItem('longitude', res.longitude);
          setTimeout(function() {
            platformBrowserDynamics();
          }, 1500);
          getNextStoreInfo(res.latitude, res.longitude);
        }
      });
      getbaseMember();
    });
  } else {
    window.location.href = data.result.data;
  }
};
// alert('20181122,0:11版本');
xhr.open('get', signatureUrl);
xhr.addEventListener('load', configWeixin, false);
xhr.send();


/***
 * 获取用户id
 */
const getbaseMember = function() {
  $.ajax({
    url: '/base/member',
    type: 'get',
    success: function(data) {
      if (data['result']) {
        localStorage.setItem('memberInfo', data['data']);
        localStorage.setItem('memberId', data['data']['memberId']);
      } else {
        console.log(data['message']);
      }
    }
  });
};
/***
 * 获取店铺
 */
const getNextStoreInfo = function(latitude, longitude) {
  $.ajax({
    url: '/getNextStoreInfo?latitude=' + latitude + '&longitude=' + longitude,
    type: 'get',
    success: function(data) {
      if (data['result']) {
        localStorage.setItem('storeInfo', JSON.stringify(data['data']));
      } else {
        console.log(data['message']);
      }
    }
  });
};

/**
 * 获取当前用户公共信息
 * 取值方式为：
 *localStorage.setItem("key","value");//存储变量名为key，值为value的变量

 localStorage.key = "value"//存储变量名为key，值为value的变量

 localStorage.getItem("key");//获取存储的变量key的值123

 localStorage.key;//获取存储的变量key的值

 localStorage.removeItem("key")//删除变量名为key的存储变量
 ---------------------
 */

localStorage.setItem('os', md.os());
if (md.os() === 'iOS') {
  localStorage.setItem('osVersion', md.os() + String(md.version('iPhone')));
} else if (md.os() === 'AndroidOS') {
  localStorage.setItem('osVersion', md.os() + String(md.version('Android')));
}
localStorage.setItem('channel', 'wxH5');
localStorage.setItem('language', 'zh_cn');


