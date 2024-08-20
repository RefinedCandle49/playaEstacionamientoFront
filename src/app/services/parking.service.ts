import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  // Propiedades
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);
  private newParkingRegistered = new Subject<void>(); // Subject para nofiticar cambios
  private parkingData = new BehaviorSubject<any[]>([]);
  parkingData$ = this.parkingData.asObservable();

  // Métodos públicos
  setParkingData(parking: any[]) {
    this.parkingData.next(parking);
  }

  getFree() {
    return this.http.get('http://localhost:8080/parking/free');
  }

  getOccupied() {
    return this.http.get('http://localhost:8080/parking/occupied');
  }

  create(parking: any) {
    return this.http.post('http://localhost:8080/parking/save', parking).pipe(
      catchError(this.handleError.bind(this)),
      tap(() => {
        this.toastr.success('Se registro correctamente.', 'Operación Exitosa', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-bottom-right',
        });
        this.newParkingRegistered.next();
      })
    );
  }

  getCount() {
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

  getAllDnis() {
    return this.http.get('http://localhost:8080/client/dni');
  }

  getClientebyDni(dni: string) {
    return this.http.get(`http://localhost:8080/client/dni/${dni}`);
  }

  // Métodos privados
  private handleError(error: HttpErrorResponse) {
    if (error.status === 500) {
      this.toastr.error(
        'Por favor, inténtanlo más tarde.',
        'Error del Servidor',
        {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'decreasing',
          positionClass: 'toast-bottom-right',
        }
      );
      console.error('Uy', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
