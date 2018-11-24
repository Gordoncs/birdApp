import {Component, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-shopcar',
  templateUrl: './shopcar.component.html',
  styleUrls: ['./shopcar.component.css']
})
export class ShopcarComponent implements OnInit {
  public  cartListInfo: any = [];
  public  canEdit = false;
  public  choseAllStatus = true;
  public  allMoney = 0;
  public  allNum = 0;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService , private TongXin: TongxinService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('购物车');
    this.cartGetCart();
  }
  cartGetCart() {
    this.alertBox.load();
    const memberId = localStorage.getItem('memberId');
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    this.userConfigService.cartGetCart(memberId, storeId)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.cartListInfo = data['data'];
          for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
            this.cartListInfo.cartDetail[i].ischeck = true;
          }
          this.getAllMoney();
          this.choseNum();
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  addFn(item) {
    this.changeNum(localStorage.getItem('memberId'), item.id, 1, item);
  }
  cute(item) {
    if (item.number > 1) {
      this.changeNum(localStorage.getItem('memberId'), item.id, -1, item);
    }
  }
  choseList(item) {
    item.ischeck = !item.ischeck;
    this.getAllMoney();
    this.choseNum();
  }
  choseAll() {
    this.choseAllStatus = !this.choseAllStatus;
    if ( this.choseAllStatus ) {
      for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
        this.cartListInfo.cartDetail[i].ischeck = true;
      }
    } else {
      for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
        this.cartListInfo.cartDetail[i].ischeck = false;
      }
    }
    this.getAllMoney();
    this.choseNum();
  }
  choseNum() {
    let num = 0;
    for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
      if ( this.cartListInfo.cartDetail[i].ischeck === true ) {
        num = num + 1;
      }
    }
    this.allNum =  num;
  }
  getAllMoney() {
    let money = 0;
    for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
      if ( this.cartListInfo.cartDetail[i].ischeck === true ) {
        money = money + this.cartListInfo.cartDetail[i].price * this.cartListInfo.cartDetail[i].number;
      }
    }
    this.allMoney =  money;
  }
  changeNum(memberId: any, skuId: any, number: any , item: any) {
    this.alertBox.load();
    this.userConfigService.cartChangeGoodsNumber(memberId, skuId, number).
      subscribe( data => {
        this.alertBox.close();
        if (data['result']) {
          item.number = item.number + number;
          this.getAllMoney();
          this.choseNum();
        } else {
          this.alertBox.error(data['message']);
        }
    });
  }
  delGoods() {
    const skuIdArr = [];
    const memberId = localStorage.getItem('memberId');
    for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
      if (this.cartListInfo.cartDetail[i].ischeck === true) {
        skuIdArr.push(this.cartListInfo.cartDetail[i].id);
      }
    }
    if (skuIdArr.length === 0) {
      this.alertBox.error('暂无可操作订单~');
      return;
    }
    this.alertBox.load();
    this.userConfigService.cartDelCartGoods(memberId, skuIdArr).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
          if (this.cartListInfo.cartDetail[i].ischeck === true) {
            this.cartListInfo.cartDetail.splice(i, 1);
            i--;
          }
        }
        this.getAllMoney();
        this.choseNum();
        this.TongXin.cartNum(1);
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  goPaysure() {
    const skuIdArr = [];
    for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
      if (this.cartListInfo.cartDetail[i].ischeck === true) {
        skuIdArr.push(this.cartListInfo.cartDetail[i].id);
      }
    }
    if (skuIdArr.length === 0) {
      this.alertBox.error('暂无可操作订单~');
      return;
    }
    this.router.navigate(['/paysure', {'from': 'shopcart', 'skuIdArr': skuIdArr.join(','), 'liuchengType': 0}]);
  }
  goGoodsDetail(item) {
    this.router.navigate(['/goodsdetail', item]);
  }
}
