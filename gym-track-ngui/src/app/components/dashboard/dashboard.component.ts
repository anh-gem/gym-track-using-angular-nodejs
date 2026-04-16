import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AddWorkoutsPopupComponent } from '../add-workouts-popup/add-workouts-popup.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AddWorkoutsPopupComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  member: any = null;
  workouts: any[] = [];
  today = new Date();

  get thisWeekWorkouts(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.workouts.filter((w) => new Date(w.date) >= weekAgo).length;
  }

  get favoriteExercise(): string {
    if (this.workouts.length === 0) return '';
    const count: any = {};
    this.workouts.forEach((w) => {
      count[w.exercise] = (count[w.exercise] || 0) + 1;
    });
    return Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
  }

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

    this.authService.getMyWorkouts().subscribe({
      next: (data: any) => (this.workouts = data),
      error: (err) => console.log(err),
    });
  }

  showPopup = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  handleSave() {
    this.loadWorkouts();
    // call API here
    // this.workoutService.addWorkout(workout).subscribe(...)
  }
  loadWorkouts() {
    this.authService.getMyWorkouts().subscribe({
      next: (data: any) => (this.workouts = [...data]),
      error: (err) => console.log(err),
    });
  }
}
