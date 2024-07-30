import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkingComponent } from './components/parking/parking.component';
import { HistoryComponent } from './components/history/history.component';

const routes: Routes = [
  { path: '', component: ParkingComponent },
  { path: 'history', component: HistoryComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
