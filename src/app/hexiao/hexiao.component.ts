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
  hexiaoInfo: any = {};
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
  }

  advisorGetOrderCheckoffDetail(id , code) {
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
      }
    });
  }
  choseList(item) {
    item.ischeck = !item.ischeck;
  }
  save() {
    const detailId = [];
    for (let i = 0; i <  this.hexiaoInfo.detail.length; i++) {
      if ( this.hexiaoInfo.detail[i].ischeck === true) {
        detailId.push(this.hexiaoInfo.detail[i].id);
      }
    }
    const orderId = this.hexiaoInfo.id;
    const advisorId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.advisorCheckoffOrderDetail(detailId, orderId, advisorId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.alertBox.success(data['message']);
        setTimeout(function () {
          history.go(-1);
        }, 2000);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
