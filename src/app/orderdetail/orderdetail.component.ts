import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.css']
})
export class OrderdetailComponent implements OnInit {
  public hhh: any;
  public mmm: any;
  public sss: any;
  public status = 3;
  constructor(private titleService: Title) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('订单详情');

    const countDown_time = '00:29:59';
    this.count_down(countDown_time);
  }
  count_down(countDown_time) {
    const that = this;
    const time = countDown_time.split(':');
    let hhh = parseInt(time[0], 10);
    let mmm = parseInt(time[1], 10);
    let sss = parseInt(time[2], 10);
    that.sss = (sss < 10) ? '0' + sss : sss;
    that.mmm = (mmm < 10) ? '0' + mmm : mmm;
    that.hhh = (hhh < 10) ? '0' + hhh : hhh;
    const Interval = setInterval(function () {
      if (sss > 0) {
        sss = sss - 1;
      } else {
        console.log('时间到')
        clearInterval(Interval);
      }
      if (sss === 0) {
        if (mmm > 0) {
          mmm--;
          sss = 59;
        }
        if (mmm === 0 && hhh > 0) {
          hhh--;
          sss = 59;
          mmm = 59;
        }
      }
      that.sss = (sss < 10) ? '0' + sss : sss;
      that.mmm = (mmm < 10) ? '0' + mmm : mmm;
      that.hhh = (hhh < 10) ? '0' + hhh : hhh;
    }, 1000);
  }
}
