import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';

@Component({
  selector: 'app-hexiao',
  templateUrl: './hexiao.component.html',
  styleUrls: ['./hexiao.component.css']
})
export class HexiaoComponent implements OnInit {
  code: any = '';
  advisorId: any = '';
  hexiaoInfo: any = {};
  sureBoxStatus = false;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('扫码销单');
    this.routerInfo.params.subscribe((params) => this.code = params);
    this.advisorGetOrderCheckoffDetail(this.code.code.split('#')[0], this.code.code.split('#')[1]);
    // this.advisorGetOrderCheckoffDetail('380', '15431532083246963003');
    this.advisorId = this.code.advisorId;
    // this.advisorId = 5;
  }

  advisorGetOrderCheckoffDetail(id , code) {
    const t = this;
    this.alertBox.load();
    this.userConfigService.advisorGetOrderCheckoffDetail(id, code).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.hexiaoInfo = data['data'];
        for (let i = 0; i < this.hexiaoInfo.detail.length; i++) {
          this.hexiaoInfo.detail[i].ischeck = true;
        }
      } else {
        this.alertBox.error(data['message']);
        setTimeout(function () {
          t.router.navigate(['teacher']);
        }, 3000);
      }
    });
  }
  choseList(item) {
    item.ischeck = !item.ischeck;
  }
  save() {

    const t = this;
    const detailId = [];
    for (let i = 0; i <  this.hexiaoInfo.detail.length; i++) {
      if ( this.hexiaoInfo.detail[i].ischeck === true) {
        detailId.push(this.hexiaoInfo.detail[i].id);
      }
    }
    const orderId = this.hexiaoInfo.id;
    const advisorId = this.advisorId;
    this.sureBoxStatus = false;
    this.alertBox.load();
    this.userConfigService.advisorCheckoffOrderDetail(detailId, orderId, advisorId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.alertBox.success('核销成功');
        setTimeout(function () {
          t.router.navigate(['teacher']);
        }, 5000);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
