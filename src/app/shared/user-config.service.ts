import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  constructor(private http: HttpClient ) {}
  configUrl = 'http://mp.needai.com/indexView';
  // configUrl = 'http://scm.3songshu.com//Base/BaseManage/User/GetUserRelationInfo';
  getUserConfig() {
    return this.http.get(this.configUrl + '?longitude=70&latitude=80');
    // console.log(localStorage.getItem('userid'));
    // console.log(localStorage.getItem('shopid'));
    // return new UserConfig(0, 1 );
  }
}

