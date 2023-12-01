import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserUtilsService {
  constructor() {}

  getUserName(): string {
    return localStorage.getItem('userName') ?? 'Usuario'
  }
}
