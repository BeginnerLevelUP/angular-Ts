
import { Component,effect,EventEmitter,input,Output,output} from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../user';
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
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
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

constructor(private formBuilder:FormBuilder){
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

