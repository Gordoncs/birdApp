import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import Swiper from 'swiper';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../alertbox/alertbox.component';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {
  public  showWhitchStatus: any = 1;
  public  detailInfo: any;
  public  goodsId: any;
  public  priceArr: any = [];
  public  choseSkuSpecId: any = [];
  public  choseSkuStyleId: any = [];
  public  choseSku: any = '';
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }
  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟科美-精选产品');
    this.routerInfo.params.subscribe((params) => this.goodsId = params['goodsId']);
    this.getGoodsInfo(this.goodsId, JSON.parse(localStorage.getItem('storeInfo'))['id']);
  }

  ngAfterViewInit(): void {
    const mySwiper = new Swiper ('.headSwiper .swiper-container', {
      loop: true, // 循环模式选项
      autoplay: true,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
    });
  }
  showWitch(index, event) {
    this.showWhitchStatus = index;
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
          for (let i = 0; i < this.detailInfo.sku.length; i++) {
            this.priceArr.push(this.detailInfo.sku[i]['price']);
          }
          this.priceArr.sort(function (a, b) {
            return a - b;
          });
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  selIt(item, arr, type) {
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
    for (let i = 0; i < this.detailInfo.sku.length; i++) {
      if (this.detailInfo.sku[i].skuSpecId === this.choseSkuSpecId && this.detailInfo.sku[i].skuStyleId === this.choseSkuStyleId) {
        this.choseSku = this.detailInfo.sku[i];
      }
    }
  }
  cartAdd() {
    const memberId = 3;
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
          this.router.navigate(['/cart']);
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
}
