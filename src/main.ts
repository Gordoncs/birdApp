import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import wx from 'weixin-js-sdk';

if (environment.production) {
  enableProdMode();
}
wx.config({
  debug: true,
  appId: '你的appId',
  timestamp: 'timestamp',
  nonceStr: 'nonceStr',
  signature: 'signature',
  jsApiList: [
    'chooseImage'
  ],
  complete: function () {
    console.log('complete');
  }
});
wx.ready(function () {
  console.log(1);
  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需
  // 要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用不需要放在ready函数中。
});
wx.error(function (res) {
  console.log(res);
  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
});


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

