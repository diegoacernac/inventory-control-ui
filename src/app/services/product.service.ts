import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/product`)
  }

  getAllActive(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/product/active`)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/api/v1/product/${id}`)
  }

  save(product: any) {
    return this.http.post<any>(`${environment.api}/api/v1/product`, product)
  }

  update(id: number, product: any) {
    return this.http.put<any>(`${environment.api}/api/v1/product/${id}`, product)
  }

  inactive(id: number) {
    return this.http.put<any>(`${environment.api}/api/v1/product/delete/${id}`, null)
  }
}
