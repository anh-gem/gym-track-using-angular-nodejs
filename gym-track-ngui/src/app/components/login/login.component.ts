import { Component } from '@angular/core';
import { LoginData } from '../../../models/logindata.model';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData: LoginData = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/welcometogymtrack/dashboard']);
      },
      error: (err) => {
        console.log('Login failed', err);
      },
    });
  }
}
