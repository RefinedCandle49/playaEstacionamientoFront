import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private http = inject(HttpClient);
  private newParkingRegistered = new Subject<void>(); // Subject para nofiticar cambios

  getFree() {
    return this.http.get('http://localhost:8080/parking/free');
  }

  getOccupied() {
    return this.http.get('http://localhost:8080/parking/occupied');
  }

  create(parking: any) {
    return this.http.post('http://localhost:8080/parking/save', parking).pipe(
      tap(() => {
        this.newParkingRegistered.next(); // Notificacion de nuevo registro
      })
    );
  }

  getCount(){
    return this.http.get('http://localhost:8080/parking/count');
  }

  getById(id: number) {
    return this.http.get(`http://localhost:8080/parking/get/${id}`);
  }

  update(id: number, parking: any) {
    return this.http.patch(
      `http://localhost:8080/parking/finish/${id}`,
      parking
    );
  }

  getParkingUpdatedListener() {
    return this.newParkingRegistered.asObservable(); // Suscripcion a cambios
  }
}
