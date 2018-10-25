import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Code404Component } from './code404/code404.component';
import { DetailComponent } from './detail/detail.component';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    NavbarComponent,
    Code404Component,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
