import { Component, EventEmitter, Output } from '@angular/core';
import type { Exercise } from '../../../models/exercise.model';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { Workout } from '../../../models/workout.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-workouts-popup',
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './add-workouts-popup.component.html',
  styleUrl: './add-workouts-popup.component.scss',
})
export class AddWorkoutsPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  exercises: Exercise[] = [
    { name: 'Bench Press', category: 'Chest' },
    { name: 'Incline Dumbbell Press', category: 'Chest' },
    { name: 'Push-ups', category: 'Chest' },

    { name: 'Squats', category: 'Legs' },
    { name: 'Lunges', category: 'Legs' },

    { name: 'Deadlift', category: 'Back' },
    { name: 'Pull-ups', category: 'Back' },

    { name: 'Shoulder Press', category: 'Shoulders' },
    { name: 'Bicep Curl', category: 'Arms' },
  ];
  formData: Workout = {
    exercise: this.exercises[0],
    category: '',
    sets: 0,
    reps: 0,
    weight: 0,
    notes: '',
  };
  selectedExercise: Exercise = this.formData.exercise;

  constructor(private authService: AuthService) {}

  onSave() {
    if (!this.selectedExercise) {
      alert('Please select an exercise');
      return;
    }

    if (!this.formData.sets || !this.formData.reps) {
      alert('Please enter sets and reps');
      return;
    }
    this.formData.exercise = this.selectedExercise.name;
    this.formData.category = this.selectedExercise.category;

    // optional handling
    this.formData.weight = this.formData.weight || 0;
    this.formData.notes = this.formData.notes || '';
    this.createWorkout();
  }

  createWorkout() {
    this.authService.createMyWorkouts(this.formData).subscribe({
      next: (response) => {
        console.log(response, 'data has been saved successfully');
        this.save.emit();
        this.close.emit();
      },
      error: (err) => {
        console.log(err, 'Could not save data');
      },
    });
  }
  onClose() {
    this.close.emit();
  }
}
