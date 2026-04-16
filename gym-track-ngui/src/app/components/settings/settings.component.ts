import { Component, type OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  selectedFile!: File;
  user: any = {
    name: '',
    phone: '',
  };
  name: string = '';
  phone: string = '';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (response) => {
        this.user = response;
        console.log(this.user);
      },
    });
  }
  updateProfile() {
    this.name = this.user.name;
    this.phone = this.user.phone;
    this.authService.updateProfile(this.user).subscribe({
      next: (response) => {
        console.log('Registered', response);
      },
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only images allowed');
      return;
    }

    this.selectedFile = file;

    // instant preview
    const reader = new FileReader();
    reader.onload = () => {
      this.user.profilePicture = reader.result;
    };
    reader.readAsDataURL(file);

    // AUTO UPLOAD (no button needed)
    this.authService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (res: any) => {
        console.log('Uploaded:', res);

        // optional: update with actual backend image URL
        this.user.profilePicture = res.member.profilePicture;
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed');
      },
    });
  }
}
