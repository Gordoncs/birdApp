import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {Code404Component} from './code404/code404.component';
import {DetailComponent} from './detail/detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/detail', pathMatch: 'full'},
  { path: 'index', component: IndexComponent},
  { path: 'detail', component: DetailComponent},
  { path: '**', component: Code404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
