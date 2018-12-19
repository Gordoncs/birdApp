import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-qiangpage',
  templateUrl: './qiangpage.component.html',
  styleUrls: ['./qiangpage.component.css']
})
export class QiangpageComponent implements OnInit {
  public goodsId: any = '';
  public tiyanInfo: any = {
    id: 1
  };
  public imgsarr: any = '';
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    this.titleService.setTitle('立即抢购');
    this.getGoodsInfo(6, JSON.parse(localStorage.getItem('storeInfo'))['id']);
    localStorage.setItem('canshu', '');
    localStorage.setItem('fromPage', '');
    // const  t = this;
    // html2canvas(document.body).then(function(canvas) {
    //   t.imgsarr = canvas.toDataURL('image/jpeg');
    // });
  }
  goPaysure() {
    const skuId = {
      'id': this.tiyanInfo['sku'][0]['id'],
      'goodsId': this.tiyanInfo['sku'][0]['goodsId'],
      'skuSpecId': this.tiyanInfo['sku'][0]['skuSpecId'] || 0,
      'skuStyleId': this.tiyanInfo['sku'][0]['skuStyleId'] || 0,
      'goodsType': this.tiyanInfo['goodsInfo'].type,
    };
    this.router.navigate(['/paysure', {'from': 'qianggou', 'skuIdArr': JSON.stringify(skuId), 'liuchengType': 2}]);
  }
  /**
   * 获取详情页数据
   */
  getGoodsInfo(goodsId: any, shopId: any) {
    this.alertBox.load();
    this.userConfigService.getGoodsInfo(goodsId, shopId)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.tiyanInfo = data['data'];
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }

}
