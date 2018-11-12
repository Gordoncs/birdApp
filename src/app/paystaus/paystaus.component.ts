import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-paystaus',
  templateUrl: './paystaus.component.html',
  styleUrls: ['./paystaus.component.css']
})
export class PaystausComponent implements OnInit {
  public status = false;
  constructor(private titleService: Title) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付结果');
  }

}
