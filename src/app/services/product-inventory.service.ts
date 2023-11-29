import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductInventoryService {
  constructor(
    private http: HttpClient,
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/product-inventory`)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/api/v1/product-inventory/${id}`)
  }

  save(product: any) {
    return this.http.post<any>(`${environment.api}/api/v1/product-inventory`, product)
  }
}
