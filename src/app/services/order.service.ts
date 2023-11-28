import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/order`)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/api/v1/order/${id}`)
  }

  save(order: any) {
    return this.http.post<any>(`${environment.api}/api/v1/order`, order)
  }

  update(id: number, order: any) {
    return this.http.put<any>(`${environment.api}/api/v1/order/${id}`, order)
  }
}
