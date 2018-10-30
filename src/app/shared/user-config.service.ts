import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  constructor(private http: HttpClient ) {}
  // configUrl = 'http://mp.needai.com/mobile/api/base/member';
  configUrl = 'http://scm.3songshu.com//Base/BaseManage/User/GetUserRelationInfo';
  getUserConfig() {
    this.http.get(this.configUrl + '?types=登录信息&pubname=GetUserRelationInfo&_=1540822083283').
    subscribe((data) => {
      console.log(data);
    });
    /**
     * 设置本地存储变量
     */
    localStorage.setItem('userid', '123');
    localStorage.setItem('shopid', '345');
    // return new UserConfig(0, 1 );
  }
}

