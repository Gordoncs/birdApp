import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {Code404Component} from './code404/code404.component';
import {DetailComponent} from './detail/detail.component';
import {ShopcarComponent} from './shopcar/shopcar.component';
import {MyindexComponent} from './myindex/myindex.component';
import {EffectluckComponent} from './effectluck/effectluck.component';
import {PaysureComponent} from './paysure/paysure.component';
import {AddresComponent} from './localtion/addres/addres.component';
import {UploadComponent} from './upload/upload.component';
import {TeacherComponent} from './teacher/teacher.component';
import {HexiaoComponent} from './hexiao/hexiao.component';
import {MyorderComponent} from './myorder/myorder.component';
import {JustpayComponent} from './justpay/justpay.component';
import {PaystausComponent} from './paystaus/paystaus.component';
import {OrderdetailComponent} from './orderdetail/orderdetail.component';
import {SpecialgoodsComponent} from './specialgoods/specialgoods.component';


const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'cart', component: ShopcarComponent},
  { path: 'paysure', component: PaysureComponent},
  { path: 'justpay', component: JustpayComponent},
  { path: 'paystatus', component: PaystausComponent},
  { path: 'myindex', component: MyindexComponent},
  { path: 'myorder', component: MyorderComponent},
  { path: 'orderdetail', component: OrderdetailComponent},
  { path: 'effectluck', component: EffectluckComponent},
  { path: 'goodsdetail/:goodsId', component: DetailComponent},
  { path: 'specialgoods', component: SpecialgoodsComponent},
  { path: 'address', component: AddresComponent},
  { path: 'teacher', component: TeacherComponent},
  { path: 'upload', component: UploadComponent},
  { path: 'hexiao', component: HexiaoComponent},
  { path: '**', component: Code404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

