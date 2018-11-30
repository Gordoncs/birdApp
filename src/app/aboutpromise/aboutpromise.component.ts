import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';
import {TongxinService} from '../shared/tongxin.service';

@Component({
  selector: 'app-aboutpromise',
  templateUrl: './aboutpromise.component.html',
  styleUrls: ['./aboutpromise.component.css']
})
export class AboutpromiseComponent implements OnInit {
  type: any  = '';
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    this.routerInfo.params.subscribe((params) => this.type = params['type']);
  }

}
