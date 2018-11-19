import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import Swiper from 'swiper';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import wx from 'weixin-js-sdk';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  public indexInfo: any;
  public storeInfo = {
    'name': ''
  };
  public carouselarr = [];
  public carefullyarr = [];
  public personIntroduce = [];
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private userConfigService: UserConfigService) {
  }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟科美');
    /***
     * 懒加载图片
     */
    window.onload = function () {
      let scrollTop = window.scrollY;
      const imgs = Array.from(document.querySelectorAll('img.sds'));
      lazyLoad();

      // 函数防抖模式
      let timer = null;
      window.onscroll = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          scrollTop = window.scrollY;
          lazyLoad();
        }, 300);
      };

      function lazyLoad() {
        imgs.forEach((item, index) => {
          // @ts-ignore
          if (item.offsetTop < window.innerHeight + scrollTop) {
            // @ts-ignore
            item.setAttribute('src', item.dataset.src);
          }
        });
      }
    };
    // 获取首页数据
    const that = this;
    // wx.getLocation({
    //   type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    //   success: function (res) {
    //     that.getInfo(res.latitude, res.longitude);
    //   }
    // });
    that.getInfo(39.91474, 116.37333);

  }

  gotopFn(): void {
    document.documentElement.scrollTop = 0;
  }
  getInfo(latitude , longitude) {
    const that = this;
    that.alertBox.load();
    that.userConfigService.indexView(latitude, longitude)
      .subscribe((data) => {
        that.alertBox.close();
        if (data['result']) {
          that.indexInfo = data['data'];
          that.personIntroduce = that.indexInfo['personIntroduce'];
          const carefullyarr = [];
          const carouselarr = [];
          // 处理精选内容
          for (let i = 0; i < that.indexInfo['carefully'].length; i++) {
            let url = that.indexInfo['carefully'][i];
            url = url.split('#');
            const obj = {
              'imgs': url[0],
              'type': url[1],
              'id': url[2],
            };
            carefullyarr.push(obj);
          }
          that.carefullyarr = carefullyarr;
          // 处理滚动图片
          for (let i = 0; i < that.indexInfo['carousel'].length; i++) {
            let url = that.indexInfo['carousel'][i];
            url = url.split('#');
            const obj = {
              'imgs': url[0],
              'type': url[1],
              'id': url[2],
            };
            carouselarr.push(obj);
          }
          that.carouselarr = carouselarr;
          // 处理店铺信息
          localStorage.setItem('storeInfo', JSON.stringify(that.indexInfo['storeInfo']));
          that.storeInfo = that.indexInfo['storeInfo'];
          setTimeout(function () {
            that.scrollFn();
          }, 100);
        } else {
          that.alertBox.error(data['message']);
        }
      });
  }

  goDetail(id: any) {
    this.router.navigate(['/goodsdetail', id]);
  }
  scrollFn() {
    const mySwiper = new Swiper('.headSwiper .swiper-container', {
      loop: true, // 循环模式选项
      autoplay: true,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        bulletClass: 'bullets',
        bulletActiveClass: 'my-bullet-active',
      },
    });
    const sideScrollBox = new Swiper('.sideScrollBox .swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 30,
    });
  }
  carouselGoto(item) {
    if (item.type === '1') {
      this.router.navigate(['/goodsdetail', item.id]);
    }
    if (item.type === '2') {
      this.router.navigate(['/specialgoods']);
    }
    if (item.type === '3') {
      alert('跳转体验商品分享页');
    }
  }
}
