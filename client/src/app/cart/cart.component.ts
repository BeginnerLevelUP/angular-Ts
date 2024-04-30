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
import { Product } from '../product';
import {MatMenuModule} from '@angular/material/menu';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatMenuModule,MatCardModule,RouterModule,CommonModule,MatButtonModule,MatTableModule,MatGridListModule,MatChipsModule,MatCheckboxModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  user$={}as WritableSignal<User>
  realted={}as WritableSignal<Product>
  quant:any[]=[]
  constructor(private userService: UserService,private ecommerceService:EcommerceService,private router:Router){}

  ngOnInit(): void {
    this.user$=this.userService.user$
    this.userService.getUserData()
      for (let i: number = 0; i <= 50; i++) {
    this.quant.push(i)
  }
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

  related(category:string){
    this.ecommerceService.getRelated(category)
  } 

  updateCart(id:string,quant:number){
    this.ecommerceService.updateCart(id,quant).subscribe({
      next: () => {
        // this.router.navigate(['/cart']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

  removeCart(id:string,){
    this.ecommerceService.removeCart(id).subscribe({
      next: () => {
        // this.router.navigate(['/cart']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

}