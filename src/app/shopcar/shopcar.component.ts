import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-shopcar',
  templateUrl: './shopcar.component.html',
  styleUrls: ['./shopcar.component.css']
})
export class ShopcarComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('购物车');
  }

}
