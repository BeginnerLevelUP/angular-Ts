
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
  selector: 'app-user-form',
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
        <mat-label>Username</mat-label>
        <input matInput placeholder="Username" formControlName="username" required />
        @if (username?.invalid) {
        <mat-error>Name must be at least 3 characters long.</mat-error>
        }
    </mat-form-field>

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
        Sign Up
    </button>
</form>

<a (click)="openDialog('0ms', '0ms')" >Login In</a>

  `,
  styles:`
  form{
    display:flex;
    flex-direction:column;
  }
  
  `
})
export class UserFormComponent {

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(Dialoge, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

initialState=input<User>()

@Output()
formValuesChanged=new EventEmitter<User>()

@Output()
formSubmitted= new EventEmitter<User>()

userForm=this.formBuilder.group({
  username:['', [Validators.required, Validators.minLength(3)]],
  email:['', [Validators.required, Validators.minLength(3)]],
  password:['', [Validators.required, Validators.minLength(3)]]
})

constructor(private formBuilder:FormBuilder,public dialog: MatDialog){
  effect(()=>{
    this.userForm.setValue({
    username:this.initialState()?.username||'',
    email:this.initialState()?.email||'',
    password:this.initialState()?.email||'',
    })
  })
}

get username(){
return this.userForm.get('username')
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


@Component({
  selector: 'Dialoge',
  template: `
  <h2 mat-dialog-title>Login </h2>
<mat-dialog-content>
Log Back In To Continue Shopping
</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button mat-dialog-close>No</button>
  <button mat-button mat-dialog-close cdkFocusInitial>Ok</button>
</mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class Dialoge {
  constructor(public dialogRef: MatDialogRef<Dialoge>) {}
}