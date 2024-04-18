import { Component, WritableSignal} from '@angular/core';
import { UserService } from '../user.service';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { signal } from '@angular/core';
import { User } from '../user';
import { EcommerceService } from '../ecommerce.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatCardModule,RouterModule,CommonModule,MatButtonModule,MatTableModule,MatGridListModule,MatChipsModule,MatCheckboxModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  user$={}as WritableSignal<User>

  constructor(private userService: UserService,private ecommerceService:EcommerceService,private router:Router){}
  

  ngOnInit(): void {
    this.user$=this.userService.user$
    console.log(this.user$())
    this.userService.getUserData()
  }

    favorite(id:string){
    this.ecommerceService.addToFavorite(id).subscribe({
      next: () => {
        this.router.navigate(['/favorite']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

}