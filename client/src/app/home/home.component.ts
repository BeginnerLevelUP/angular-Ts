
import { Component,OnInit,WritableSignal } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AddUserComponent } from '../add-user/add-user.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AddUserComponent,MatChipsModule,MatTabsModule,RouterModule, MatTableModule, MatButtonModule, MatCardModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
users$={}as WritableSignal<User[]>
displayedColumns:string[]=[
  'col-username',
  'col-email',
  'col-password',
  'col-action'
]

constructor(private userService:UserService){}

ngOnInit(): void {
  this.fetchUsers()
}

deleteUser(id:string):void{
  this.userService.deleteUser(id).subscribe({
    next:()=>this.fetchUsers()
  })
}

private fetchUsers():void{
  this.users$=this.userService.users$
  this.userService.getUsers()
}
}
