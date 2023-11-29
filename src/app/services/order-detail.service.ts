import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  constructor(
    private http: HttpClient,
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/order-detail`)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/api/v1/order-detail/${id}`)
  }

  save(order: any) {
    return this.http.post<any>(`${environment.api}/api/v1/order-detail`, order)
  }

  update(id: number, order: any) {
    return this.http.put<any>(`${environment.api}/api/v1/order-detail/${id}`, order)
  }
}
