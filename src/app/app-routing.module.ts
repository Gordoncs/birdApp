import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {Code404Component} from './code404/code404.component';
import {DetailComponent} from './detail/detail.component';
import {ShopcarComponent} from './shopcar/shopcar.component';
import {MyindexComponent} from './myindex/myindex.component';
import {EffectluckComponent} from './effectluck/effectluck.component';


const routes: Routes = [
  { path: '', redirectTo: '/effectluck', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'car', component: ShopcarComponent},
  { path: 'myindex', component: MyindexComponent},
  { path: 'effectluck', component: EffectluckComponent},
  { path: 'detail', component: DetailComponent},
  { path: '**', component: Code404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
