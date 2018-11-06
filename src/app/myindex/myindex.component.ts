import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myindex',
  templateUrl: './myindex.component.html',
  styleUrls: ['./myindex.component.css']
})
export class MyindexComponent implements OnInit {
  nickname: any = (localStorage.getItem('memberInfo'))['nickname'];
  headimgurl: any = (localStorage.getItem('memberInfo'))['headimgurl'];
  constructor() { }

  ngOnInit() {
  }

}
