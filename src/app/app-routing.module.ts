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
import {SharedpageComponent} from './sharedpage/sharedpage.component';
import {NewergifComponent} from './newergif/newergif.component';
import {NewerdecComponent} from './newerdec/newerdec.component';
import {NewercomeComponent} from './newercome/newercome.component';
import {LuckdrawComponent} from './luckdraw/luckdraw.component';
import {PaystatusGuard} from './shared/paystatus.guard';
import {AboutpromiseComponent} from './aboutpromise/aboutpromise.component';
import {QiangpageComponent} from './qiangpage/qiangpage.component';
import {FaqiComponent} from './kanjia/faqi/faqi.component';
import {IndecComponent} from './kanjia/indec/indec.component';
import {ComeComponent} from './kanjia/come/come.component';
import {KanlistComponent} from './kanjia/kanlist/kanlist.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'cart', component: ShopcarComponent},
  { path: 'paysure', component: PaysureComponent},
  { path: 'justpay', component: JustpayComponent},
  { path: 'paystatus', canDeactivate: [PaystatusGuard], component: PaystausComponent},
  { path: 'myindex', component: MyindexComponent},
  { path: 'myorder', component: MyorderComponent},
  { path: 'orderdetail', component: OrderdetailComponent},
  { path: 'effectluck', component: EffectluckComponent},
  { path: 'goodsdetail', component: DetailComponent},
  { path: 'specialgoods', component: SpecialgoodsComponent},
  { path: 'aboutpromise', component: AboutpromiseComponent},
  { path: 'newergif', component: NewergifComponent},
  { path: 'newerdec', component: NewerdecComponent},
  { path: 'newercome', component: NewercomeComponent},
  { path: 'sharedpage', component: SharedpageComponent},
  { path: 'address', component: AddresComponent},
  { path: 'teacher', component: TeacherComponent},
  { path: 'upload', component: UploadComponent},
  { path: 'hexiao', component: HexiaoComponent},
  { path: 'luckdraw', component: LuckdrawComponent},
  { path: 'qiangpage', component: QiangpageComponent},
  { path: 'kjfaqi', component: FaqiComponent},
  { path: 'kjdec', component: IndecComponent},
  { path: 'kjcome', component: ComeComponent},
  { path: 'kjlist', component: KanlistComponent},
  { path: '**', component: Code404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PaystatusGuard]
})
export class AppRoutingModule {
}

