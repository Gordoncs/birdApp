import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-paystaus',
  templateUrl: './paystaus.component.html',
  styleUrls: ['./paystaus.component.css']
})
export class PaystausComponent implements OnInit {
  public status = false;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    /***
     * 设置title
     */
    this.titleService.setTitle('支付结果');
    this.routerInfo.params.subscribe((params) => this.status = params['status']);
  }

}
