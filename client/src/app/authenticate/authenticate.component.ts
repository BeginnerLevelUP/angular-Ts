import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signupFormComponent } from '../signupForm/signupForm.component';
import { logininFormComponent } from '../login-form/login-form.component';

import { User } from '../user';
import { UserService } from '../user.service';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [signupFormComponent,logininFormComponent, MatCardModule],
  template: `  
  <div> 
   <mat-card>
      <mat-card-header>
        <mat-card-title>SIGN UP TO SHOP SHOP SHOP SHOP !!!!!</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-signup-form
          (formSubmitted)="addUser($event)"
        ></app-signup-form>
      </mat-card-content>
    </mat-card>

   <mat-card>
      <mat-card-header>
        <mat-card-title>LET'S GET BACK TO SHOPPING</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-login-form
          (formSubmitted)="logUser($event)"
        ></app-login-form>
      </mat-card-content>
    </mat-card>
</div>
  `,
  styles: `
  mat-card{
    width:fit-content;
  }
  div{
    display:flex;
    justify-content:space-around
  }

  `
})
export class AuthenticateComponent {
  constructor(
    private router: Router,
    private userService:UserService
  ) {}

  addUser(user: User) {
    this.userService.register(user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

  logUser(user:{email:string,password:string}){
    this.userService.login(user).subscribe({
       next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    })
  }

}
