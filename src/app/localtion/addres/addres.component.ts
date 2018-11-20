import {Component, OnInit, ViewChild} from '@angular/core';
declare var  qq: any;
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {AlertboxComponent} from '../../alertbox/alertbox.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {UserConfigService} from '../../shared/user-config.service';
import {TongxinService} from '../../shared/tongxin.service';
@Component({
  selector: 'app-addres',
  templateUrl: './addres.component.html',
  styleUrls: ['./addres.component.css'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        bottom: '1.1rem',
      })),
      state('closed', style({
        bottom: '-2.05rem',
      })),
      transition('open <=> closed', [
        animate('0.1s')
      ])
    ]),
  ]
})
export class AddresComponent implements OnInit {
  public isOpen = true;
  public isfocus = false;
  public searchText = '';
  public searchService: any;
  public searchResults = [];
  public shopArr: any = [];
  public status = 'have';
  public locallat: any = localStorage.getItem('latitude');
  public locallong: any =  localStorage.getItem('longitude');
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService) { }

  ngOnInit() {
    const t = this;
    this.searchService = new qq.maps.SearchService({
      pageCapacity: 5,
      pageIndex: 1,
      complete: function(results) {
        console.log(results);
        t.searchResults = results.detail.pois;
      },
      error: function(e) {
        console.log(e);
        // error doing
      }
    });
    this.routerInfo.params.subscribe((params) => this.status = params['status']);
    if (this.status === 'nohave') {
      // 外省访问
      this.getNextStoreInfo(39.908 , 116.3974);
    } else {
      // 北京本地访问
      this.getNextStoreInfo(localStorage.getItem('latitude'), localStorage.getItem('longitude'));
    }
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  init(centerAddress, tipsArrAddress) {
    const t = this;
    const center = new qq.maps.LatLng(centerAddress.latitude, centerAddress.longitude);
    const map = new qq.maps.Map(
      document.getElementById('container'),
      {
        center: center,
        zoom: 10
      }
    );
    const  markerIcon = new qq.maps.MarkerImage(
        './assets/image/addressIcon.png',
      );
    const  markerIconSel = new qq.maps.MarkerImage(
      './assets/image/addressIconSel.png',
    );
    const latlngs = [
    ];
    for (let i = 0; i < tipsArrAddress.length; i++) {
      latlngs.push(
        new qq.maps.LatLng( tipsArrAddress[i].latitude, tipsArrAddress[i].longitude)
      );
    }
    for (let i = 0; i < latlngs.length; i++) {
      (function(n) {
        const decoration = new qq.maps.MarkerDecoration(
          '<span style="color:#FFF;font-size:0.2rem;font-weight:bold;">' + (n + 1) + '</span>'
          , new qq.maps.Point(0, -8));
        const marker = new qq.maps.Marker({
          position: latlngs[n],
          map: map,
          content: '文本标注',
          decoration: decoration,
          shopInfo: tipsArrAddress[n].shopInfo
        });
        if (marker.position.lat * 1 === t.locallat * 1 && marker.position.lng * 1 === t.locallong * 1) {
        // if (marker.position.lat * 1 === t.locallong * 1 && marker.position.lng * 1 === t.locallat * 1) {
          marker.setIcon(markerIconSel);
        } else {
          marker.setIcon(markerIcon);
        }
        qq.maps.event.addListener(marker, 'click', function(event) {
          t.sureClick(event.latLng.lat, event.latLng.lng, event.target.shopInfo);
        });
      })(i);
    }
  }
  focusFn() {
    this.isfocus = true;
  }
  searchAddress() {
    const t = this;
    if (this.searchText !== '') {
      setTimeout(function() {
        const region = new qq.maps.LatLng(39.916527, 116.397128);
        t.searchService.searchNearBy(t.searchText, region , 100000);
      }, 500);
    }
  }
  choseAddress(item) {
    console.log(item);
    this.getNextStoreInfo(item.latLng.lat, item.latLng.lng);
    this.isfocus = false;
  }

  getNextStoreInfo(latitude, longitude) {
    this.alertBox.load();
    this.userConfigService.getNextStoreInfo(latitude, longitude)
      .subscribe((data) => {
        this.alertBox.close();
        if (data['result']) {
          this.shopArr = data['data'];
          const centerAddress = {'latitude': latitude, 'longitude': longitude};
          const tipsArrAddress = [];
          for (let i = 0 ; i < this.shopArr.length ; i++) {
            tipsArrAddress.push(
              {'latitude': this.shopArr[i].latitude, 'longitude': this.shopArr[i].longitude, 'shopInfo': this.shopArr[i]}
            );
          }
          this.init(centerAddress, tipsArrAddress);
        } else {
          console.log(data['message']);
        }
      });
  }
  sureClick(latitude, longitude, item) {
    alert(latitude);
    alert(longitude);
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('storeInfo', JSON.stringify(item));
    history.go(-1);
  }

}
