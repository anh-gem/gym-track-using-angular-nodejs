import { Component, type OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  selectedMenu: string = 'dashboard';
  member: any = null;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data: any) => {
        this.member = data;
        console.log(this.member);
      },
      error: () => this.router.navigate(['/']),
    });
  }
  onLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: '<span style="color: #333">No</span>',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#10b981', // Blue confirm button
      cancelButtonColor: '#f1f5f9', // Red cancel button
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }
  onImageError(event: any) {
    event.target.src = 'default-avatar.png';
  }
}
