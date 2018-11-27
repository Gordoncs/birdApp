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
const platformBrowserDynamics = function() {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
};
platformBrowserDynamics();
// ios记录进入app的url，后面微信sdk
if (window['entryUrl'] === '' || window['entryUrl'] === undefined || window['entryUrl'] === null) {
  window['entryUrl'] = location.href.split('#')[0];
}
const md = new MobileDetect(window.navigator.userAgent);
const locationUrl = location.href;
// 判断是否为外部跳转过来的页面
if (locationUrl.indexOf('?') > -1) {
  const currUrl = location.href.split('#')[0];
  const canshu = locationUrl.substr(locationUrl.indexOf('?') + 1) || '';
  localStorage.setItem('canshu', canshu);
  $.ajax({
    url: '/signature',
    dataType: 'json',
    type: 'get',
    data: {
      'redirectUrl': 'g/index.html',
      'currUrl': currUrl,
    },
    success: function(data) {
      if (data.result.success) {
        wx.config({
          debug: false,
          appId: data.result.data.appId,
          timestamp: data.result.data.timestamp,
          nonceStr: data.result.data.noncestr,
          signature: data.result.data.signature,
          jsApiList: ['scanQRCode', 'getLocation', 'uploadImage', 'chooseImage',
            'chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData']
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
    }
  });
} else {
  const currUrl = location.href.split('#')[0];
  const parms = location.href.split('#')[1] === undefined ? '' : ('#' + location.href.split('#')[1]);
  // alert('开始进入配置redirectUrl:' + 'g/index.html' + parms);
  // alert('开始进入配置currUrl:' + currUrl);
  $.ajax({
    url: '/signature',
    dataType: 'json',
    type: 'get',
    data: {
      'redirectUrl': 'g/index.html' + parms,
      'currUrl': currUrl,
    },
    success: function(data) {
      if (data.result.success) {
        wx.config({
          debug: false,
          appId: data.result.data.appId,
          timestamp: data.result.data.timestamp,
          nonceStr: data.result.data.noncestr,
          signature: data.result.data.signature,
          jsApiList: ['scanQRCode', 'getLocation', 'uploadImage', 'chooseImage',
            'chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData']
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
    }
  });
}


/***
 * 获取用户id
 */
const getbaseMember = function() {
  const savedata = {};
  if (localStorage.getItem('canshu')) {
    const canshu = localStorage.getItem('canshu').split('&');
    for (let i = 0; i < canshu.length; i++) {
      const temp = canshu[i].split('=');
      if (temp.length < 2) {
        savedata[temp[0]] = '';
      } else {
        savedata[temp[0]] = temp[1];
      }
    }
    localStorage.setItem('fromPage', savedata['frompage']);
  }
  $.ajax({
    url: '/base/member',
    type: 'get',
    data: savedata,
    success: function(data) {
      if (data['result']) {
        localStorage.setItem('memberInfo', JSON.stringify(data['data']));
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


