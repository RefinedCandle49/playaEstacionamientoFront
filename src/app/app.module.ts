import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ParkingComponent } from './components/parking/parking.component';
import { FormComponent } from './components/form/form.component';
import { ParkingTableComponent } from './components/parking-table/parking-table.component';
import { HistoryComponent } from './components/history/history.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';

@NgModule({
  declarations: [AppComponent, SidebarComponent, ParkingComponent, FormComponent, ParkingTableComponent, HistoryComponent, HistoryTableComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
