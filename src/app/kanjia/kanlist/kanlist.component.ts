import {Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';
@Component({
  selector: 'app-kanlist',
  templateUrl: './kanlist.component.html',
  styleUrls: ['./kanlist.component.css']
})
export class KanlistComponent implements OnInit {

  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  public kanlist: any;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) {
  }

  ngOnInit() {
    this.bargainPersonal();
  }
  // 砍价详情
  bargainPersonal() {
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainPersonal(bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for ( let i = 0 ; i < data.data.length; i++) {
          this.countTime(data.data[i].currentTime, data.data[i].expireTime, data.data[i]);
        }
        this.kanlist = data.data;
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  // 计算倒计时
  countTime(startTime, endTime, obj) {
    // let startTime = 1508428800; // 开始时间
    // const endTime = 1508428860; // 结束时间
    const t = this;
    setInterval(function () {
      const ts = (endTime - startTime); // 计算剩余的毫秒数
      // console.log(ts);
      let dd = parseInt((ts / 60 / 60 / 24).toString(), 10); // 计算剩余的天数
      let hh = parseInt((ts / 60 / 60 % 24).toString(), 10); // 计算剩余的小时数
      let mm = parseInt((ts / 60 % 60).toString(), 10); // 计算剩余的分钟数
      let ss = parseInt((ts % 60).toString(), 10); // 计算剩余的秒数
      dd = t.checkTime(dd);
      hh = t.checkTime(hh);
      mm = t.checkTime(mm);
      ss = t.checkTime(ss);
      if (ts > 0) {
        obj.timer = 0 + '天' + hh + '时' + mm + '分' + ss + '秒';
        startTime++;
      } else if (ts < 0) {
        obj.timer = '00:00:00';
        location.reload();
      }
    }, 1000);
  }

  checkTime(i) {
    if (i <= 10) {
      i = '0' + i;
    }
    return i;
  }
  back() {
    history.go(-1);
  }
  goGoodsDetail(item) {
    this.router.navigate(['/goodsdetail', item]);
  }
}
