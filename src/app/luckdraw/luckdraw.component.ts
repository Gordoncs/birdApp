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
  userInfo: any = {};
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
    this.getshareClickIt();
    this.getMemberIndexInfo();
  }
  /**
   * 抽奖
   */
  takeOutRedPacket() {
    const t = this;
    const memberId = localStorage.getItem('memberId');
    this.alertBox.load();
    this.userConfigService.takeOutRedPacket(memberId)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.alertBox.draw();
          setTimeout(function () {
            t.alertBox.close();
            t.alertBox.drawResult(data.data);
          }, 900);
        } else {
          this.alertBox.error(data['message']);
        }
      });
  }

  /**
   * 选择抽奖
   */
  choseBox(item) {
    if (this.userInfo.activityRemnant <= 0) {
      this.alertBox.drawerror();
      return;
    }
    for ( let i = 0 ; i < 6 ; i++) {
      this.boxArr[i].isclick = false;
    }
    item.isclick = true;
    this.takeOutRedPacket();
  }
  public getClickIt() {
    this.TongXin.Status2$.subscribe(res => {
      for ( let i = 0 ; i < 6 ; i++) {
        this.boxArr[i].isclick = false;
      }
      this.getMemberIndexInfo();
    });
  }
  public getshareClickIt() {
    this.TongXin.Status3$.subscribe(res => {
      this.router.navigate(['/newergif', {'goodsId': 5}]);
    });
  }
  getMemberIndexInfo() {
    const memberId = localStorage.getItem('memberId');
    // this.alertBox.load();
    this.userConfigService.getMemberIndexInfo(memberId).
    subscribe(data => {
      this.alertBox.close();
      if (data['result']) {
        this.userInfo = data['data'];
      } else {
        this.alertBox.error(data['message']);
      }
    });
  }
  goEffectluck(type) {
    this.userInfo.showtype = type;
    this.router.navigate(['/effectluck', this.userInfo]);
  }
}
