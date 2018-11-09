import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import Swiper from 'swiper';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  public indexInfo: any;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private userConfigService: UserConfigService) {
  }
  ngAfterViewInit() {
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
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟科美');

  }

  ngOnInit() {

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
    this.getInfo();
    // 获取用户信息
    this.getbaseMember();
  }

  gotopFn(): void {
    document.documentElement.scrollTop = 0;
  }
  getbaseMember() {
    this.userConfigService.baseMember()
      .subscribe((data) => {
        if (data['result']) {
          localStorage.setItem('memberInfo', data['data']);
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  getInfo() {
    this.alertBox.load();
    this.userConfigService.indexView()
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.indexInfo = data['data'];
          const carefullyarr = [];
          const carouselarr = [];
          // 处理精选内容
          for (let i = 0; i < this.indexInfo['carefully'].length; i++) {
            let url = this.indexInfo['carefully'][i];
            url = url.split('#');
            const obj = {
              'imgs': url[0],
              'type': url[1],
              'id': url[2],
            };
            carefullyarr.push(obj);
          }
          this.indexInfo['carefully'] = carefullyarr;
          // 处理滚动图片
          for (let i = 0; i < this.indexInfo['carousel'].length; i++) {
            let url = this.indexInfo['carousel'][i];
            url = url.split('#');
            const obj = {
              'imgs': url[0],
              'type': url[1],
              'id': url[2],
            };
            carouselarr.push(obj);
          }
          this.indexInfo['carousel'] = carouselarr;
          // 处理店铺信息
          localStorage.setItem('storeInfo', JSON.stringify(this.indexInfo['storeInfo']));
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }

  goDetail(id: any) {
    this.router.navigate(['/detail', id]);
  }
}
