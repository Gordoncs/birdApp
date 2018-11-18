import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';
import {MyindexComponent} from '../myindex/myindex.component';

@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.css']
})
export class OrderdetailComponent implements OnInit {
  public hhh: any;
  public mmm: any;
  public sss: any;
  public orderId: any;
  public detailInfo: any;
  public userInfo: any;
  public iscomplete = false;
  public allServers = 0;
  public useServers = 0;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('订单详情');

    // const countDown_time = '00:29:59';
    // this.count_down(countDown_time);
    this.routerInfo.params.subscribe((params) => this.orderId = params['orderId']);
    this.orderGetOrderInfo(this.orderId);
    this.getMemberIndexInfo();
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
  orderGetOrderInfo(orderId) {
    this.alertBox.load();
    this.userConfigService.orderGetOrderInfo(orderId)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.detailInfo = data['data'];
          let allServers = 0;
          let useServers = 0;
          if (this.detailInfo.orderStatus === 1) {
            for (let i = 0 ; i < this.detailInfo.detail.length ; i++) {
              allServers = allServers + this.detailInfo.detail[i].goodsNumber * 1;
              useServers = useServers + (this.detailInfo.detail[i].checkoffNumber || 0) * 1;
            }
            this.allServers = allServers;
            this.useServers = useServers;
          }
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }

  getMemberIndexInfo() {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.getMemberIndexInfo(memberId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.userInfo = data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  payFn() {
    this.router.navigate(['/justpay', {'allMoney': this.detailInfo.orderAmountPayable, 'orderNo': this.detailInfo.orderNo}]);
  }
}
