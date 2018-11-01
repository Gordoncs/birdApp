import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Code404Component } from './code404/code404.component';
import { DetailComponent } from './detail/detail.component';
import {UserConfigService} from './shared/user-config.service';
import {HttpClientModule} from '@angular/common/http';
import { ShopcarComponent } from './shopcar/shopcar.component';
import { MyindexComponent } from './myindex/myindex.component';
import { EffectluckComponent } from './effectluck/effectluck.component';
import { PaysureComponent } from './paysure/paysure.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavbarComponent,
    Code404Component,
    DetailComponent,
    ShopcarComponent,
    MyindexComponent,
    EffectluckComponent,
    PaysureComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [UserConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
