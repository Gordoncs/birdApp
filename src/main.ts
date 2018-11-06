import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import wx from 'weixin-js-sdk';
import * as MobileDetect from 'mobile-detect';
if (environment.production) {
  enableProdMode();
}
const md = new MobileDetect(window.navigator.userAgent);

const xhr = new XMLHttpRequest();
const currUrl = 'http://' + window.location.host + '/g/index.html';
const signatureUrl = '/signature?redirectUrl=g/index.html&currUrl=' + currUrl;
const configWeixin = function () {
  const data = JSON.parse(this.response);
  if (data.result.success) {
    console.log(data) ;
    alert('appId:' + data.result.data.appId);
    alert('timestamp:' + data.result.data.timestamp);
    alert('nonceStr:' + data.result.data.noncestr);
    alert('signature:' + data.result.data.signature);
    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: data.result.data.appId, // 必填，公众号的唯一标识
      timestamp: data.result.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.result.data.noncestr, // 必填，生成签名的随机串
      signature: data.result.data.signature, // 必填，签名
      jsApiList: ['checkJsApi', 'scanQRCode', 'getLocation', 'uploadImage', 'chooseImage'] // 必填，需要使用的JS接口列表
    });
    wx.ready(function() {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          wx.uploadImage({
            localId: localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function ( rest ) {
              alert('返回图片的服务器端ID:' + rest.serverId);
            }
          });
        }
      });
    });
  } else {
    window.location.href = data.result.data;
  }
};
xhr.open('get', signatureUrl);
xhr.addEventListener('load', configWeixin, false);
xhr.send();

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

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


