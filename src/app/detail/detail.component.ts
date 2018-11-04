import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {
  public showWhitchStatus: any = 1;
  public  detailInfo: any;
  public  goodsId: any;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }
  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟科美-素肤净体');
    this.routerInfo.params.subscribe((params) => this.goodsId = params['goodsId']);
    this.getGoodsInfo(this.goodsId, 1);
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
    this.userConfigService.getGoodsInfo(goodsId, shopId)
      .subscribe((data) => {
        this.detailInfo = data['data'];
      });
  }
}
