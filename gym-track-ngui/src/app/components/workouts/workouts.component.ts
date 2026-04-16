import { Component, type OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-workouts',
  imports: [],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getMyWorkouts().subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }
}
