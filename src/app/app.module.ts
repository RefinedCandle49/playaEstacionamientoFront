import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
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
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEsPE from '@angular/common/locales/es-PE';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VehicleTypePipe } from './pipes/vehicle-type.pipe';

registerLocaleData(localeEsPE, 'es-PE');

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ParkingComponent,
    FormComponent,
    ParkingTableComponent,
    HistoryComponent,
    HistoryTableComponent,
    VehicleTypePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es-PE' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
