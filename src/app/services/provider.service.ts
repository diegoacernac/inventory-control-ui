import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(
    private http: HttpClient,
  ) {}

  getAll(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/provider`)
  }

  getAllActive(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/provider/active`)
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/api/v1/provider/${id}`)
  }

  save(provider: any) {
    return this.http.post<any>(`${environment.api}/api/v1/provider`, provider)
  }

  update(id: number, provider: any) {
    return this.http.put<any>(`${environment.api}/api/v1/provider/${id}`, provider)
  }

  inactive(id: number) {
    return this.http.put<any>(`${environment.api}/api/v1/provider/delete/${id}`, null)
  }
}
