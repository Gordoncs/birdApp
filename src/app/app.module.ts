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
import { HexiaoComponent } from './hexiao/hexiao.component';
import { MyorderComponent } from './myorder/myorder.component';
import { JustpayComponent } from './justpay/justpay.component';
import { PaystausComponent } from './paystaus/paystaus.component';
import { OrderdetailComponent } from './orderdetail/orderdetail.component';
import { SpecialgoodsComponent } from './specialgoods/specialgoods.component';
import { SharedpageComponent } from './sharedpage/sharedpage.component';
import { NewergifComponent } from './newergif/newergif.component';
import { NewerdecComponent } from './newerdec/newerdec.component';
import { NewercomeComponent } from './newercome/newercome.component';
import { LuckdrawComponent } from './luckdraw/luckdraw.component';
import { AboutpromiseComponent } from './aboutpromise/aboutpromise.component';
import { QiangpageComponent } from './qiangpage/qiangpage.component';
import { FaqiComponent } from './kanjia/faqi/faqi.component';
import { IndecComponent } from './kanjia/indec/indec.component';
import { ComeComponent } from './kanjia/come/come.component';
import { KanlistComponent } from './kanjia/kanlist/kanlist.component';

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
    AlertboxComponent,
    HexiaoComponent,
    MyorderComponent,
    JustpayComponent,
    PaystausComponent,
    OrderdetailComponent,
    SpecialgoodsComponent,
    SharedpageComponent,
    NewergifComponent,
    NewerdecComponent,
    NewercomeComponent,
    LuckdrawComponent,
    AboutpromiseComponent,
    QiangpageComponent,
    FaqiComponent,
    IndecComponent,
    ComeComponent,
    KanlistComponent
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
