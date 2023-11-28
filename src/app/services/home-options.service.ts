import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeOptionsService {
  constructor(
    private http: HttpClient,
  ) {}

  getAllOptionsByMenu(menu: number): Observable<Array<any>>{
    return this.http.get<Array<any>>(`${environment.api}/api/v1/home-option/menu/${menu}`);
  }
}
