import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params , Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
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
  }
}
