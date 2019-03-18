import {Component, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {UserConfigService} from '../../shared/user-config.service';
import {Observable} from 'rxjs';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {TongxinService} from '../../shared/tongxin.service';
@Component({
  selector: 'app-kanlist',
  templateUrl: './kanlist.component.html',
  styleUrls: ['./kanlist.component.css']
})
export class KanlistComponent implements OnInit {

  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;

  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) {
  }

  ngOnInit() {
  }

}
