import {Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked} from '@angular/core';
import Swiper from 'swiper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {
  public indexInfo: any;

  constructor(private router: Router, private titleService: Title, private userConfigService: UserConfigService) { }
  ngAfterViewInit() {
    const mySwiper = new Swiper ('.headSwiper .swiper-container', {
      loop: true, // 循环模式选项
      autoplay: true,
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        bulletClass : 'bullets',
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
      const imgs = Array.from(document.querySelectorAll( 'img.sds' ));
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
  }

  gotopFn(): void {
    console.log(11);
    document.documentElement.scrollTop = 0;
  }

  getInfo() {
    this.userConfigService.getUserConfig()
      .subscribe((data) => {
        this.indexInfo = data['data'];
        console.log(data);
      });
  }
}
