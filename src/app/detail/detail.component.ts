import {Component, OnInit, AfterViewInit, ViewChild, AfterContentInit} from '@angular/core';
import Swiper from 'node_modules/swiper/dist/js/swiper.min.js';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {TongxinService} from '../shared/tongxin.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit, AfterContentInit {
  public  showWhitchStatus: any = 1;
  public  detailInfo: any = {};
  public  goodsId: any;
  public  fromGoods: any = {};
  public  priceArr: any = [];
  public  choseSkuSpecId: any = [];
  public  choseSkuStyleId: any = [];
  public  choseSku: any = '';
  public cartNum = 0 ;
  public fixed = false;
  public showgokanjia = true;
  public allDomHeight: any = 0;
  public kanlist: any = [];
  public showxiadanbox = false;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }
  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟科美-精选产品');
    this.routerInfo.params.subscribe((params) =>
     this.fromGoods = params
    );
    this.goodsId = this.fromGoods['goodsId'];
    this.getGoodsInfo(this.goodsId, JSON.parse(localStorage.getItem('storeInfo'))['id']);
    this.cartGetCartDetailNumber();
    this.bargainPersonal();
  }

  ngAfterViewInit(): void {
    this.scrollFn();
  }
  ngAfterContentInit() {
    const t = this;
    t.allDomHeight = $('.bigBox').offset().top;
    $(window).scroll(function() {
      if ($(window).scrollTop() > t.allDomHeight) {
        t.fixed = true;
      } else {
        t.fixed = false;
      }
    });
  }
  showWitch(index, event) {
    this.showWhitchStatus = index;
    const hrefTop = $('.boxShowlist' + index).offset().top;
    $(window).scrollTop(hrefTop - 100);
  }

  /**
   * 获取详情页数据
   */
  getGoodsInfo(goodsId: any, shopId: any) {
    this.alertBox.load();
    this.userConfigService.getGoodsInfo(goodsId, shopId)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.detailInfo = data['data'];
          this.detailInfo['goodsInfo']['mainPhotoAddr'] = (this.detailInfo['goodsInfo']['mainPhotoAddr']).split(',');
          this.detailInfo['goodsInfo']['serviceCase'] = (this.detailInfo['goodsInfo']['serviceCase']).split(',');
          this.detailInfo['goodsInfo']['serviceInfo'] = (this.detailInfo['goodsInfo']['serviceInfo']).split(',');
          this.detailInfo['goodsInfo']['scienceInfo'] = (this.detailInfo['goodsInfo']['scienceInfo']).split(',');
          this.detailInfo['goodsInfo']['qaInfo'] = (this.detailInfo['goodsInfo']['qaInfo']).split(',');
          this.detailInfo['goodsInfo']['commitmentInfo'] = (this.detailInfo['goodsInfo']['commitmentInfo']).split(',');
          for (let i = 0; i < this.detailInfo.skuSpec.length; i++) {
            this.detailInfo.skuSpec[i].ischecked = false;
          }
          for (let i = 0; i < this.detailInfo.skuStyle.length; i++) {
            this.detailInfo.skuStyle[i].ischecked = false;
          }
          if (this.detailInfo.skuStyle.length === 1) {
            this.detailInfo.skuStyle[0].ischecked = true;
            this.choseSkuStyleId = this.detailInfo.skuStyle[0].id;
          }
          for (let i = 0; i < this.detailInfo.sku.length; i++) {
            this.priceArr.push(this.detailInfo.sku[i]['price']);
          }
          this.priceArr.sort(function (a, b) {
            return a - b;
          });
          if (this.fromGoods.skuSpecId) {
            this.fromChoseit();
          }
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  selIt(item, arr, type) {
    // if (this.fromGoods.skuSpecId) {
    //   return false;
    // }
    for (let i = 0; i < arr.length; i++) {
      arr[i].ischecked = false;
    }
    item.ischecked = true;
    if (type === 'spec') {
     this.choseSkuSpecId = item.id;
    }
    if (type === 'style') {
      this.choseSkuStyleId = item.id;
    }
    if (this.choseSkuSpecId !== '' && this.choseSkuStyleId !== '' ) {
      this.getSku();
    }
  }
  getSku() {
    // console.log('skuSpecId', this.choseSkuSpecId);
    // console.log('skuStyleId', this.choseSkuStyleId);
    // console.log(this.detailInfo.sku);
    for (let i = 0; i < this.detailInfo.sku.length; i++) {
      if (this.detailInfo.sku[i].skuSpecId === this.choseSkuSpecId && this.detailInfo.sku[i].skuStyleId === this.choseSkuStyleId) {
        this.choseSku = this.detailInfo.sku[i];
      }
    }
    this.showgokanjia =  this.choseSku.bargainBoolean;
  }
  cartAdd() {
    const memberId = localStorage.getItem('memberId');
    const skuId = this.choseSku['id'];
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    const number = 1;
    if (!skuId) {
      this.alertBox.error('请选择产品');
      return;
    }
    this.alertBox.load();
    this.userConfigService.cartAdd(memberId, skuId, storeId, number)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.TongXin.cartNum(1);
          this.cartGetCartDetailNumber();
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  goPaysure() {
    const skuIdArr = [];
    const skuId = {
      'id': this.choseSku['id'],
      'goodsId': this.choseSku['goodsId'],
      'skuSpecId': this.choseSku['skuSpecId'],
      'skuStyleId': this.choseSku['skuStyleId'],
      'goodsType': this.detailInfo['goodsInfo'].type,
    };
    if (!skuId.id) {
      this.alertBox.error('请选择产品');
      return;
    }
    console.log(skuId);
    this.router.navigate(['/paysure', {'from': 'detail', 'skuIdArr': JSON.stringify(skuId), 'liuchengType': 2}]);
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
  scrollFn() {
    const mySwiper = new Swiper ('.headSwiper .swiper-container', {
      loop: true, // 循环模式选项
      autoplay: true,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
    });
    const detailSwiper = new Swiper('.boxShow .swiper-container', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        bulletClass: 'detailbullets',
        bulletActiveClass: 'my-bullet-active',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
  fromChoseit() {
    const item = this.fromGoods;

    for (let i = 0; i < this.detailInfo.skuSpec.length; i++) {
      this.detailInfo.skuSpec[i].ischecked = false;
      if (this.detailInfo.skuSpec[i].id * 1 ===  item.skuSpecId * 1) {
        this.detailInfo.skuSpec[i].ischecked = true;
      }
    }
    for (let i = 0; i < this.detailInfo.skuStyle.length; i++) {
      this.detailInfo.skuStyle[i].ischecked = false;
      if (this.detailInfo.skuStyle[i].id * 1 ===  item.skuStyleId * 1) {
        this.detailInfo.skuStyle[i].ischecked = true;
      }
    }
    for (let i = 0; i < this.detailInfo.sku.length; i++) {
      if (this.detailInfo.sku[i].skuSpecId * 1 === item.skuSpecId * 1 && this.detailInfo.sku[i].skuStyleId * 1 === item.skuStyleId * 1) {
        this.choseSku = this.detailInfo.sku[i];
      }
    }
  }
  gokanjia() {
    if (this.choseSku.bargainBoolean) {
      if (this.kanlist.length === 0) {
        this.router.navigate(['/kjfaqi', {'setid': this.choseSku.activitySetupId, 'skuid': this.choseSku.id}]);
      } else {
        let status = false;
        for ( let i = 0; i < this.kanlist.length; i++) {
          if (this.kanlist[i].addOrder < 2) {
            status = true;
          }
        }
        if (status) {
          this.showxiadanbox = true;
        } else {
          this.router.navigate(['/kjfaqi', {'setid': this.choseSku.activitySetupId, 'skuid': this.choseSku.id}]);
        }
      }
    } else {
      this.alertBox.error('请选择产品进行砍价哦～');
    }
  }
  gokanjiahref() {
    this.router.navigate(['/kjfaqi', {'setid': this.choseSku.activitySetupId, 'skuid': this.choseSku.id}]);
  }
  // 砍价详情
  bargainPersonal() {
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainPersonal(bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.kanlist = data.data;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
