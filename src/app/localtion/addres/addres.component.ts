import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
import wx from 'weixin-js-sdk';
import * as $ from 'jquery';
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
  public city: any = '北京市';
  public searchService: any;
  public searchResults = [];
  public shopArr: any = [];
  public AreaArr: any = [];
  public statusInfo: any = {
    'status': 'have'
  } ;
  public choseInfo: any = {
    'latitude': '',
    'longitude': '',
    'storeInfo': ''
  };
  // public locallat: any = localStorage.getItem('latitude');
  // public locallong: any =  localStorage.getItem('longitude');
  public locallat: any = '';
  public locallong: any =  '';
  // 弹框显示
  @ViewChild(AlertboxComponent)
  alertBox: AlertboxComponent;
  constructor(private router: Router, private titleService: Title, private routerInfo: ActivatedRoute,
              private userConfigService: UserConfigService, private TongXin: TongxinService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    const t = this;
    this.searchService = new qq.maps.SearchService({
      pageCapacity: 30,
      pageIndex: 1,
      complete: function(results) {
        console.log(results);
        t.searchResults = results.detail.pois;
        for (let i = 0 ; i < t.searchResults.length ; i++) {
          if (t.searchResults[i].name.indexOf('公交站') > -1) {
            t.searchResults[i].address = '';
          }
        }
      },
      error: function(e) {
        console.log(e);
        // error doing
      }
    });
    this.routerInfo.params.subscribe((params) => this.statusInfo = params);
    t.getUseAddrArea();
    this.userConfigService.wxConfigFn();
    wx.ready(function() {
      wx.getLocation({
        success: function (res) {
          t.locallat = res.latitude;
          t.locallong = res.longitude;
          if (t.statusInfo.status === 'nohave') {
            // 外省访问
            t.cityChangeFn('北京市');
          } else {
            const citylocation = new qq.maps.CityService();
            // 请求成功回调函数
            citylocation.setComplete(function(result) {
              t.city = result.detail.name;
              let text = '';
              for (let i = 0 ; i < t.AreaArr.length ; i++) {
                text = text + t.AreaArr[i].fullname;
              }
              if (text.indexOf(t.city) < 0) {
                t.AreaArr.push({
                  'fullname': t.city,
                  'latitude': result.detail.latLng.lat,
                  'longitude': result.detail.latLng.lng
                });
              }
              t.changeDetectorRef.markForCheck();
              t.changeDetectorRef.detectChanges();
            });
            citylocation.searchLocalCity();
            t.getNextStoreInfo(t.locallat, t.locallong);
          }
        }
      });
    });
    // t.locallat = '39.908';
    // t.locallong = '116.3974';
    // if (t.statusInfo.status === 'nohave') {
    //   // 外省访问
    //   t.getNextStoreInfo(39.908 , 116.3974);
    // } else {
    //   // 北京本地访问
    //   t.getNextStoreInfo(t.locallat, t.locallong);
    // }
    // t.getNextStoreInfo(39.908 , 116.3974);

  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  init(centerAddress, tipsArrAddress) {
    $('#container').html('');
    const t = this;
    const center = new qq.maps.LatLng(centerAddress.latitude, centerAddress.longitude);
    const map = new qq.maps.Map(
      document.getElementById('container'),
      {
        center: center,
        zoom: 16
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
        if (marker.position.lat * 1 === t.choseInfo.latitude * 1 && marker.position.lng * 1 === t.choseInfo.longitude * 1) {
        // if (marker.position.lat * 1 === t.locallong * 1 && marker.position.lng * 1 === t.locallat * 1) {
          marker.setIcon(markerIconSel);
        } else {
          marker.setIcon(markerIcon);
        }
        qq.maps.event.addListener(marker, 'click', function(event) {
          t.choseClick(event.latLng.lat, event.latLng.lng, event.target.shopInfo);
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
        // const region = new qq.maps.LatLng(39.916527, 116.397128);
        const region = new qq.maps.LatLng(t.locallat, t.locallong);
        t.searchService.searchNearBy(t.searchText, region , 100000);
      }, 300);
    } else {
      t.searchResults = [];
    }
  }
  choseAddress(item) {
    this.searchText = item.name;
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
          this.allInit(latitude, longitude);
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        } else {
          this.allInit(latitude, longitude);
          console.log(data['message']);
        }
      });
  }
  choseClick(latitude, longitude, item) {
    this.choseInfo.latitude = latitude;
    this.choseInfo.longitude = longitude;
    this.choseInfo.storeInfo = JSON.stringify(item);
    const index = this.shopArr.indexOf(item);
    this.shopArr.splice(index, 1);
    this.shopArr.unshift(item);
    this.allInit(latitude, longitude);
    this.isOpen = false;
    $('.shopBox').scrollTop(0);
  }
  sureFn() {
    if (this.choseInfo.latitude && this.choseInfo.longitude && this.choseInfo.storeInfo) {
      localStorage.setItem('latitude', this.choseInfo.latitude);
      localStorage.setItem('longitude', this.choseInfo.longitude);
      localStorage.setItem('storeInfo', this.choseInfo.storeInfo);
      localStorage.setItem('fromaddress', 'yes');
    }
    history.go(-1);
  }
  allInit(latitude , longitude) {
    const centerAddress = {'latitude': latitude, 'longitude': longitude};
    const tipsArrAddress = [];
    for (let i = 0 ; i < this.shopArr.length ; i++) {
      tipsArrAddress.push(
        {'latitude': this.shopArr[i].latitude, 'longitude': this.shopArr[i].longitude, 'shopInfo': this.shopArr[i]}
      );
    }
    this.init(centerAddress, tipsArrAddress);
  }
  restFn() {
    this.allInit(this.locallat, this.locallong);
  }
  changeURL() {
    window.history.pushState(null, null, '/g/');
  }
  getUseAddrArea() {
    this.userConfigService.getUseAddrArea()
      .subscribe((data) => {
        if (data['result']) {
          this.AreaArr = data['data'];
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        } else {
          console.log(data['message']);
        }
      });
  }
  cityChangeFn(cityname) {
    const t = this;
    t.city = cityname;
    for (let i = 0 ; i < this.AreaArr.length ; i++) {
      if (cityname === this.AreaArr[i].fullname) {
        t.locallat = this.AreaArr[i].latitude;
        t.locallong = this.AreaArr[i].longitude;
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
        t.getNextStoreInfo(t.locallat, t.locallong);
      }
    }
  }
}
