import {Component, OnInit, AfterViewInit, ViewChild, AfterContentInit, ChangeDetectorRef} from '@angular/core';
import Swiper from 'node_modules/swiper/dist/js/swiper.min.js';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import wx from 'weixin-js-sdk';
import * as $ from 'jquery';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterContentInit {
  public indexInfo: any = {};
  public isManager: any = false;
  public storeInfo: any = {};
  public carouselarr: any = [];
  public carefullyarr: any = [];
  public personIntroduce: any = [];
  public lookImgUrl: any = [];
  public showGotopBtn = false;
  public lookImgUrlStatus = false;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private userConfigService: UserConfigService,
              private changeDetectorRef: ChangeDetectorRef) {
  }
  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟皮肤管理中心');
    // 获取首页数据
    this.getInfo(localStorage.getItem('latitude'), localStorage.getItem('longitude'));
    // this.getInfo(39.91474, 116.37333);
    // this.getInfo(31.5785354265, 117.3339843750);
    this.getbaseMember();
  }
  ngAfterContentInit() {
    const t = this;
    const threePin = $(document).height() * 1.5;
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() > threePin) {
        t.showGotopBtn = true;
      } else {
        t.showGotopBtn = false;
      }
    });
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
              that.personIntroduce[i].casePictureArr[0].beforebig = that.personIntroduce[i].casePicture[0].big;
              that.personIntroduce[i].casePictureArr[0].after = that.personIntroduce[i].casePicture[1].small;
              that.personIntroduce[i].casePictureArr[0].afterbig = that.personIntroduce[i].casePicture[1].big;
            }
            if (that.personIntroduce[i].casePicture.length === 4) {
              that.personIntroduce[i].casePictureArr[0].before = that.personIntroduce[i].casePicture[0].small;
              that.personIntroduce[i].casePictureArr[0].beforebig = that.personIntroduce[i].casePicture[0].big;
              that.personIntroduce[i].casePictureArr[0].after = that.personIntroduce[i].casePicture[1].small;
              that.personIntroduce[i].casePictureArr[0].afterbig = that.personIntroduce[i].casePicture[1].big;
              that.personIntroduce[i].casePictureArr[1].before = that.personIntroduce[i].casePicture[2].small;
              that.personIntroduce[i].casePictureArr[1].beforebig = that.personIntroduce[i].casePicture[2].big;
              that.personIntroduce[i].casePictureArr[1].after = that.personIntroduce[i].casePicture[3].small;
              that.personIntroduce[i].casePictureArr[1].afterbig = that.personIntroduce[i].casePicture[3].big;
            }
            if (that.personIntroduce[i].casePicture.length === 6) {
              that.personIntroduce[i].casePictureArr[0].before = that.personIntroduce[i].casePicture[0].small;
              that.personIntroduce[i].casePictureArr[0].beforebig = that.personIntroduce[i].casePicture[0].big;
              that.personIntroduce[i].casePictureArr[0].after = that.personIntroduce[i].casePicture[1].small;
              that.personIntroduce[i].casePictureArr[0].afterbig = that.personIntroduce[i].casePicture[1].big;
              that.personIntroduce[i].casePictureArr[1].before = that.personIntroduce[i].casePicture[2].small;
              that.personIntroduce[i].casePictureArr[1].beforebig = that.personIntroduce[i].casePicture[2].big;
              that.personIntroduce[i].casePictureArr[1].after = that.personIntroduce[i].casePicture[3].small;
              that.personIntroduce[i].casePictureArr[1].afterbig = that.personIntroduce[i].casePicture[3].big;
              that.personIntroduce[i].casePictureArr[2].before = that.personIntroduce[i].casePicture[4].small;
              that.personIntroduce[i].casePictureArr[2].beforebig = that.personIntroduce[i].casePicture[4].big;
              that.personIntroduce[i].casePictureArr[2].after = that.personIntroduce[i].casePicture[5].small;
              that.personIntroduce[i].casePictureArr[2].afterbig = that.personIntroduce[i].casePicture[5].big;
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
          if (localStorage.getItem('fromaddress') === 'yes') {
            // 从选择地址过来，用店铺id获取店铺信息
            that.getStoreInfo();
          } else {
            // 第一次进入首页 用默认店铺信息
            that.storeInfo = that.indexInfo['storeInfo'];
            if ( that.storeInfo === null) {
              this.router.navigate(['/address',  {'status': 'nohave'}]);
            } else {
              localStorage.setItem('storeInfo', JSON.stringify(that.indexInfo['storeInfo']));
              if (localStorage.getItem('fromPage')) {
                if (localStorage.getItem('fromPage')  === 'newergif') {
                  this.router.navigate(['newergif', {'goodsId': 5}]);
                } else if (localStorage.getItem('fromPage')  === 'newerdec') {
                  this.router.navigate(['newercome']);
                } else if (localStorage.getItem('fromPage')  === 'qiangpage') {
                  this.router.navigate(['qiangpage']);
                } else if (localStorage.getItem('fromPage')  === 'kanjia') {
                  this.router.navigate(['kjcome', JSON.parse(localStorage.getItem('kanjiainfo'))]);
                } else {
                  const canshu = localStorage.getItem('canshu');
                  this.goWhere(canshu);
                }
              }
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
  // 根据参数进行跳转
  goWhere(canshu) {
    canshu = canshu.split('&');
    console.log(11111, canshu);
    const savedata = {};
    const canshuarr = canshu[0].split(';');
    const page = canshuarr[0].split('=')[1];
    for ( let i = 1 ; i < canshuarr.length ; i++) {
      const temp = canshuarr[i].split('=');
      if (temp.length < 2) {
        savedata[temp[0]] = '';
      } else {
        savedata[temp[0]] = temp[1];
      }
    }
    localStorage.setItem('canshu', '');
    localStorage.setItem('fromPage', '');
    this.router.navigate([page, savedata]);
  }
  // 获取店铺信息
  getStoreInfo() {
    this.userConfigService.getStoreInfo()
      .subscribe((data) => {
        if (data['result']) {
          // localStorage.setItem('fromaddress', '');
          this.storeInfo = data['data'];
          if ( this.storeInfo === null) {
            this.router.navigate(['/address',  {'status': 'nohave'}]);
          } else {
            localStorage.setItem('storeInfo', JSON.stringify(this.storeInfo));
            if (localStorage.getItem('fromPage')) {
              if (localStorage.getItem('fromPage')  === 'newergif') {
                this.router.navigate(['newergif', {'goodsId': 5}]);
              } else if (localStorage.getItem('fromPage')  === 'newerdec') {
                this.router.navigate(['newercome']);
              } else if (localStorage.getItem('fromPage')  === 'qiangpage') {
                this.router.navigate(['qiangpage']);
              } else if (localStorage.getItem('fromPage')  === 'kanjia') {
                this.router.navigate(['kjcome']);
              } else {
                const canshu = localStorage.getItem('fromPage');
                this.goWhere(canshu);
              }
            }
          }
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  goDetail(id: any) {
    this.router.navigate(['/goodsdetail', {'goodsId': id}]);
  }
  scrollFn() {
    const  t = this;
    const mySwiper = new Swiper('.headSwiper .swiper-container', {
      loop: true,
      autoplay: true,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        bulletClass: 'bullets',
        bulletActiveClass: 'my-bullet-active',
      },
      on: {
        click: function () {
          // 这里有坑
          // 需要注意的是：this 指向的是 swpier 实例，而不是当前的 vue， 因此借助 vm，来调用 methods 里的方法
          // console.log(this); // -> Swiper
          // 当前活动块的索引，与activeIndex不同的是，在loop模式下不会将 复制的块 的数量计算在内。
          const realIndex = this.realIndex;
          t.carouselGoto(t.carouselarr[realIndex]['type'], t.carouselarr[realIndex]['id']);
        }
      },
      preventLinksPropagation: false   // 阻止点击事件冒泡
    });
    const sideScrollBox = new Swiper('.sideScrollBox .swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 30,
    });
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
  }
  carouselGoto(type, id) {
    const t = this;
    if (type === '1') {
      t.router.navigate(['/goodsdetail', {'goodsId': id}]);
    }
    if (type === '2') {
      t.router.navigate(['/specialgoods']);
    }
    if (type === '3') {
      t.router.navigate(['/newergif', {'goodsId': 5}]);
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
          localStorage.setItem('memberInfo', JSON.stringify(data['data']));
          localStorage.setItem('memberId', data['data']['memberId']);
        } else {
          console.log(data['message']);
        }
      });
  }
  showLook(img, selimg) {
    const t = this;
    this.lookImgUrl =  [];
    this.lookImgUrlStatus = true;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    const imgsarr = [];
    for (let i = 0 ; i < img.length ; i++) {
      if (img[i].before !== '') {
        imgsarr.push(img[i].beforebig);
      }
      if (img[i].after !== '') {
        imgsarr.push(img[i].afterbig);
      }
    }
    const index  = imgsarr.indexOf(selimg);
    this.lookImgUrl = imgsarr;
    setTimeout(function () {
      const swiperss = new Swiper('.middleBox .swiper-container', {
        slidesPerView: 1,
        initialSlide : index,
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
      // swiperss.slideTo(index, 50, false);
    }, 500);
    setTimeout(function () {
      t.lookImgUrlStatus = false;
    }, 700);
  }
}
