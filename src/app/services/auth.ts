import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      name: name,
      email: email,
      password: password
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      password: password
    });
  }

  // Optional: Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Optional: Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

}