import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../shared/user-config.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public cartNum = 0;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService) { }

  ngOnInit() {
    this.cartGetCartDetailNumber();
  }

  cartGetCartDetailNumber() {
    const memberId = 3;
    const storeId = JSON.parse(localStorage.getItem('storeInfo'))['id'];
    this.userConfigService.cartGetCartDetailNumber(memberId, storeId)
      .subscribe((data) => {
        if (data['result']) {
          this.cartNum = data['data'];
        } else {
          alert(data['message']);
        }
      });
  }
}
