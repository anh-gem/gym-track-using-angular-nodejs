import { Injectable } from '@angular/core';
import { LoginData } from '../../models/logindata.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workout } from '../../models/workout.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginData) {
    return this.http.post(`${this.API}/members/login`, data, {
      withCredentials: true,
    });
  }
  register(data: any) {
    return this.http.post(`${this.API}/members/register`, data, {
      withCredentials: true,
    });
  }
  getMe(): Observable<any> {
    return this.http.get(`${this.API}/members/me`, {
      withCredentials: true,
    });
  }
  getMyWorkouts(): Observable<any> {
    return this.http.get(`${this.API}/workouts/my`, {
      withCredentials: true,
    });
  }

  createMyWorkouts(data: Workout): Observable<any> {
    return this.http.post(`${this.API}/workouts/`, data, {
      withCredentials: true,
    });
  }

  logout() {
    return this.http.post(`${this.API}/members/logout`, '');
  }

  updateProfile(data: any) {
    return this.http.patch(`${this.API}/members/update`, data, {
      withCredentials: true,
    });
  }

  uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.patch(`${this.API}/members/updatepfp`, formData, {
      withCredentials: true,
    });
  }
}
