import {AfterContentInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-faqi',
  templateUrl: './faqi.component.html',
  styleUrls: ['./faqi.component.css']
})
export class FaqiComponent implements OnInit, AfterContentInit {
  public changetitle: any = '帮砍团';
  constructor() { }

  ngOnInit() {
  }
  ngAfterContentInit() {
    $('.kanfriendmain').on('touchend', function (e) {
      if ($('.kanfriendmain').scrollTop() >= 258) {
        $('.loadBox').show();
      }
      console.log($('.kanfriendmain').scrollTop(), $('.kanfriendmain').height());
    });
  }
}
