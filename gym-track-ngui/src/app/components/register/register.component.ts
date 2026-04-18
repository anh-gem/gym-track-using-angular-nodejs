import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  showPassword = false;
  private API = environment.apiUrl;
  imagePreview: string | null = null;
  firstName: string = '';
  lastName: string = '';
  formData: any = {
    name: '',
    email: '',
    password: '',
    phone: '',
    plan: 'standard',
    image: null as File | null,
  };

  plans = [
    { name: 'basic', price: '₹999/mo' },
    { name: 'standard', price: '₹1499/mo' },
    { name: 'premium', price: '₹1999/mo' },
  ];
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
  ) {}
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only images allowed');
      return;
    }
    this.formData.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  selectPlan(plan: string) {
    this.formData.plan = plan;
  }

  onSubmit() {
    // VALIDATE FORM FIRST
    if (!this.registerForm.valid) {
      alert('Please fill all fields correctly');
      return;
    }

    // VALIDATE NAME
    if (!this.firstName.trim() || !this.lastName.trim()) {
      alert('Please enter first and last name');
      return;
    }
    this.pay();
  }
  onRegister() {
    const formData = new FormData();
    formData.append('name', this.firstName + ' ' + this.lastName);
    formData.append('email', this.formData.email);
    formData.append('password', this.formData.password);
    formData.append('phone', this.formData.phone);
    formData.append('plan', this.formData.plan);
    console.log(this.formData);
    if (this.formData.image) {
      formData.append('image', this.formData.image); // ✅ correct
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registered successfully', response);

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log('Could not be created', err);
      },
    });
  }
  onCancel() {
    this.router.navigate(['/']);
  }
  pay() {
    try {
      const selectedPlan = this.plans.find(
        (p) => p.name === this.formData.plan,
      );
      console.log(Number(selectedPlan?.price.replace(/[^\d]/g, '')));
      this.http
        .post(`${this.API}/order/create-order`, {
          amount: Number(selectedPlan?.price.replace(/[^\d]/g, '')),
        })
        .subscribe((order: any) => {
          const options = {
            key: 'rzp_test_Sd7NQpqT8XGEYJ',
            amount: order.amount,
            currency: 'INR',
            order_id: order.id,

            name: 'Gym Track',
            description: 'Membership Payment',

            prefill: {
              name: this.firstName,
              email: this.formData.email,
              contact: this.formData.phone,
            },

            theme: {
              color: '#2563eb',
            },

            handler: (response: any) => {
              // 🔥 VERY IMPORTANT

              this.http
                .post(`${this.API}/order/verify-payment`, response)
                .subscribe((res: any) => {
                  if (res.success) {
                    console.log('Payment verified ✅');
                    this.onRegister();
                  } else {
                    console.log('Payment failed ❌');
                  }
                });
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        });
    } catch (err) {
      console.error(err);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
