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
  public indexInfo: any = {};
  public isManager: any = false;
  public storeInfo: any = {};
  public carouselarr: any = [];
  public carefullyarr: any = [];
  public personIntroduce: any = [];
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
    this.getInfo(localStorage.getItem('latitude'), localStorage.getItem('longitude'));
    // this.getInfo(39.91474, 116.37333);
    // this.getInfo(31.5785354265, 117.3339843750);
    this.getbaseMember();
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
          for (let i = 0; i < that.personIntroduce.length; i++) {
            that.personIntroduce[i].casePicture = JSON.parse(that.personIntroduce[i].casePicture);
            that.personIntroduce[i].casePictureArr = [
              {'before' : '', 'after' : ''},
              {'before' : '', 'after' : ''},
              {'before' : '', 'after' : ''}
            ];
            if (that.personIntroduce[i].casePicture.length === 2) {
              that.personIntroduce[i].casePictureArr[0].before = that.personIntroduce[i].casePicture[0].small;
              that.personIntroduce[i].casePictureArr[0].after = that.personIntroduce[i].casePicture[1].small;
            }
            if (that.personIntroduce[i].casePicture.length === 4) {
              that.personIntroduce[i].casePictureArr[0].before = that.personIntroduce[i].casePicture[0].small;
              that.personIntroduce[i].casePictureArr[0].after = that.personIntroduce[i].casePicture[1].small;
              that.personIntroduce[i].casePictureArr[1].before = that.personIntroduce[i].casePicture[2].small;
              that.personIntroduce[i].casePictureArr[1].after = that.personIntroduce[i].casePicture[3].small;
            }
            if (that.personIntroduce[i].casePicture.length === 6) {
              that.personIntroduce[i].casePictureArr[0].before = that.personIntroduce[i].casePicture[0].small;
              that.personIntroduce[i].casePictureArr[0].after = that.personIntroduce[i].casePicture[1].small;
              that.personIntroduce[i].casePictureArr[1].before = that.personIntroduce[i].casePicture[2].small;
              that.personIntroduce[i].casePictureArr[1].after = that.personIntroduce[i].casePicture[3].small;
              that.personIntroduce[i].casePictureArr[2].before = that.personIntroduce[i].casePicture[4].small;
              that.personIntroduce[i].casePictureArr[2].after = that.personIntroduce[i].casePicture[5].small;
            }
          }
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
          that.storeInfo = that.indexInfo['storeInfo'];
          if ( that.storeInfo === null) {
            this.router.navigate(['/address', 'nohave']);
          } else {
            localStorage.setItem('storeInfo', JSON.stringify(that.indexInfo['storeInfo']));
            if (localStorage.getItem('canshu')) {
              this.router.navigate(['/newercome']);
            }
          }
          setTimeout(function () {
            that.scrollFn();
          }, 100);
        } else {
          that.alertBox.error(data['message']);
          setTimeout(function () {
            that.router.navigate(['/address', 'nohave']);
          }, 1000);
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
      this.router.navigate(['/newergif', item.id]);
    }
  }
  /***
   * 获取用户信息
   */
  getbaseMember() {
    this.userConfigService.baseMember()
      .subscribe((data) => {
        if (data['result']) {
          this.isManager = data['data'].isManager;
          localStorage.setItem('memberInfo', data['data']);
          localStorage.setItem('memberId', data['data']['memberId']);
        } else {
          console.log(data['message']);
        }
      });
  }
}
