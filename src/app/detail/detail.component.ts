import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {
  public showWhitchStatus: any = 1;
  constructor(private router: Router, private titleService: Title) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('春鸟科美-素肤净体');
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

}
