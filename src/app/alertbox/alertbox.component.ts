import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
  styleUrls: ['./alertbox.component.css']
})
export class AlertboxComponent implements OnInit {
  whichStatus: any = 'loading';
  alertMessage: any = '努力加载中...';
  alertShow = false;
  constructor() { }

  ngOnInit() {
  }
  load() {
    this.whichStatus = 'loading';
    this.alertMessage = '努力加载中...';
    this.alertShow = true;
  }
  error(message) {
    this.whichStatus = 'error';
    this.alertMessage = message;
    this.alertShow = true;
  }
  success(message) {
    this.whichStatus = 'success';
    this.alertMessage = message;
    this.alertShow = true;
  }
  close() {
    this.alertShow = false;
  }

}
