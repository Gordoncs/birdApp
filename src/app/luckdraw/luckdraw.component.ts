import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-luckdraw',
  templateUrl: './luckdraw.component.html',
  styleUrls: ['./luckdraw.component.css']
})
export class LuckdrawComponent implements OnInit {
  public boxArr = [];
  public gifShow = true;
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    this.titleService.setTitle('幸运抽奖');
    for ( let i = 0 ; i < 6 ; i++) {
      const obj = {
        'isclick': false
      };
      this.boxArr.push(obj);
    }
    this.getClickIt();
    // this.getGoodsInfo(this.goodsId, JSON.parse(localStorage.getItem('storeInfo'))['id']);
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
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }

  /**
   * 选择抽奖
   */
  choseBox(item) {
    for ( let i = 0 ; i < 6 ; i++) {
      this.boxArr[i].isclick = false;
    }
    item.isclick = true;
    // this.alertBox.draw();
    // const  t = this;
    // setTimeout(function () {
    //   t.alertBox.close();
    // }, 2000);
    this.alertBox.drawResult(5);
  }
  public getClickIt() {
    this.TongXin.Status2$.subscribe(res => {
      alert('关闭了页面');
      for ( let i = 0 ; i < 6 ; i++) {
        this.boxArr[i].isclick = false;
      }
    });
  }

}
