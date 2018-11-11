import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-hexiao',
  templateUrl: './hexiao.component.html',
  styleUrls: ['./hexiao.component.css']
})
export class HexiaoComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('扫码销单');
  }

}
