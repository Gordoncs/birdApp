import {Component, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertboxComponent} from '../alertbox/alertbox.component';
@Component({
  selector: 'app-specialgoods',
  templateUrl: './specialgoods.component.html',
  styleUrls: ['./specialgoods.component.css']
})
export class SpecialgoodsComponent implements OnInit {
  public  detailInfo: any = {};
  public  selStatus = 'nowOnSaleGoods';
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }
  ngOnInit() {
    this.titleService.setTitle('特卖产品');
    this.getOnSalesGoods();
  }
  /**
   * 获取详情页数据
   */
  getOnSalesGoods() {
    this.alertBox.load();
    this.userConfigService.getOnSalesGoods()
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.detailInfo = data['data'];
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }
  goPaysure() {
    const skuId = this.detailInfo[this.selStatus].id;
    if (!skuId) {
      this.alertBox.error('请选择产品');
      return;
    }
    this.router.navigate(['/paysure', {'from': 'detail', 'skuIdArr': JSON.stringify(skuId)}]);
  }
}
