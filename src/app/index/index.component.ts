import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, AfterViewInit {

  constructor() { }
  ngAfterViewInit() {
    setTimeout(function() {
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
        slidesPerView: 3,
        spaceBetween: 15,
      });
    }, 2000);
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
  }


}
