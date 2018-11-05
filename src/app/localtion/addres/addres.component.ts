import { Component, OnInit } from '@angular/core';
declare var  qq: any;
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
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
  constructor() { }

  ngOnInit() {
    this.init();
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
  init() {
    const center = new qq.maps.LatLng(39.914850, 116.403765);
    const map = new qq.maps.Map(
      document.getElementById('container'),
      {
        center: center,
        zoom: 13
      }
    );
    const  markerIcon = new qq.maps.MarkerImage(
        './assets/image/addressIcon.png',
      );
    const latlngs = [
      new qq.maps.LatLng(39.91474, 116.37333),
      new qq.maps.LatLng(39.91447, 116.39336),
      new qq.maps.LatLng(39.90884, 116.41306)
    ];
    for (let i = 0; i < latlngs.length; i++) {
      (function(n) {
        const decoration = new qq.maps.MarkerDecoration(
          '<span style="color:#FFF;font-size:0.2rem;font-weight:bold;">' + n + '</span>'
          , new qq.maps.Point(0, -8));
        const marker = new qq.maps.Marker({
          position: latlngs[n],
          map: map,
          content: '文本标注',
          decoration: decoration
        });
        marker.setIcon(markerIcon);
        qq.maps.event.addListener(marker, 'click', function(event) {
          console.log(event);
        });
      })(i);
    }
  }

}
