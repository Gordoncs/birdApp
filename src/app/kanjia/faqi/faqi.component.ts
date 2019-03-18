import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';

@Component({
  selector: 'app-faqi',
  templateUrl: './faqi.component.html',
  styleUrls: ['./faqi.component.css']
})
export class FaqiComponent implements OnInit, AfterContentInit {
  public changetitle: any = '帮砍团';
  public activitySetupId: any;
  public detailInfo: any;
  public timer: any;
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) {
  }

  ngOnInit() {
    this.titleService.setTitle('春鸟科美-砍价发起页');
    this.routerInfo.params.subscribe((params) =>
      this.activitySetupId = params['setid']
    );
    this.bargain();
  }

  ngAfterContentInit() {
    $('.kanfriendmain').on('touchend', function (e) {
      if ($('.kanfriendmain').scrollTop() >= 258) {
        $('.loadBox').show();
      }
      console.log($('.kanfriendmain').scrollTop(), $('.kanfriendmain').height());
    });
  }

  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }

  // 砍价接口
  bargain() {
    const t = this;
    const bargainSetupId = this.activitySetupId;
    const bargainMemberId = localStorage.getItem('memberId') || 7;
    this.alertBox.load();
    this.userConfigService.bargain(bargainSetupId, bargainMemberId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        t.bargainDetail(data.data['bargainId']);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  // 砍价详情
  bargainDetail(bargainId: any) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.bargainDetail(bargainId).subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.detailInfo = data.data;
        this.countTime(this.detailInfo.currentTime, this.detailInfo.expireTime);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  // 计算倒计时
  countTime(startTime, endTime) {
    // let startTime = 1508428800; // 开始时间
    // const endTime = 1508428860; // 结束时间
    const t = this;
    setInterval(function () {
      const ts = (endTime - startTime); // 计算剩余的毫秒数
      console.log(ts);
      let dd = parseInt((ts / 60 / 60 / 24).toString(), 10); // 计算剩余的天数
      let hh = parseInt((ts / 60 / 60 % 24).toString(), 10); // 计算剩余的小时数
      let mm = parseInt((ts / 60 % 60).toString(), 10); // 计算剩余的分钟数
      let ss = parseInt((ts % 60).toString(), 10); // 计算剩余的秒数
      dd = t.checkTime(dd);
      hh = t.checkTime(hh);
      mm = t.checkTime(mm);
      ss = t.checkTime(ss);
      if (ts > 0) {
        t.timer = dd + '天' + hh + '时' + mm + '分' + ss + '秒';
        startTime++;
      } else if (ts < 0) {
        t.timer = '00:00:00';
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
}
