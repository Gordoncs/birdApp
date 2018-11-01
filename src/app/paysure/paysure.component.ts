import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-paysure',
  templateUrl: './paysure.component.html',
  styleUrls: ['./paysure.component.css']
})
export class PaysureComponent implements OnInit {

  constructor( private titleService: Title) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付确认');
  }

}
