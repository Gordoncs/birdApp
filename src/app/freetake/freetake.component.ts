import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-freetake',
  templateUrl: './freetake.component.html',
  styleUrls: ['./freetake.component.css']
})
export class FreetakeComponent implements OnInit {
  public showTips = false;
  public tiyanInfo: any = {
    id: 1
  };
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    this.titleService.setTitle('抢购产品');
  }
  goPaysure() {
    const skuId = this.tiyanInfo['id'];
    this.router.navigate(['/paysure', {'from': 'detail', 'skuIdArr': JSON.stringify(skuId)}]);
  }
}
