import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'app-shopcar',
  templateUrl: './shopcar.component.html',
  styleUrls: ['./shopcar.component.css']
})
export class ShopcarComponent implements OnInit {
  public  cartListInfo: any = [];
  public  canEdit = false;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('购物车');
    this.cartGetCart();
  }
  cartGetCart() {
    const memberId = 3;
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    this.userConfigService.cartGetCart(memberId, storeId)
      .subscribe((data) => {
        if (data['result']) {
          this.cartListInfo = data['data'];
          for (let i = 0; i < this.cartListInfo.cartDetail.length; i++) {
            this.cartListInfo.cartDetail[i].ischeck = true;
          }
        } else {
          alert(data['message']);
        }
      });
  }
  addFn(item) {
    item.number = item.number + 1;
  }
  cute(item) {
    if (item.number > 1) {
      item.number = item.number - 1;
    }
  }
  choseList(item) {
    item.ischeck = !item.ischeck;
  }
}
