import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-myorder',
  templateUrl: './myorder.component.html',
  styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit, AfterContentInit {
  public  showWhitchStatus: any = 1;
  public  showWhitchStatusArr1 = [];
  public  startLimt1 = 0;
  public  showWhitchStatusArr2 = [];
  public  startLimt2 = 0;
  public  showWhitchStatusArr3 = [];
  public  startLimt3 = 0;
  public  showWhitchStatusArr4 = [];
  public  startLimt4 = 0;
  public  showWhitchStatusArr5 = [];
  public  startLimt5 = 0;

  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('我的订单');
    this.showWitch(this.showWhitchStatus);
  }
  ngAfterContentInit() {
    const t = this;
    $(window).scroll(function() {
      if ($(window).scrollTop() + $(window).height() === $(document).height()) {
        if (t.showWhitchStatus === 1) {
          t.startLimt1 = t.startLimt1 + 8;
          t.orderGetMemberOrderList('', t.startLimt1 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 2) {
          t.startLimt2 = t.startLimt2 + 8;
          t.orderGetMemberOrderList(0, t.startLimt2 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 3) {
          t.startLimt3 = t.startLimt3 + 8;
          t.orderGetMemberOrderList(1, t.startLimt3 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 4) {
          t.startLimt4 = t.startLimt4 + 8;
          t.orderGetMemberOrderList(2, t.startLimt4 , 8 , 'scroll');
        }
        if (t.showWhitchStatus === 5) {
          t.startLimt5 = t.startLimt5 + 8;
          t.orderGetMemberOrderList(9, t.startLimt5 , 8 , 'scroll');
        }
      }
    });
  }
  showWitch(index) {
    this.showWhitchStatus = index;
    if (index === 1) {
      this.orderGetMemberOrderList('', 0 , 8 , 'click');
    }
    if (index === 2) {
      this.orderGetMemberOrderList(0, 0 , 8, 'click');
    }
    if (index === 3) {
      this.orderGetMemberOrderList(1, 0 , 8, 'click');
    }
    if (index === 4) {
      this.orderGetMemberOrderList(2, 0 , 8, 'click');
    }
    if (index === 5) {
      this.orderGetMemberOrderList(9, 0 , 8, 'click');
    }
  }

  orderGetMemberOrderList(orderStatus, startLimit, pageNumber, form) {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.orderGetMemberOrderList(memberId, orderStatus, startLimit, pageNumber).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        if (this.showWhitchStatus === 1) {
          if (form === 'click') {
            this.showWhitchStatusArr1 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr1.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 2) {
          if (form === 'click') {
            this.showWhitchStatusArr2 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr2.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 3) {
          if (form === 'click') {
            this.showWhitchStatusArr3 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr3.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 4) {
          if (form === 'click') {
            this.showWhitchStatusArr4 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr4.push(data['data']['list'][i]);
            }
          }
        }
        if (this.showWhitchStatus === 5) {
          if (form === 'click') {
            this.showWhitchStatusArr5 = data['data']['list'];
          } else {
            for (let i = 0; i < data['data']['list'].length ; i++) {
              this.showWhitchStatusArr5.push(data['data']['list'][i]);
            }
          }
        }
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
