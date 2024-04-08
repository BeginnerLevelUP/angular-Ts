import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterModule } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
constructor(private userService:UserService,private router:Router){}
loggedIn:boolean=false

ngOnInit():void{
if(this.userService.isLoggedIn()){
  this.loggedIn=true
}else{
  this.loggedIn=false
}
}

logout():void{
this.userService.logout()
}

login():void{
 this.router.navigate(['/signup']);
}
}
