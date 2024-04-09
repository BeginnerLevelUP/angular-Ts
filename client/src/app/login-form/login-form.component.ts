
import { Component,effect,EventEmitter,input,Output,output} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { User } from '../user';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    ],
  template:`
  <form class="employee-form" autocomplete="off" [formGroup]="userForm" (submit)="submitForm()">

    <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput placeholder="Email" formControlName="email" required />
        @if (email?.invalid) {
        <mat-error>Emailv invalid</mat-error>
        }
    </mat-form-field>

    <mat-form-field>
        <mat-label>Password</mat-label>
        <input matInput placeholder="********" formControlName="password" required />
        @if (password?.invalid) {
        <mat-error>Password must be at least 5 characters long.</mat-error>
        }
    </mat-form-field>

    <br />
    <button mat-raised-button color="primary" type="submit" [disabled]="userForm.invalid">
        Login
    </button>
</form>



  `,
  styles:`
form{
  display:flex;
  flex-direction:column;
  justify-content:center
}
  `
})
export class logininFormComponent {

initialState=input<User>()

@Output()
formValuesChanged=new EventEmitter<User>()

@Output()
formSubmitted= new EventEmitter<User>()

userForm=this.formBuilder.group({
  email:['', [Validators.required, Validators.minLength(3)]],
  password:['', [Validators.required, Validators.minLength(3)]]
})

constructor(private formBuilder:FormBuilder,public dialog: MatDialog){
  effect(()=>{
    this.userForm.setValue({
    email:this.initialState()?.email||'',
    password:this.initialState()?.email||'',
    })
  })
}

get email(){
  return this.userForm.get('email')
}
get password(){
  return this.userForm.get('password')
}

submitForm(){
  this.formSubmitted.emit(this.userForm.value as User)
}
}

