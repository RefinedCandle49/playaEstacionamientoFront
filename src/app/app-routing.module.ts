import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkingComponent } from './components/parking/parking.component';
import { HistoryComponent } from './components/history/history.component';
import {LoginComponent} from "./components/login/login.component";
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {AuthGuard} from "./auth.guard";

const routes: Routes = [

  {
    path:'',
    redirectTo : 'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'',
    component: SidebarComponent,
    children: [
      {
        path:'parking',
        component:ParkingComponent,
        canActivate: [AuthGuard]
      },
      { path: 'history', component: HistoryComponent,
        canActivate: [AuthGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
