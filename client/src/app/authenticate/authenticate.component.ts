import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserFormComponent } from '../user-form/user-form.component';
import { User } from '../user';
import { UserService } from '../user.service';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [UserFormComponent, MatCardModule],
  template: `   
   <mat-card>
      <mat-card-header>
        <mat-card-title>SIGN UP TO SHOP SHOP SHOP SHOP !!!!!</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-user-form
          (formSubmitted)="addUser($event)"
        ></app-user-form>
      </mat-card-content>
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
  constructor(
    private router: Router,
    private userService:UserService
  ) {}

  addUser(user: User) {
    this.userService.createUser(user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
    this.userService.getUsers();
  }
}
