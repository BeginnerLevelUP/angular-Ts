import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';
@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  template: `


  <mat-card class="example-card">
  <mat-card-header>
    <mat-card-title>Sign Up</mat-card-title>
    <mat-card-subtitle>Create Your Account To SHOP SHOP SHOP!!!!!</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="form-container">

      <mat-form-field>
    <mat-label>Enter your Email</mat-label>
    <input matInput
           placeholder="patMan@123"
           [formControl]="email"
           (blur)="updateEmailErrorMessage()"
           required>
    @if (email.invalid) {
      <mat-error>{{errorMessage}}</mat-error>
    }
  </mat-form-field>

      <mat-form-field>
    <mat-label>Enter your Username</mat-label>
    <input matInput
           placeholder="pat@example.com"
           [formControl]="username"
           (blur)="updateUsernameErrorMessage()"
           required>
    @if (username.invalid) {
      <mat-error>{{errorMessage}}</mat-error>
    }
  </mat-form-field>

        <mat-form-field>
    <mat-label>Enter your Password</mat-label>
    <input matInput
           placeholder="*********"
           [formControl]="password"
           (blur)="updatePasswordErrorMessage()"
           required>
    @if (password.invalid) {
      <mat-error>{{errorMessage}}</mat-error>
    }
  </mat-form-field>

  </mat-card-content>
  <mat-card-actions>
     <button mat-stroked-button color="warn">Cancel</button>
    <button mat-stroked-button color="accent">SignUp</button>
  </mat-card-actions>
</mat-card>
  `,
  styles: `
  .form-container{
    display:flex;
    flex-direction:column;
    justify-content:center;
  }
  `
})
export class AuthenticateComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  username=new FormControl('', [Validators.required,Validators.maxLength(15)]);
  password=new FormControl('', [Validators.required,Validators.minLength(8)]);
  errorMessage = '';

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'Your Email is required';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }

    updateUsernameErrorMessage() {
    if (this.username.hasError('required')) {
      this.errorMessage = 'Your Username is required';
    } else if (this.username.hasError('maxLength')) {
      this.errorMessage = 'Your Username is too long';
    } else {
      this.errorMessage = '';
    }
  }

    updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorMessage = 'Your Password is required';
    } else if (this.password.hasError('minLength')) {
      this.errorMessage = 'Your Password is too short';
    } else {
      this.errorMessage = '';
    }
  }
}
