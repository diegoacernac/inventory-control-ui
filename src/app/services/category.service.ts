import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../components/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
  ) {}

  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${environment.api}/api/v1/category/active`)
  }

  loadCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/api/v1/category/${id}`)
  }

  saveCategory(category: Category) {
    return this.http.post<Category>(`${environment.api}/api/v1/category`, category)
  }

  updateCategory(id: number, category: Category) {
    return this.http.put<Category>(`${environment.api}/api/v1/category/${id}`, category)
  }

  inactiveCategory(id: number) {
    return this.http.put<Category>(`${environment.api}/api/v1/category/delete/${id}`, null)
  }
}
