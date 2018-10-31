import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-effectluck',
  templateUrl: './effectluck.component.html',
  styleUrls: ['./effectluck.component.css']
})
export class EffectluckComponent implements OnInit {
  public showWitch: any = 1;
  constructor() { }

  ngOnInit() {
  }
  choseit(index) {
    this.showWitch = index;
  }
}
