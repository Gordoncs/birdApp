import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params , Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {TongxinService} from './shared/tongxin.service';
import {UserConfigService} from './shared/user-config.service';
import wx from 'weixin-js-sdk';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private TongXin: TongxinService, private userConfigService: UserConfigService) {}
  public url: any ;
  public canShowNav = true ;
  public cartNum = 0 ;
  ngOnInit(): void {
    /***
     * 判断当前实时url
     */
    this.router.events.pipe(
      filter((event: Event ) => event instanceof NavigationEnd)
    ).subscribe(x => {
      $(window).scrollTop(0);
      this.userConfigService.wxConfigFn();
      this.url = x['url'];
      if (this.url.indexOf('goodsdetail') > -1 || this.url.indexOf('paysure') > -1 || this.url.indexOf('upload') > -1 ||
        this.url.indexOf('hexiao') > -1 || this.url.indexOf('myorder') > -1 || this.url.indexOf('justpay') > -1
        || this.url.indexOf('specialgoods') > -1 || this.url.indexOf('newergif') > -1 || this.url.indexOf('newerdec') > -1
        || this.url.indexOf('newercome') > -1 || this.url.indexOf('sharedpage') > -1 || this.url.indexOf('luckdraw') > -1
        || this.url.indexOf('qiangpage') > -1 || this.url.indexOf('kjfaqi') > -1 || this.url.indexOf('kjdec') > -1
        || this.url.indexOf('kjcome') > -1) {
        this.canShowNav = false;
      } else {
        this.canShowNav = true;
      }
      if ((this.url.indexOf('sharedpage') < 0)) {
        // console.log(this.url);
        const canshu = this.url.replace('/', '');
        // console.log(canshu);
        this.userConfigService.wxBaseShare(canshu);
      }
    });
    /***
     * 获取购物车数字
     */
    this.getCartNum();
    const  t = this;
    setTimeout(function() {
      t.cartGetCartDetailNumber();
    }, 1000);
  }
  cartGetCartDetailNumber() {
    const memberId = localStorage.getItem('memberId');
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    this.userConfigService.cartGetCartDetailNumber(memberId, storeId)
      .subscribe((data) => {
        if (data['result']) {
          this.cartNum = data['data'];
        }
      });
  }
  /***
   * 监控购物车数字变化
   */
  public getCartNum() {
    this.TongXin.Status$.subscribe(res => {
      this.cartGetCartDetailNumber();
    });
  }
  // /***
  //  * 获取用户信息
  //  */
  // getbaseMember() {
  //   this.userConfigService.baseMember()
  //     .subscribe((data) => {
  //       if (data['result']) {
  //         localStorage.setItem('memberInfo', data['data']);
  //         localStorage.setItem('memberId', data['data']['memberId']);
  //         this.cartGetCartDetailNumber();
  //       } else {
  //         console.log(data['message']);
  //       }
  //     });
  // }
}
