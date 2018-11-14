import {Component, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import * as $ from 'jquery';
@Component({
  selector: 'app-paysure',
  templateUrl: './paysure.component.html',
  styleUrls: ['./paysure.component.css']
})
export class PaysureComponent implements OnInit {
  public skuArr: any;
  public paySureInfo: any;
  public allMoney = 0;
  public order = {
    'memberId':  localStorage.getItem('memberId'),
    'storeId': JSON.parse(localStorage.getItem('storeInfo'))['id'],
    'orderRemark': '',
    'subscribePhone': '',
    'linkman': '',
    'discountPriceAmout': 0,
  };
  public bean = {
    'id': '',
    'authCode': '',
  };
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付确认');

    this.routerInfo.params.subscribe((params) => this.skuArr = params['skuId']);

    this.checkoutInfo();
  }

  checkoutInfo() {
    const memberId = localStorage.getItem('memberId');
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    const skuId = JSON.parse(this.skuArr);
    this.alertBox.load();
    this.userConfigService.checkoutInfo(memberId, storeId, skuId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.paySureInfo = data['data'];
        this.order.subscribePhone = this.paySureInfo.hisMobile;
        this.order.linkman = this.paySureInfo.hisName;
        this.getAllMoney();
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  getAllMoney() {
    let money = 0;
    for (let i = 0; i < this.paySureInfo.cartDetail.length; i++) {
        money = money + this.paySureInfo.cartDetail[i].price * this.paySureInfo.cartDetail[i].number;
    }
    this.allMoney =  money;
  }
  payFn() {
    const sku = [];
    for (let i = 0; i < this.paySureInfo.cartDetail.length; i++) {
      sku.push(this.paySureInfo.cartDetail[i].id);
    }
    const type = this.paySureInfo.type;
    const order = this.order;
    const bean = this.bean;
    this.alertBox.load();
    this.userConfigService.checkoutAdd(sku, type, order, bean).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
}
