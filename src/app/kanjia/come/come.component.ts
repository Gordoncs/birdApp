import {AfterContentInit, Component, OnInit} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-come',
  templateUrl: './come.component.html',
  styleUrls: ['./come.component.css']
})
export class ComeComponent implements OnInit, AfterContentInit {
  public changetitle: any = '帮砍团';
  public iskan = false;
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
  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }
}
