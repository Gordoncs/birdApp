import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-indec',
  templateUrl: './indec.component.html',
  styleUrls: ['./indec.component.css']
})
export class IndecComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  showqs() {
    const hrefTop = $('#indecbox').offset().top;
    $(window).scrollTop(hrefTop);
  }
}
