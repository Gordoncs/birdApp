import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import wx from 'weixin-js-sdk';
@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
  showQr = false;
  qrImg = null;
  teacherInfo: any = {};
  discounts = {
    'advisorId': localStorage.getItem('memberId'),
    'discountsType': null,
    'discounts': null,
  };
  zhekouInput: number;
  cashInput: number;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('导师信息');
    this.advisorGetAdvisorByMember();
  }
  advisorGetAdvisorByMember() {
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.advisorGetAdvisorByMember(memberId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.teacherInfo = data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  changeit(text) {
    if (text === '折扣') {
      this.cashInput = null;
      this.discounts.discountsType = 1;
      if (this.zhekouInput * 1 < 0 || this.zhekouInput * 1 > 100) {
        this.alertBox.error('折扣限定0~100');
        this.zhekouInput = 0;
      }
    }
    if (text === '现金') {
      this.zhekouInput = null;
      this.discounts.discountsType = 0;
      if (this.cashInput * 1 < 0) {
        this.alertBox.error('请输入大于0的金额');
        this.cashInput = 0;
      }
    }
  }
  getQrFn() {
    if (this.discounts.discountsType === 1) {
      this.discounts.discounts = this.zhekouInput;
    }
    if (this.discounts.discountsType === 0) {
      this.discounts.discounts = this.cashInput;
    }
    if (this.discounts.discounts === null || this.discounts.discountsType === null) {
      this.alertBox.error('请填写折扣信息');
      return;
    }
    this.alertBox.load();
    this.userConfigService.advisorGetAdvisorDiscounts(this.discounts).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.showQr = true;
        this.qrImg = 'data:image/jpeg;base64,' + data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }

  sao() {
    const t = this;
    // t.router.navigate(['/hexiao', {'code': '119#15424717055823526503'}]);
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        t.router.navigate(['/hexiao', {'code': res.resultStr}]);
      }
    });
  }
}
