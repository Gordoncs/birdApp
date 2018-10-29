import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  constructor(private http: HttpClient ) {}
  getUserConfig(): void {
    // 请求接口赋值

    /**
     * 设置本地存储变量
     */
    localStorage.setItem('userid', '123');
    localStorage.setItem('shopid', '345');
    // return new UserConfig(0, 1 );
  }
}
export class UserConfig {
  constructor(
    public userid: number,
    public shopid: number
  ) {}
}
