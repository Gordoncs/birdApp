import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertboxComponent} from '../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-newercome',
  templateUrl: './newercome.component.html',
  styleUrls: ['./newercome.component.css']
})
export class NewercomeComponent implements OnInit {
  public showTips = false;
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
    this.titleService.setTitle('新人分享');
    this.routerInfo.params.subscribe((params) => this.goodsId = params['goodsId']);
    // const  t = this;
    // html2canvas(document.body).then(function(canvas) {
    //   t.imgsarr = canvas.toDataURL('image/jpeg');
    // });
  }
  goPaysure() {
    const skuId = this.tiyanInfo['sku'][0]['id'];
    this.router.navigate(['/paysure', {'from': 'detail', 'skuIdArr': JSON.stringify(skuId)}]);
  }

}