import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params , Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {UserConfigService} from './shared/user-config.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userConfigService: UserConfigService) {}
  public url: any ;
  ngOnInit(): void {
    /***
     * 判断当前实时url
     */
    this.router.events.pipe(
      filter((event: Event ) => event instanceof NavigationEnd)
    ).subscribe(x => {
      this.url = x['url'];
    });
    /**
     * 获取当前用户公共信息
     * 取值方式为：
     *localStorage.setItem("key","value");//存储变量名为key，值为value的变量

     localStorage.key = "value"//存储变量名为key，值为value的变量

     localStorage.getItem("key");//获取存储的变量key的值123

     localStorage.key;//获取存储的变量key的值

     localStorage.removeItem("key")//删除变量名为key的存储变量
     ---------------------
     */
    this.userConfigService.getUserConfig();
  }
}
