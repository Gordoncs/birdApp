import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
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
import { AddresComponent } from './localtion/addres/addres.component';
import { UploadComponent } from './upload/upload.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AlertboxComponent } from './alertbox/alertbox.component';

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
    AddresComponent,
    UploadComponent,
    TeacherComponent,
    AlertboxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [
    UserConfigService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
