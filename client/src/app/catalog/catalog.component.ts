import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { EcommerceService } from '../ecommerce.service';
import { Product } from '../product';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [MatCardModule,RouterModule,CommonModule,MatButtonModule,MatTableModule,MatGridListModule,MatChipsModule,MatCheckboxModule, FormsModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
products$={}as WritableSignal<Product[]>
constructor(private ecommerceService:EcommerceService,private router:Router) {}
ngOnInit(){
  this.fetchProducts()
}
private fetchProducts():void{
  this.products$=this.ecommerceService.products$
  this.ecommerceService.getProducts()
}

  cart(id:string){
    this.ecommerceService.addToCart(id).subscribe({
      next: () => {
        this.router.navigate(['/cart']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

  favorite(id:string){
    this.ecommerceService.addToFavorite(id).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create user');
        console.error(error);
      },
    });
  }

  filter(category:string|null){
    if(category){
   const byCategory= this.ecommerceService.getRelated(category)
   this.products$=this.ecommerceService.realted$
    }else{
      this.fetchProducts()
    }

  }
}

