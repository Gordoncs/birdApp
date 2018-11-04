import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {Code404Component} from './code404/code404.component';
import {DetailComponent} from './detail/detail.component';
import {ShopcarComponent} from './shopcar/shopcar.component';
import {MyindexComponent} from './myindex/myindex.component';
import {EffectluckComponent} from './effectluck/effectluck.component';
import {PaysureComponent} from './paysure/paysure.component';


const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'cart', component: ShopcarComponent},
  { path: 'paysure', component: PaysureComponent},
  { path: 'myindex', component: MyindexComponent},
  { path: 'effectluck', component: EffectluckComponent},
  { path: 'detail/:goodsId/:storeId', component: DetailComponent},
  { path: '**', component: Code404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

